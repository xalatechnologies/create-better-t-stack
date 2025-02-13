import os from "node:os";
import path from "node:path";
import {
	cancel,
	confirm,
	group,
	intro,
	isCancel,
	log,
	multiselect,
	outro,
	select,
	spinner,
	tasks,
	text,
} from "@clack/prompts";
import { $ } from "execa";
import fs from "fs-extra";
import { isTursoInstalled, isTursoLoggedIn } from "../utils/turso-cli";

interface TursoConfig {
	dbUrl: string;
	authToken: string;
}

async function loginToTurso() {
	const s = spinner();
	try {
		s.start("Logging in to Turso...");
		await $`turso auth login`;
		s.stop("Logged in to Turso successfully!");
	} catch (error) {
		s.stop("Failed to log in to Turso");
		throw error;
	}
}

async function installTursoCLI(isMac: boolean) {
	const s = spinner();
	try {
		s.start("Installing Turso CLI...");

		if (isMac) {
			await $`brew install tursodatabase/tap/turso`;
		} else {
			const { stdout: installScript } =
				await $`curl -sSfL https://get.tur.so/install.sh`;
			await $`bash -c '${installScript}'`;
		}

		s.stop("Turso CLI installed successfully!");
	} catch (error) {
		if (error instanceof Error && error.message.includes("User force closed")) {
			s.stop();
			log.warn("Turso CLI installation cancelled by user");
			throw new Error("Installation cancelled");
		}
		s.stop("Failed to install Turso CLI");
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
	log.info("📝 Manual Turso Setup Instructions:");
	log.info("1. Visit https://turso.tech and create an account");
	log.info("2. Create a new database from the dashboard");
	log.info("3. Get your database URL and authentication token");
	log.info("4. Add these credentials to the .env file in packages/server/.env");
	log.info("\nThe .env file has been created with placeholder variables:");
	log.info("TURSO_DATABASE_URL=your_database_url");
	log.info("TURSO_AUTH_TOKEN=your_auth_token");
}

export async function setupTurso(projectDir: string) {
	const platform = os.platform();
	const isMac = platform === "darwin";
	const canInstallCLI = platform !== "win32";

	if (!canInstallCLI) {
		log.warn("Automatic Turso setup is not supported on Windows.");
		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
		return;
	}

	try {
		const isCliInstalled = await isTursoInstalled();

		if (!isCliInstalled) {
			const shouldInstall = await confirm({
				message: "Would you like to install Turso CLI?",
			});

			if (isCancel(shouldInstall)) {
				cancel("Operation cancelled");
				process.exit(0);
			}

			if (!shouldInstall) {
				await writeEnvFile(projectDir);
				displayManualSetupInstructions();
				return;
			}

			const s = spinner();
			s.start("Installing Turso CLI...");
			try {
				if (isMac) {
					await $`brew install tursodatabase/tap/turso`;
				} else {
					const { stdout: installScript } =
						await $`curl -sSfL https://get.tur.so/install.sh`;
					await $`bash -c '${installScript}'`;
				}
				s.stop("Turso CLI installed successfully!");
			} catch (error) {
				s.stop("Failed to install Turso CLI");
				throw error;
			}
		}

		const isLoggedIn = await isTursoLoggedIn();
		if (!isLoggedIn) {
			const s = spinner();
			s.start("Logging in to Turso...");
			try {
				await $`turso auth login`;
				s.stop("Logged in to Turso successfully!");
			} catch (error) {
				s.stop("Failed to log in to Turso");
				throw error;
			}
		}

		let success = false;
		let dbName = "";
		let suggestedName = path.basename(projectDir);

		while (!success) {
			const dbNameResponse = await text({
				message: "Enter database name:",
				defaultValue: suggestedName,
			});

			if (isCancel(dbNameResponse)) {
				cancel("Operation cancelled");
				process.exit(0);
			}

			dbName = dbNameResponse as string;
			const s = spinner();

			try {
				s.start(`Creating Turso database "${dbName}"...`);
				const config = await createTursoDatabase(dbName);
				await writeEnvFile(projectDir, config);
				s.stop("Turso database configured successfully!");
				success = true;
			} catch (error) {
				if (error instanceof Error && error.message === "DATABASE_EXISTS") {
					s.stop(`Database "${dbName}" already exists`);
					suggestedName = `${dbName}-${Math.floor(Math.random() * 1000)}`;
				} else {
					throw error;
				}
			}
		}
	} catch (error) {
		log.error(`Error during Turso setup: ${error}`);
		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
		outro("Setup completed with manual configuration required.");
	}
}
