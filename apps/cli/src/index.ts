import {
	cancel,
	confirm,
	group,
	intro,
	log,
	multiselect,
	outro,
	select,
	spinner,
	text,
} from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { DEFAULT_CONFIG } from "./consts";
import { createProject } from "./helpers/create-project";
import { renderTitle } from "./render-title";
import type {
	PackageManager,
	ProjectConfig,
	ProjectDatabase,
	ProjectFeature,
} from "./types";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getUserPkgManager } from "./utils/get-package-manager";
import { getVersion } from "./utils/get-version";

process.on("SIGINT", () => {
	log.error("Operation cancelled");
	process.exit(0);
});

const program = new Command();

async function gatherConfig(
	flags: Partial<ProjectConfig>,
): Promise<ProjectConfig> {
	const shouldAskGit = flags.git !== false;

	const result = await group(
		{
			projectName: () =>
				text({
					message: "📝 Project name",
					placeholder: "my-better-t-app",
					initialValue: flags.projectName,
					validate: (value) => {
						if (!value) return "Project name is required";
					},
				}),
			database: () =>
				!flags.database
					? select<ProjectDatabase>({
							message: "💾 Select database",
							options: [
								{
									value: "libsql",
									label: "libSQL",
									hint: "✨ (Recommended) - Turso's embedded SQLite database",
								},
								{
									value: "postgres",
									label: "PostgreSQL",
									hint: "🐘 Traditional relational database",
								},
							],
						})
					: Promise.resolve(flags.database),
			auth: () =>
				flags.auth === undefined
					? confirm({
							message: "🔐 Add authentication with Better-Auth?",
						})
					: Promise.resolve(flags.auth),
			features: () =>
				!flags.features
					? multiselect<ProjectFeature>({
							message: "🎯 Select additional features",
							options: [
								{
									value: "docker",
									label: "Docker setup",
									hint: "🐳 Containerize your application",
								},
								{
									value: "github-actions",
									label: "GitHub Actions",
									hint: "⚡ CI/CD workflows",
								},
								{
									value: "SEO",
									label: "Basic SEO setup",
									hint: "🔍 Search engine optimization configuration",
								},
							],
						})
					: Promise.resolve(flags.features),
			git: () =>
				shouldAskGit
					? confirm({
							message: "🗃️ Initialize Git repository?",
							initialValue: true,
						})
					: Promise.resolve(false),
			packageManager: async () => {
				const detectedPackageManager = getUserPkgManager();

				const useDetected = await confirm({
					message: `📦 Use detected package manager (${detectedPackageManager})?`,
				});

				if (useDetected) return detectedPackageManager;

				return select<PackageManager>({
					message: "📦 Select package manager",
					options: [
						{ value: "npm", label: "npm", hint: "Node Package Manager" },
						{
							value: "bun",
							label: "bun",
							hint: "All-in-one JavaScript runtime & toolkit (recommended)",
						},
						{
							value: "pnpm",
							label: "pnpm",
							hint: "Fast, disk space efficient package manager",
						},
						{
							value: "yarn",
							label: "yarn",
							hint: "Fast, reliable, and secure dependency management",
						},
					],
				});
			},
		},
		{
			onCancel: () => {
				cancel("Operation cancelled.");
				process.exit(0);
			},
		},
	);

	return {
		projectName: result.projectName as string,
		database: (result.database as ProjectDatabase) ?? "libsql",
		auth: (result.auth as boolean) ?? true,
		features: (result.features as ProjectFeature[]) ?? [],
		git: (result.git as boolean) ?? true,
		packageManager: (result.packageManager as PackageManager) ?? "npm",
	};
}

async function main() {
	const s = spinner();
	try {
		renderTitle();
		intro(chalk.bold("Creating a new Better-T Stack project"));
		program
			.name("create-better-t-stack")
			.description("Create a new Better-T Stack project")
			.version(getVersion())
			.argument("[project-directory]", "Project name/directory")
			.option("-y, --yes", "Use default configuration")
			.option("--database <type>", "Database type (libsql or postgres)")
			.option("--auth", "Include authentication")
			.option("--no-auth", "Exclude authentication")
			.option("--docker", "Include Docker setup")
			.option("--github-actions", "Include GitHub Actions")
			.option("--seo", "Include SEO setup")
			.option("--no-git", "Skip git initialization")
			.option(
				"--package-manager <type>",
				"Package manager to use (npm, yarn, pnpm, or bun)",
			)
			.parse();

		const options = program.opts();
		const projectDirectory = program.args[0];

		const flagConfig: Partial<ProjectConfig> = {
			projectName: projectDirectory,
			database: options.database as ProjectDatabase,
			auth: options.auth,
			packageManager: options.packageManager as PackageManager,
			git: options.git ?? true,
			features: [
				...(options.docker ? ["docker"] : []),
				...(options.githubActions ? ["github-actions"] : []),
				...(options.seo ? ["SEO"] : []),
			] as ProjectFeature[],
		};

		const config = options.yes
			? {
					...DEFAULT_CONFIG,
					yes: true,
					projectName: projectDirectory ?? DEFAULT_CONFIG.projectName,
					database: options.database ?? DEFAULT_CONFIG.database,
					auth: options.auth ?? DEFAULT_CONFIG.auth,
					git: options.git ?? DEFAULT_CONFIG.git,
					packageManager:
						options.packageManager ?? DEFAULT_CONFIG.packageManager,
					features: [
						...(options.docker ? ["docker"] : []),
						...(options.githubActions ? ["github-actions"] : []),
						...(options.seo ? ["SEO"] : []),
					] as ProjectFeature[],
				}
			: await gatherConfig(flagConfig);

		if (options.yes) {
			s.start("Using default configuration");
			const colorizedConfig = {
				projectName: chalk.green(config.projectName),
				database: chalk.yellow(config.database),
				auth: chalk.cyan(config.auth),
				features: config.features.map((feature) => chalk.magenta(feature)),
				git: chalk.cyan(config.git),
			};

			log.message(
				`${chalk.blue("Project Name: ")}${
					colorizedConfig.projectName
				}\n${chalk.blue("Database: ")}${colorizedConfig.database}\n${chalk.blue(
					"Authentication: ",
				)}${colorizedConfig.auth}\n${chalk.blue("Features: ")}${
					colorizedConfig.features.length
						? colorizedConfig.features.join(", ")
						: chalk.gray("none")
				}\n${chalk.blue("Git Init: ")}${colorizedConfig.git}\n`,
			);

			s.stop("Configuration loaded");
		}

		await createProject(config);

		log.message("You can reproduce this setup with the following command:", {
			symbol: chalk.cyan("🔄"),
		});
		log.info(generateReproducibleCommand(config));

		outro("Project created successfully! 🎉");
	} catch (error) {
		s.stop("Failed");
		if (error instanceof Error) {
			cancel("An unexpected error occurred");
			process.exit(1);
		}
	}
}

main();
