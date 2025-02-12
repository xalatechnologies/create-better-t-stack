import { checkbox, confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { DEFAULT_CONFIG } from "./consts";
import { createProject } from "./create-project";
import { renderTitle } from "./render-title";
import type { ProjectConfig, ProjectDatabase, ProjectFeature } from "./types";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getVersion } from "./utils/get-version";
import { logger } from "./utils/logger";

const program = new Command();

async function gatherConfig(
	flags: Partial<ProjectConfig>,
): Promise<ProjectConfig> {
	const config: ProjectConfig = {
		projectName: "",
		database: "libsql",
		auth: true,
		features: [],
		git: true,
	};

	config.projectName =
		flags.projectName ??
		(await input({
			message: "Project name:",
			default: "my-better-t-app",
		}));

	if (flags.database) {
		config.database = flags.database;
	} else {
		config.database = await select<ProjectDatabase>({
			message: chalk.cyan("Select database:"),
			choices: [
				{
					value: "libsql",
					name: "libSQL",
					description: chalk.dim(
						"(Recommended) - Turso's embedded SQLite database",
					),
				},
				{
					value: "postgres",
					name: "PostgreSQL",
					description: chalk.dim("Traditional relational database"),
				},
			],
		});
	}

	config.auth =
		flags.auth ??
		(await confirm({
			message: "Add authentication with Better-Auth?",
			default: true,
		}));

	if (flags.features) {
		config.features = flags.features;
	} else {
		config.features = await checkbox<ProjectFeature>({
			message: chalk.cyan("Select additional features:"),
			choices: [
				{
					value: "docker",
					name: "Docker setup",
					description: chalk.dim("Containerize your application"),
				},
				{
					value: "github-actions",
					name: "GitHub Actions",
					description: chalk.dim("CI/CD workflows"),
				},
				{
					value: "SEO",
					name: "Basic SEO setup",
					description: chalk.dim("Search engine optimization configuration"),
				},
			],
		});
	}

	return config;
}

async function main() {
	try {
		renderTitle();
		logger.info("\n🚀 Creating a new Better-T Stack project...\n");

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
			.parse();

		const options = program.opts();
		const projectDirectory = program.args[0];

		const flagConfig: Partial<ProjectConfig> = {
			projectName: projectDirectory,
			database: options.database as ProjectDatabase,
			auth: options.auth,
			features: [
				...(options.docker ? ["docker"] : []),
				...(options.githubActions ? ["github-actions"] : []),
				...(options.seo ? ["SEO"] : []),
			] as ProjectFeature[],
		};

		const config = options.yes
			? DEFAULT_CONFIG
			: await gatherConfig(flagConfig);

		if (options.yes) {
			logger.info("Using default configuration");
			logger.info(JSON.stringify(config, null, 2));
		}

		await createProject(config);

		logger.info("\n📋 To reproduce this setup, run:");
		logger.success(chalk.cyan(generateReproducibleCommand(config)));
	} catch (error) {
		if (error instanceof Error && error.message.includes("User force closed")) {
			console.log("\n");
			logger.warn("Operation cancelled by user");
			process.exit(0);
		}
		logger.error("An unexpected error occurred:", error);
		process.exit(1);
	}
}

process.on("SIGINT", () => {
	console.log("\n");
	logger.warn("Operation cancelled by user");
	process.exit(0);
});

main();
