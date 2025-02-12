import os from "node:os";
import path from "node:path";
import { confirm, input } from "@inquirer/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import ora, { type Ora } from "ora";
import { logger } from "../utils/logger";
import { isTursoInstalled, isTursoLoggedIn } from "../utils/turso-cli";

async function loginToTurso(spinner: Ora) {
	try {
		spinner.start("Logging in to Turso...");
		await execa("turso", ["auth", "login"]);
		spinner.succeed("Logged in to Turso successfully!");
	} catch (error) {
		spinner.fail("Failed to log in to Turso");
		throw error;
	}
}

async function installTursoCLI(isMac: boolean, spinner: Ora) {
	try {
		spinner.start("Installing Turso CLI...");

		if (isMac) {
			await execa("brew", ["install", "tursodatabase/tap/turso"]);
		} else {
			const installScript = await execa("curl", [
				"-sSfL",
				"https://get.tur.so/install.sh",
			]);
			await execa("bash", [], { input: installScript.stdout });
		}

		spinner.succeed("Turso CLI installed successfully!");
	} catch (error) {
		if (error instanceof Error && error.message.includes("User force closed")) {
			spinner.stop();
			console.log("\n");
			logger.warn("Turso CLI installation cancelled by user");
			throw error;
		}
		spinner.fail("Failed to install Turso CLI");
		throw error;
	}
}

async function createTursoDatabase(projectDir: string, spinner: Ora) {
	try {
		const defaultDbName = path.basename(projectDir);
		const dbName = await input({
			message: `Enter database name (default: ${defaultDbName}):`,
			default: defaultDbName,
		});

		spinner.start(`Creating Turso database "${dbName}"...`);
		await execa("turso", ["db", "create", dbName]);

		const { stdout: dbUrl } = await execa("turso", [
			"db",
			"show",
			dbName,
			"--url",
		]);
		const { stdout: authToken } = await execa("turso", [
			"db",
			"tokens",
			"create",
			dbName,
		]);

		const envPath = path.join(projectDir, "packages/server", ".env");
		const envContent = `TURSO_DATABASE_URL="${dbUrl.trim()}"
TURSO_AUTH_TOKEN="${authToken.trim()}"`;

		await fs.writeFile(envPath, envContent);
		spinner.succeed("Turso database configured successfully!");
	} catch (error) {
		spinner.fail("Failed to create Turso database");
		throw error;
	}
}

async function setupManualConfig(projectDir: string) {
	const envPath = path.join(projectDir, "packages/server", ".env");
	const envContent = `TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=`;

	await fs.writeFile(envPath, envContent);

	logger.info("\n📝 Manual Turso Setup Instructions:");
	logger.info("1. Visit https://turso.tech and create an account");
	logger.info("2. Create a new database from the dashboard");
	logger.info("3. Get your database URL and authentication token");
	logger.info("4. Add these credentials to the .env file in your project root");
	logger.info("\nThe .env file has been created with placeholder variables:");
	logger.info("TURSO_DATABASE_URL=your_database_url");
	logger.info("TURSO_AUTH_TOKEN=your_auth_token");
}

export async function setupTurso(projectDir: string) {
	const spinner = ora();
	const platform = os.platform();
	const isMac = platform === "darwin";
	const canInstallCLI = platform !== "win32";

	if (!canInstallCLI) {
		await setupManualConfig(projectDir);
		return;
	}

	try {
		const isCliInstalled = await isTursoInstalled();

		if (!isCliInstalled) {
			const shouldInstall = await confirm({
				message: "Would you like to install Turso CLI?",
				default: true,
			});

			if (!shouldInstall) {
				await setupManualConfig(projectDir);
				return;
			}

			await installTursoCLI(isMac, spinner);
		}

		const isLoggedIn = await isTursoLoggedIn();
		if (!isLoggedIn) {
			await loginToTurso(spinner);
		}

		await createTursoDatabase(projectDir, spinner);
	} catch (error) {
		logger.error("Error during Turso setup:", error);
		await setupManualConfig(projectDir);
	}
}
