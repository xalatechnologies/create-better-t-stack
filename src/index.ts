import { checkbox, confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { createProject } from "./create-project";
import { renderTitle } from "./render-title";
import type { ProjectDatabase, ProjectFeature } from "./types";

const program = new Command();

async function main() {
	renderTitle();

	console.log(chalk.bold("\n🚀 Creating a new Better-T Stack project...\n"));

	const projectName = await input({
		message: "Project name:",
		default: "my-better-t-app",
	});

	const database = await select<ProjectDatabase>({
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

	const auth = await confirm({
		message: "Add authentication with Better-Auth?",
		default: true,
	});

	const features = await checkbox<ProjectFeature>({
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

	const projectOptions = {
		projectName,
		git: true,
		database,
		auth,
		features,
	};

	await createProject(projectOptions);
}

program
	.name("create-better-t-stack")
	.description("Create a new Better-T Stack project")
	.version("1.0.0")
	.action(main);

program.parse();
