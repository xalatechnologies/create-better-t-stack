import path from "node:path";
import { cancel, confirm, isCancel, log, spinner, tasks } from "@clack/prompts";
import degit from "degit";
import { $ } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../types";
import { configureAuth } from "./auth-setup";
import { createReadme } from "./create-readme";
import { setupTurso } from "./db-setup";
import { setupFeatures } from "./feature-setup";
import { displayPostInstallInstructions } from "./post-installation";

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

		if (options.database === "none") {
			tasksList.push({
				title: "Removing database configuration",
				task: async () => {
					await fs.remove(path.join(projectDir, "packages/server/src/db"));
				},
			});
		}

		tasksList.push({
			title: options.auth
				? "Setting up authentication"
				: "Removing authentication",
			task: async () => {
				await configureAuth(
					projectDir,
					options.auth,
					options.database !== "none",
					options,
				);
			},
		});

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

		if (options.features.length > 0) {
			tasksList.push({
				title: "Setting up additional features",
				task: async () => {
					await setupFeatures(projectDir, options.features);
				},
			});
		}

		await tasks(tasksList);

		if (options.database === "sqlite") {
			await setupTurso(projectDir);
		} else if (options.database === "postgres") {
			log.info(
				pc.blue(
					"PostgreSQL setup is manual. You'll need to set up your own PostgreSQL database and update the connection details in .env",
				),
			);
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

		const rootPackageJsonPath = path.join(projectDir, "package.json");
		if (await fs.pathExists(rootPackageJsonPath)) {
			const packageJson = await fs.readJson(rootPackageJsonPath);

			if (options.auth && options.database !== "none") {
				packageJson.scripts["auth:generate"] =
					"cd packages/server && npx @better-auth/cli generate --output ./src/db/auth-schema.ts";

				if (options.orm === "prisma") {
					packageJson.scripts["prisma:generate"] =
						"cd packages/server && npx prisma generate";
					packageJson.scripts["prisma:push"] =
						"cd packages/server && npx prisma db push";
					packageJson.scripts["prisma:studio"] =
						"cd packages/server && npx prisma studio";

					packageJson.scripts["db:setup"] =
						"npm run auth:generate && npm run prisma:generate && npm run prisma:push";
				} else if (options.orm === "drizzle") {
					packageJson.scripts["drizzle:migrate"] =
						"cd packages/server && npx @better-auth/cli migrate";

					packageJson.scripts["db:setup"] =
						"npm run auth:generate && npm run drizzle:migrate";
				}
			}

			await fs.writeJson(rootPackageJsonPath, packageJson, { spaces: 2 });
		}

		await createReadme(projectDir, options);

		displayPostInstallInstructions(
			options.auth,
			options.database,
			options.projectName,
			options.packageManager,
			shouldInstallDeps,
			options.orm,
		);
	} catch (error) {
		s.stop(pc.red("Failed"));
		if (error instanceof Error) {
			log.error(pc.red(`Error during project creation: ${error.message}`));
			process.exit(1);
		}
	}
}
