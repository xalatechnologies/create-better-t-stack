import os from "node:os";
import path from "node:path";
import { confirm, input } from "@inquirer/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import ora, { type Ora } from "ora";

async function isTursoInstalled() {
	try {
		await execa("turso", ["--version"]);
		return true;
	} catch {
		return false;
	}
}

async function isTursoLoggedIn() {
	try {
		await execa("turso", ["auth", "whoami"]);
		return true;
	} catch {
		return false;
	}
}

async function installTursoCLI(isMac: boolean, spinner: Ora) {
	try {
		if (await isTursoLoggedIn()) {
			spinner.succeed("Turso CLI already logged in!");
			return;
		}

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

		spinner.start("Logging in to Turso...");
		await execa("turso", ["auth", "login"]);
		spinner.succeed("Logged in to Turso!");
	} catch (error) {
		console.error(error);
		spinner.fail(
			"Failed to install Turso CLI. Proceeding with manual setup...",
		);
	}
}

export async function setupTurso(projectDir: string) {
	const spinner = ora();
	const platform = os.platform();

	const isMac = platform === "darwin";
	let canInstallCLI = platform !== "win32";
	let installTurso = true;

	const isCliInstalled = await isTursoInstalled();

	if (canInstallCLI && !isCliInstalled) {
		installTurso = await confirm({
			message: "Would you like to install Turso CLI?",
			default: true,
		});
	}

	canInstallCLI = canInstallCLI && installTurso;

	if (canInstallCLI) {
		try {
			await installTursoCLI(isMac, spinner);

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
			return;
		} catch (error) {
			console.error(error);
			spinner.fail(
				"Failed to install Turso CLI. Proceeding with manual setup...",
			);
			installTurso = false;
		}
	}

	if (!installTurso) {
		const envPath = path.join(projectDir, "packages/server", ".env");
		const envContent = `TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=`;

		await fs.writeFile(envPath, envContent);

		console.log("\n📝 Manual Turso Setup Instructions:");
		console.log("1. Visit https://turso.tech and create an account");
		console.log("2. Create a new database from the dashboard");
		console.log("3. Get your database URL and authentication token");
		console.log(
			"4. Add these credentials to the .env file in your project root",
		);
		console.log("\nThe .env file has been created with placeholder variables:");
		console.log("TURSO_DATABASE_URL=your_database_url");
		console.log("TURSO_AUTH_TOKEN=your_auth_token");
	}
}
