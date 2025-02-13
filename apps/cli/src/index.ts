import { checkbox, confirm, input, select } from "@inquirer/prompts";
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
import { getVersion } from "./utils/get-version";
import { logger } from "./utils/logger";

process.on("SIGINT", () => {
	console.log("\n");
	logger.warn("Operation cancelled");
	process.exit(0);
});

const program = new Command();

async function gatherConfig(
	flags: Partial<ProjectConfig>,
): Promise<ProjectConfig> {
	const config: ProjectConfig = {
		projectName: "",
		database: "libsql",
		auth: true,
		features: [],
		git: flags.git ?? true,
	};

	config.projectName =
		flags.projectName ??
		(await input({
			message: chalk.blue.bold("📝 Project name:"),
			default: "my-better-t-app",
		}));

	console.log();

	if (flags.database) {
		config.database = flags.database;
	} else {
		config.database = await select<ProjectDatabase>({
			message: chalk.blue.bold("💾 Select database:"),
			choices: [
				{
					value: "libsql",
					name: chalk.green("libSQL"),
					description: chalk.dim(
						"✨ (Recommended) - Turso's embedded SQLite database",
					),
				},
				{
					value: "postgres",
					name: chalk.yellow("PostgreSQL"),
					description: chalk.dim("🐘 Traditional relational database"),
				},
			],
		});
	}

	console.log();

	config.auth =
		flags.auth ??
		(await confirm({
			message: chalk.blue.bold("🔐 Add authentication with Better-Auth?"),
			default: true,
		}));

	console.log();

	if (flags.features) {
		config.features = flags.features;
	} else {
		config.features = await checkbox<ProjectFeature>({
			message: chalk.blue.bold("🎯 Select additional features:"),
			choices: [
				{
					value: "docker",
					name: chalk.cyan("Docker setup"),
					description: chalk.dim("🐳 Containerize your application"),
				},
				{
					value: "github-actions",
					name: chalk.magenta("GitHub Actions"),
					description: chalk.dim("⚡ CI/CD workflows"),
				},
				{
					value: "SEO",
					name: chalk.green("Basic SEO setup"),
					description: chalk.dim("🔍 Search engine optimization configuration"),
				},
			],
		});
	}

	return config;
}

async function main() {
	try {
		renderTitle();
		logger.info(chalk.bold(" Creating a new Better-T Stack project...\n"));
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
			logger.info(chalk.blue.bold("\n📦 Using default configuration:"));
			const colorizedConfig = {
				projectName: chalk.green(config.projectName),
				database: chalk.yellow(config.database),
				auth: chalk.cyan(config.auth),
				features: config.features.map((feature) => chalk.magenta(feature)),
				git: chalk.cyan(config.git),
			};

			console.log();
			console.log(
				chalk.dim("├─") +
					chalk.blue(" Project Name: ") +
					colorizedConfig.projectName,
			);
			console.log(
				chalk.dim("├─") + chalk.blue(" Database: ") + colorizedConfig.database,
			);
			console.log(
				chalk.dim("├─") +
					chalk.blue(" Authentication: ") +
					colorizedConfig.auth,
			);
			console.log(
				chalk.dim("├─") +
					chalk.blue(" Features: ") +
					(colorizedConfig.features.length
						? colorizedConfig.features.join(", ")
						: chalk.gray("none")),
			);
			console.log(
				chalk.dim("└─") + chalk.blue(" Git Init: ") + colorizedConfig.git,
			);
			console.log();
		}

		await createProject(config);

		logger.info("\n📋 To reproduce this setup, run:");
		logger.success(chalk.cyan(generateReproducibleCommand(config)));
	} catch (error) {
		if (
			error instanceof Error &&
			(error.name === "ExitPromptError" ||
				error.message.includes("User force closed"))
		) {
			console.log("\n");
			logger.warn("Operation cancelled");
			process.exit(0);
		}

		logger.error("An unexpected error occurred:", error);
		process.exit(1);
	}
}

main();
