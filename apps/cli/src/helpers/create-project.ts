import path from "node:path";
import { cancel, confirm, isCancel, log, spinner, tasks } from "@clack/prompts";
import degit from "degit";
import { $ } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../types";
import { setupTurso } from "./db-setup";

export async function createProject(options: ProjectConfig) {
	const s = spinner();
	const projectDir = path.resolve(process.cwd(), options.projectName);
	let shouldInstallDeps = false;

	try {
		const tasksList = [
			{
				title: "Creating project directory",
				task: async () => {
					await fs.ensureDir(projectDir);
				},
			},
			{
				title: "Cloning template repository",
				task: async () => {
					try {
						const emitter = degit("better-t-stack/Better-T-Stack#bare");
						await emitter.clone(projectDir);
					} catch (error) {
						log.error(pc.red("Failed to clone template repository"));
						if (error instanceof Error) {
							log.error(pc.red(error.message));
						}
						throw error;
					}
				},
			},
		];

		if (options.git) {
			tasksList.push({
				title: "Initializing git repository",
				task: async () => {
					await $({
						cwd: projectDir,
					})`git init`;
				},
			});
		}

		await tasks(tasksList);

		if (options.database === "sqlite") {
			await setupTurso(projectDir);
		} else if (options.database === "postgres") {
			// Handle postgres setup
		}

		const installDepsResponse = await confirm({
			message: `Install dependencies with ${options.packageManager}?`,
		});

		if (isCancel(installDepsResponse)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		shouldInstallDeps = installDepsResponse;

		if (shouldInstallDeps) {
			s.start(`Installing dependencies using ${options.packageManager}...`);
			try {
				await $({
					cwd: projectDir,
				})`${options.packageManager} install`;
				s.stop("Dependencies installed successfully");
			} catch (error) {
				s.stop(pc.red("Failed to install dependencies"));
				if (error instanceof Error) {
					log.error(pc.red(`Installation error: ${error.message}`));
				}
				throw error;
			}
		}

		log.info(`${pc.dim("Next steps:")}
${pc.cyan("cd")} ${options.projectName}${!shouldInstallDeps ? `\n${pc.cyan(options.packageManager)} install` : ""}
${pc.cyan(options.packageManager === "npm" ? "npm run" : options.packageManager)} ${"dev"}`);
	} catch (error) {
		s.stop(pc.red("Failed"));
		if (error instanceof Error) {
			log.error(pc.red(`Error during project creation: ${error.message}`));
			process.exit(1);
		}
	}
}
