import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../types";
import { generateAuthSecret } from "./auth-setup";

export async function setupEnvironmentVariables(
	projectDir: string,
	options: ProjectConfig,
): Promise<void> {
	const serverDir = path.join(projectDir, "packages/server");
	const clientDir = path.join(projectDir, "packages/client");

	const envPath = path.join(serverDir, ".env");
	let envContent = "";

	if (await fs.pathExists(envPath)) {
		envContent = await fs.readFile(envPath, "utf8");
	}

	if (options.auth) {
		if (!envContent.includes("BETTER_AUTH_SECRET")) {
			envContent += `\nBETTER_AUTH_SECRET=${generateAuthSecret()}`;
		}

		if (!envContent.includes("BETTER_AUTH_URL")) {
			envContent += "\nBETTER_AUTH_URL=http://localhost:3000";
		}

		if (!envContent.includes("CORS_ORIGIN")) {
			envContent += "\nCORS_ORIGIN=http://localhost:3001";
		}
	}

	if (options.database !== "none") {
		if (options.orm === "prisma" && !envContent.includes("DATABASE_URL")) {
			const databaseUrlLine =
				options.database === "sqlite"
					? ""
					: `\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"`;
			envContent += databaseUrlLine;
		}

		if (
			options.database === "sqlite" &&
			options.turso &&
			!envContent.includes("TURSO_CONNECTION_URL")
		) {
			envContent += "\nTURSO_CONNECTION_URL=http://127.0.0.1:8080";
		}
	}

	await fs.writeFile(envPath, envContent.trim());

	if (options.auth) {
		const clientEnvPath = path.join(clientDir, ".env");
		if (!(await fs.pathExists(clientEnvPath))) {
			const clientEnvContent = "VITE_SERVER_URL=http://localhost:3000\n";
			await fs.writeFile(clientEnvPath, clientEnvContent);
		}
	}
}
