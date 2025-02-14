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
import { Command } from "commander";
import fs from "fs-extra";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "./consts";
import { createProject } from "./helpers/create-project";
import type {
	PackageManager,
	ProjectConfig,
	ProjectDatabase,
	ProjectFeature,
} from "./types";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getUserPkgManager } from "./utils/get-package-manager";
import { getVersion } from "./utils/get-version";
import { renderTitle } from "./utils/render-title";

process.on("SIGINT", () => {
	log.error(pc.red("Operation cancelled"));
	process.exit(0);
});

const program = new Command();

async function gatherConfig(
	flags: Partial<ProjectConfig>,
): Promise<ProjectConfig> {
	const result = await group(
		{
			projectName: async () => {
				if (flags.projectName) return flags.projectName;
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
						cancel(pc.red("Operation cancelled."));
						process.exit(0);
					}

					projectName = response || defaultName;
				}

				return projectName as string;
			},
			database: () =>
				flags.database !== undefined
					? Promise.resolve(flags.database)
					: select<ProjectDatabase>({
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
						}),
			auth: () =>
				flags.auth !== undefined
					? Promise.resolve(flags.auth)
					: confirm({
							message:
								"🔐 Would you like to add authentication with Better-Auth?",
							initialValue: DEFAULT_CONFIG.auth,
						}),
			features: () =>
				flags.features !== undefined
					? Promise.resolve(flags.features)
					: multiselect<ProjectFeature>({
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
							required: false,
						}),
			git: () =>
				flags.git !== undefined
					? Promise.resolve(flags.git)
					: confirm({
							message: "🗃️ Initialize a new git repository?",
							initialValue: DEFAULT_CONFIG.git,
						}),
			packageManager: async () => {
				if (flags.packageManager !== undefined) {
					return flags.packageManager;
				}
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
				cancel(pc.red("Operation cancelled."));
				process.exit(0);
			},
		},
	);

	return {
		projectName: result.projectName ?? DEFAULT_CONFIG.projectName,
		database: result.database ?? DEFAULT_CONFIG.database,
		auth: result.auth ?? DEFAULT_CONFIG.auth,
		features: result.features ?? DEFAULT_CONFIG.features,
		git: result.git ?? DEFAULT_CONFIG.git,
		packageManager: result.packageManager ?? DEFAULT_CONFIG.packageManager,
	};
}

function displayConfig(config: Partial<ProjectConfig>) {
	const configDisplay = [];

	if (config.projectName) {
		configDisplay.push(`${pc.blue("📝 Project Name:")} ${config.projectName}`);
	}
	if (config.database) {
		configDisplay.push(`${pc.blue("💾 Database:")} ${config.database}`);
	}
	if (config.auth !== undefined) {
		configDisplay.push(`${pc.blue("🔐 Authentication:")} ${config.auth}`);
	}
	if (config.features?.length) {
		configDisplay.push(
			`${pc.blue("✨ Features:")} ${config.features.join(", ")}`,
		);
	}
	if (config.git !== undefined) {
		configDisplay.push(`${pc.blue("🗃️ Git Init:")} ${config.git}`);
	}
	if (config.packageManager) {
		configDisplay.push(
			`${pc.blue("📦 Package Manager:")} ${config.packageManager}`,
		);
	}

	return configDisplay.join("\n");
}

async function main() {
	const s = spinner();
	try {
		process.stdout.write("\x1Bc");
		renderTitle();
		intro(pc.magenta("✨ Creating a new Better-T-Stack project"));
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
			.option("--git", "Include git setup")
			.option("--no-git", "Skip git initialization")
			.option("--npm", "Use npm package manager")
			.option("--pnpm", "Use pnpm package manager")
			.option("--yarn", "Use yarn package manager")
			.option("--bun", "Use bun package manager")
			.parse();

		const options = program.opts();
		const projectDirectory = program.args[0];

		const flagConfig: Partial<ProjectConfig> = {
			projectName: projectDirectory || undefined,
			database: options.database as ProjectDatabase | undefined,
			auth: "auth" in options ? options.auth : undefined,
			packageManager: options.npm
				? "npm"
				: options.pnpm
					? "pnpm"
					: options.yarn
						? "yarn"
						: options.bun
							? "bun"
							: undefined,
			git: "git" in options ? options.git : undefined,
			features:
				options.docker || options.githubActions || options.seo
					? ([
							...(options.docker ? ["docker"] : []),
							...(options.githubActions ? ["github-actions"] : []),
							...(options.seo ? ["SEO"] : []),
						] as ProjectFeature[])
					: undefined,
		};

		if (
			!options.yes &&
			Object.values(flagConfig).some((v) => v !== undefined)
		) {
			log.info(pc.yellow("🎯 Using these pre-selected options:"));
			log.message(displayConfig(flagConfig));
			log.message("");
		}

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
			log.info(pc.yellow("🎯 Using these default options:"));
			log.message(displayConfig(config));
			log.message("");
		}

		await createProject(config);

		log.success(
			pc.blue(
				`You can reproduce this setup with the following command:\n${pc.white(
					generateReproducibleCommand(config),
				)}`,
			),
		);

		outro(pc.magenta("🎉 Project created successfully!"));
	} catch (error) {
		s.stop(pc.red("Failed"));
		if (error instanceof Error) {
			cancel(pc.red("An unexpected error occurred"));
			process.exit(1);
		}
	}
}

main();
