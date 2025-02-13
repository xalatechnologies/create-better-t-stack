import path from "node:path";
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
import fs from "fs-extra";
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
	const result = await group(
		{
			projectName: async () => {
				let isValid = false;
				let projectName: string | symbol = "";
				let defaultName = DEFAULT_CONFIG.projectName;
				let counter = 1;

				while (fs.pathExistsSync(path.resolve(process.cwd(), defaultName))) {
					defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
					counter++;
				}

				while (!isValid) {
					const response = await text({
						message: "📝 What is your project named? (directory name or path)",
						placeholder: defaultName,
						initialValue: flags.projectName,
						defaultValue: defaultName,
						validate: (value) => {
							const nameToUse = value.trim() || defaultName;
							const projectDir = path.resolve(process.cwd(), nameToUse);

							if (fs.pathExistsSync(projectDir)) {
								const dirContents = fs.readdirSync(projectDir);
								if (dirContents.length > 0) {
									return `Directory "${nameToUse}" already exists and is not empty. Please choose a different name.`;
								}
							}

							isValid = true;
							return undefined;
						},
					});

					if (typeof response === "symbol") {
						cancel("Operation cancelled.");
						process.exit(0);
					}

					projectName = response || defaultName;
				}

				return projectName as string;
			},
			database: () =>
				!flags.database
					? select<ProjectDatabase>({
							message: "💾 Which database would you like to use?",
							options: [
								{
									value: "libsql",
									label: "libSQL",
									hint: "Turso's embedded SQLite database (recommended)",
								},
								{
									value: "postgres",
									label: "PostgreSQL",
									hint: "Traditional relational database",
								},
							],
						})
					: Promise.resolve(flags.database),
			auth: () =>
				flags.auth === undefined
					? confirm({
							message:
								"🔐 Would you like to add authentication with Better-Auth?",
						})
					: Promise.resolve(flags.auth),
			features: () =>
				!flags.features
					? multiselect<ProjectFeature>({
							message: "✨ Which features would you like to add?",
							options: [
								{
									value: "docker",
									label: "Docker setup",
									hint: "Containerize your application",
								},
								{
									value: "github-actions",
									label: "GitHub Actions",
									hint: "CI/CD workflows",
								},
								{
									value: "SEO",
									label: "Basic SEO setup",
									hint: "Search engine optimization configuration",
								},
							],
						})
					: Promise.resolve(flags.features),
			git: () =>
				flags.git !== false
					? confirm({
							message: "🗃️ Initialize a new git repository?",
							initialValue: true,
						})
					: Promise.resolve(false),
			packageManager: async () => {
				const detectedPackageManager = getUserPkgManager();

				const useDetected = await confirm({
					message: `📦 Use ${detectedPackageManager} as your package manager?`,
				});

				if (useDetected) return detectedPackageManager;

				return select<PackageManager>({
					message: "📦 Which package manager would you like to use?",
					options: [
						{ value: "npm", label: "npm", hint: "Node Package Manager" },
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
						{
							value: "bun",
							label: "bun",
							hint: "All-in-one JavaScript runtime & toolkit (recommended)",
						},
					],
					initialValue: "bun",
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
		projectName: result.projectName ?? "",
		database: result.database ?? "libsql",
		auth: result.auth ?? true,
		features: result.features ?? [],
		git: result.git ?? true,
		packageManager: result.packageManager ?? "npm",
	};
}

async function main() {
	const s = spinner();
	try {
		process.stdout.write("\x1Bc");
		renderTitle();
		intro(chalk.bold("✨ Creating a new Better-T-Stack project"));
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
				`${chalk.blue("📝 Project Name: ")}${
					colorizedConfig.projectName
				}\n${chalk.blue("💾 Database: ")}${colorizedConfig.database}\n${chalk.blue(
					"🔐 Authentication: ",
				)}${colorizedConfig.auth}\n${chalk.blue("✨ Features: ")}${
					colorizedConfig.features.length
						? colorizedConfig.features.join(", ")
						: chalk.gray("none")
				}\n${chalk.blue("🗃️ Git Init: ")}${colorizedConfig.git}\n`,
			);

			s.stop("Configuration loaded");
		}

		await createProject(config);

		log.info(
			`You can reproduce this setup with the following command:\n${generateReproducibleCommand(config)}`,
		);

		outro("🎉 Project created successfully!");
	} catch (error) {
		s.stop("Failed");
		if (error instanceof Error) {
			cancel("An unexpected error occurred");
			process.exit(1);
		}
	}
}

main();
