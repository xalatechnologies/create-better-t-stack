import path from "node:path";
import { confirm, select } from "@inquirer/prompts";
import chalk from "chalk";
import { $ } from "execa";
import fs from "fs-extra";
import ora from "ora";
import { DEFAULT_CONFIG } from "../consts";
import type { PackageManager, ProjectConfig } from "../types";
import { getUserPkgManager } from "../utils/get-package-manager";
import { logger } from "../utils/logger";
import { setupTurso } from "./db-setup";

export async function createProject(options: ProjectConfig) {
	const spinner = ora("Creating project directory...").start();
	const projectDir = path.resolve(process.cwd(), options.projectName);

	try {
		await fs.ensureDir(projectDir);
		spinner.succeed();
		console.log();

		spinner.start("Cloning template repository...");
		await $`npx degit https://github.com/AmanVarshney01/Better-T-Stack.git ${projectDir}`;
		spinner.succeed();
		console.log();

		let shouldInitGit = options.git;

		if (!options.yes && shouldInitGit) {
			shouldInitGit = await confirm({
				message: chalk.blue.bold("🔄 Initialize a git repository?"),
				default: true,
			}).catch((error) => {
				spinner.stop();
				console.log();
				throw error;
			});
		}

		if (shouldInitGit) {
			spinner.start("Initializing git repository...");
			await $`git init ${projectDir}`;
			spinner.succeed();
		}

		const detectedPackageManager = getUserPkgManager();
		let packageManager = options.packageManager ?? detectedPackageManager;

		if (!options.yes) {
			const useDetectedPackageManager = await confirm({
				message: chalk.blue.bold(
					`📦 Use detected package manager (${chalk.cyan(
						detectedPackageManager,
					)})?`,
				),
				default: true,
			}).catch((error) => {
				spinner.stop();
				throw error;
			});

			if (!useDetectedPackageManager) {
				console.log();
				packageManager = await select<PackageManager>({
					message: chalk.blue.bold("📦 Select package manager:"),
					choices: [
						{
							value: "npm",
							name: chalk.yellow("npm"),
							description: chalk.dim("Node Package Manager"),
						},
						{
							value: "yarn",
							name: chalk.blue("yarn"),
							description: chalk.dim(
								"Fast, reliable, and secure dependency management",
							),
						},
						{
							value: "pnpm",
							name: chalk.magenta("pnpm"),
							description: chalk.dim(
								"Fast, disk space efficient package manager",
							),
						},
						{
							value: "bun",
							name: chalk.cyan("bun"),
							description: chalk.dim("All-in-one JavaScript runtime & toolkit"),
						},
					],
				}).catch((error) => {
					spinner.stop();
					throw error;
				});
			}
		}

		const installDeps = await confirm({
			message: chalk.blue.bold(
				`📦 Install dependencies using ${chalk.cyan(packageManager)}?`,
			),
			default: true,
		}).catch((error) => {
			spinner.stop();
			throw error;
		});

		console.log();

		if (installDeps) {
			spinner.start(`📦 Installing dependencies using ${packageManager}...`);
			switch (packageManager ?? DEFAULT_CONFIG.packageManager) {
				case "npm":
					await $`cd ${projectDir} && npm install`;
					break;
				case "yarn":
					await $`cd ${projectDir} && yarn install`;
					break;
				case "pnpm":
					await $`cd ${projectDir} && pnpm install`;
					break;
				case "bun":
					await $`cd ${projectDir} && bun install`;
					break;
				default:
					throw new Error("Unsupported package manager");
			}
			spinner.succeed();
			console.log();
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
		spinner.stop();

		if (
			error instanceof Error &&
			(error.name === "ExitPromptError" ||
				error.message.includes("User force closed"))
		) {
			console.log("\n");
			logger.warn("Operation cancelled");
			process.exit(0);
			return;
		}

		spinner.fail("Failed to create project");
		logger.error("Error during project creation:", error);
		process.exit(1);
	}
}
