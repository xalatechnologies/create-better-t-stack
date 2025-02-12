import path from "node:path";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import { setupTurso } from "./helpers/db-setup";
import type { ProjectConfig } from "./types";
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

		if (options.git) {
			spinner.start("Initializing git repository...");
			await execa("git", ["init"], { cwd: projectDir });
			spinner.succeed();
		}

		spinner.start("Installing dependencies...");
		await execa("bun", ["install"], { cwd: projectDir });
		spinner.succeed();

		if (options.database === "libsql") {
			await setupTurso(projectDir);
		}

		logger.success("\n✨ Project created successfully!\n");
		logger.info("Next steps:");
		logger.info(`  cd ${options.projectName}`);
		logger.info("  bun dev");
	} catch (error) {
		spinner.fail("Failed to create project");
		logger.error("Error during project creation:", error);
		process.exit(1);
	}
}
