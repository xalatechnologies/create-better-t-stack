import os from "node:os";
import path from "node:path";
import { confirm, input } from "@inquirer/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import ora, { type Ora } from "ora";
import { logger } from "../utils/logger";
import { isTursoInstalled, isTursoLoggedIn } from "../utils/turso-cli";

interface TursoConfig {
	dbUrl: string;
	authToken: string;
}

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
			const { stdout: installScript } = await execa("curl", [
				"-sSfL",
				"https://get.tur.so/install.sh",
			]);
			await execa("bash", [], { input: installScript });
		}

		spinner.succeed("Turso CLI installed successfully!");
	} catch (error) {
		if (error instanceof Error && error.message.includes("User force closed")) {
			spinner.stop();
			logger.warn("\nTurso CLI installation cancelled by user");
			throw new Error("Installation cancelled");
		}
		spinner.fail("Failed to install Turso CLI");
		throw error;
	}
}

async function createTursoDatabase(dbName: string): Promise<TursoConfig> {
	try {
		await execa("turso", ["db", "create", dbName]);
	} catch (error) {
		if (error instanceof Error && error.message.includes("already exists")) {
			throw new Error("DATABASE_EXISTS");
		}
		throw error;
	}

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

	return {
		dbUrl: dbUrl.trim(),
		authToken: authToken.trim(),
	};
}

async function writeEnvFile(projectDir: string, config?: TursoConfig) {
	const envPath = path.join(projectDir, "packages/server", ".env");
	const envContent = config
		? `TURSO_DATABASE_URL="${config.dbUrl}"
TURSO_AUTH_TOKEN="${config.authToken}"`
		: `TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=`;

	await fs.writeFile(envPath, envContent);
}

function displayManualSetupInstructions() {
	logger.info("\n📝 Manual Turso Setup Instructions:");
	logger.info("1. Visit https://turso.tech and create an account");
	logger.info("2. Create a new database from the dashboard");
	logger.info("3. Get your database URL and authentication token");
	logger.info(
		"4. Add these credentials to the .env file in packages/server/.env",
	);
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
		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
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
				await writeEnvFile(projectDir);
				displayManualSetupInstructions();
				return;
			}

			await installTursoCLI(isMac, spinner);
		}

		const isLoggedIn = await isTursoLoggedIn();
		if (!isLoggedIn) {
			await loginToTurso(spinner);
		}

		const defaultDbName = path.basename(projectDir);
		let dbName = await input({
			message: `Enter database name (default: ${defaultDbName}):`,
			default: defaultDbName,
		});

		let success = false;
		while (!success) {
			try {
				spinner.start(`Creating Turso database "${dbName}"...`);
				const config = await createTursoDatabase(dbName);
				await writeEnvFile(projectDir, config);
				spinner.succeed("Turso database configured successfully!");
				success = true;
			} catch (error) {
				if (error instanceof Error && error.message === "DATABASE_EXISTS") {
					spinner.warn(`Database "${dbName}" already exists`);
					dbName = await input({
						message: "Please enter a different database name:",
						default: `${dbName}-${Math.floor(Math.random() * 1000)}`,
					});
				} else {
					throw error;
				}
			}
		}
	} catch (error) {
		logger.error("Error during Turso setup:", error);
		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
	}
}
