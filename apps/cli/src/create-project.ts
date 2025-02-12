import path from "node:path";
import { confirm, select } from "@inquirer/prompts";
import { detect } from "detect-package-manager";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import { setupTurso } from "./helpers/db-setup";
import type { PackageManager, ProjectConfig } from "./types";
import { logger } from "./utils/logger";

export async function createProject(options: ProjectConfig) {
	const spinner = ora("Creating project directory...").start();
	const projectDir = path.resolve(process.cwd(), options.projectName);

	try {
		await fs.ensureDir(projectDir);
		spinner.succeed();

		spinner.start("Cloning template repository...");
		await execa("npx", [
			"degit",
			"https://github.com/AmanVarshney01/Better-T-Stack.git",
			projectDir,
		]);
		spinner.succeed();

		const initGit = await confirm({
			message: "Initialize a git repository?",
			default: true,
		});

		if (initGit) {
			spinner.start("Initializing git repository...");
			await execa("git", ["init"], { cwd: projectDir });
			spinner.succeed();
		}

		let packageManager = options.packageManager;

		if (!packageManager) {
			const detectedPackageManager = await detect();

			const useDetectedPackageManager = await confirm({
				message: `Use detected package manager (${detectedPackageManager})?`,
				default: true,
			});

			if (useDetectedPackageManager) {
				packageManager = detectedPackageManager;
			} else {
				packageManager = await select<PackageManager>({
					message: "Select package manager:",
					choices: [
						{ value: "npm", name: "npm" },
						{ value: "yarn", name: "yarn" },
						{ value: "pnpm", name: "pnpm" },
						{ value: "bun", name: "bun" },
					],
				});
			}
		}

		const installDeps = await confirm({
			message: `Install dependencies using ${packageManager}?`,
			default: true,
		});

		if (installDeps) {
			spinner.start(`Installing dependencies using ${packageManager}...`);
			switch (packageManager) {
				case "npm":
					await execa("npm", ["install"], { cwd: projectDir });
					break;
				case "yarn":
					await execa("yarn", ["install"], { cwd: projectDir });
					break;
				case "pnpm":
					await execa("pnpm", ["install"], { cwd: projectDir });
					break;
				case "bun":
					await execa("bun", ["install"], { cwd: projectDir });
					break;
				default:
					throw new Error("Unsupported package manager");
			}
			spinner.succeed();
		}

		if (options.database === "libsql") {
			await setupTurso(projectDir);
		}

		logger.success("\n✨ Project created successfully!\n");
		logger.info("Next steps:");
		logger.info(`  cd ${options.projectName}`);
		if (!installDeps) {
			logger.info(`  ${packageManager} install`);
		}
		logger.info(
			`  ${packageManager === "npm" ? "npm run" : packageManager} dev`,
		);
	} catch (error) {
		spinner.fail("Failed to create project");
		logger.error("Error during project creation:", error);
		process.exit(1);
	}
}
