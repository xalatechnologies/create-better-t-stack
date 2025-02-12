import { checkbox, confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { createProject } from "./create-project";
import { renderTitle } from "./render-title";
import type { ProjectDatabase, ProjectFeature } from "./types";
import { getVersion } from "./utils/get-version";
import { logger } from "./utils/logger";

const program = new Command();

type CliOptions = {
	yes: boolean;
};

async function main(options: CliOptions) {
	try {
		renderTitle();
		console.log(chalk.bold("\n🚀 Creating a new Better-T Stack project...\n"));

		const defaults = {
			projectName: "my-better-t-app",
			database: "libsql" as ProjectDatabase,
			auth: true,
			features: [] as ProjectFeature[],
		};

		const projectName = options.yes
			? defaults.projectName
			: await input({
					message: "Project name:",
					default: defaults.projectName,
				});

		const database = options.yes
			? defaults.database
			: await select<ProjectDatabase>({
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

		const auth = options.yes
			? defaults.auth
			: await confirm({
					message: "Add authentication with Better-Auth?",
					default: defaults.auth,
				});

		const features = options.yes
			? defaults.features
			: await checkbox<ProjectFeature>({
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
							description: chalk.dim(
								"Search engine optimization configuration",
							),
						},
					],
				});

		if (options.yes) {
			logger.info("Using default values due to -y flag");
		}

		const projectOptions = {
			projectName,
			git: true,
			database,
			auth,
			features,
		};

		await createProject(projectOptions);
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

program
	.name("create-better-t-stack")
	.description("Create a new Better-T Stack project")
	.version(getVersion())
	.option("-y, --yes", "Accept all defaults")
	.action((options) => main(options));

program.parse();
