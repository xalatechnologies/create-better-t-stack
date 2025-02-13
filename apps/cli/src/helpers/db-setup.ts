import os from "node:os";
import path from "node:path";
import * as p from "@clack/prompts";
import { $ } from "execa";
import fs from "fs-extra";
import { isTursoInstalled, isTursoLoggedIn } from "../utils/turso-cli";

interface TursoConfig {
	dbUrl: string;
	authToken: string;
}

async function loginToTurso() {
	const spinner = p.spinner();
	try {
		spinner.start("Logging in to Turso...");
		await $`turso auth login`;
		spinner.stop("Logged in to Turso successfully!");
	} catch (error) {
		spinner.stop("Failed to log in to Turso");
		throw error;
	}
}

async function installTursoCLI(isMac: boolean) {
	const spinner = p.spinner();
	try {
		spinner.start("Installing Turso CLI...");

		if (isMac) {
			await $`brew install tursodatabase/tap/turso`;
		} else {
			const { stdout: installScript } =
				await $`curl -sSfL https://get.tur.so/install.sh`;
			await $`bash -c '${installScript}'`;
		}

		spinner.stop("Turso CLI installed successfully!");
	} catch (error) {
		if (error instanceof Error && error.message.includes("User force closed")) {
			spinner.stop();
			p.log.warn("Turso CLI installation cancelled by user");
			throw new Error("Installation cancelled");
		}
		spinner.stop("Failed to install Turso CLI");
		throw error;
	}
}

async function createTursoDatabase(dbName: string): Promise<TursoConfig> {
	try {
		await $`turso db create ${dbName}`;
	} catch (error) {
		if (error instanceof Error && error.message.includes("already exists")) {
			throw new Error("DATABASE_EXISTS");
		}
		throw error;
	}

	const { stdout: dbUrl } = await $`turso db show ${dbName} --url`;
	const { stdout: authToken } = await $`turso db tokens create ${dbName}`;

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
	p.log.info("📝 Manual Turso Setup Instructions:");
	p.log.info("1. Visit https://turso.tech and create an account");
	p.log.info("2. Create a new database from the dashboard");
	p.log.info("3. Get your database URL and authentication token");
	p.log.info(
		"4. Add these credentials to the .env file in packages/server/.env",
	);
	p.log.info("\nThe .env file has been created with placeholder variables:");
	p.log.info("TURSO_DATABASE_URL=your_database_url");
	p.log.info("TURSO_AUTH_TOKEN=your_auth_token");
}

export async function setupTurso(projectDir: string) {
	p.intro("Setting up Turso...");

	const platform = os.platform();
	const isMac = platform === "darwin";
	const canInstallCLI = platform !== "win32";

	try {
		if (!canInstallCLI) {
			p.log.warn("Automatic Turso setup is not supported on Windows.");
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
			return;
		}

		const isCliInstalled = await isTursoInstalled();

		if (!isCliInstalled) {
			const shouldInstall = await p.confirm({
				message: "Would you like to install Turso CLI?",
			});

			if (p.isCancel(shouldInstall)) {
				p.cancel("Operation cancelled");
				process.exit(0);
			}

			if (!shouldInstall) {
				await writeEnvFile(projectDir);
				displayManualSetupInstructions();
				return;
			}

			await installTursoCLI(isMac);
		}

		const isLoggedIn = await isTursoLoggedIn();
		if (!isLoggedIn) {
			await loginToTurso();
		}

		let success = false;
		let dbName = "";
		let suggestedName = path.basename(projectDir);

		while (!success) {
			const dbNameResponse = await p.text({
				message: "Enter database name:",
				defaultValue: suggestedName,
			});

			if (p.isCancel(dbNameResponse)) {
				p.cancel("Operation cancelled");
				process.exit(0);
			}

			dbName = dbNameResponse as string;
			const spinner = p.spinner();

			try {
				spinner.start(`Creating Turso database "${dbName}"...`);
				const config = await createTursoDatabase(dbName);
				await writeEnvFile(projectDir, config);
				spinner.stop("Turso database configured successfully!");
				success = true;
			} catch (error) {
				if (error instanceof Error && error.message === "DATABASE_EXISTS") {
					spinner.stop(`Database "${dbName}" already exists`);
					suggestedName = `${dbName}-${Math.floor(Math.random() * 1000)}`;
				} else {
					throw error;
				}
			}
		}

		p.outro("Turso setup completed successfully!");
	} catch (error) {
		p.log.error(`Error during Turso setup: ${error}`);
		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
		p.outro("Setup completed with manual configuration required.");
	}
}
