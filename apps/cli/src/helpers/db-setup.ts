import path from "node:path";
import { log, spinner } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { setupTurso } from "./turso-setup";

export async function setupDatabase(
	projectDir: string,
	databaseType: string,
	orm: string,
	setupTursoDb = true,
): Promise<void> {
	const s = spinner();
	const serverDir = path.join(projectDir, "packages/server");

	if (databaseType === "none") {
		await fs.remove(path.join(serverDir, "src/db"));
		return;
	}

	try {
		if (databaseType === "sqlite") {
			if (orm === "drizzle") {
				await setupDrizzleDependencies(projectDir);
				await setupTurso(projectDir, setupTursoDb);
			} else if (orm === "prisma") {
				await setupPrismaDependencies(projectDir);
				await setupTurso(projectDir, setupTursoDb);
			}
		} else if (databaseType === "postgres") {
			log.info(
				pc.blue(
					"PostgreSQL setup is coming in a future update. Using SQLite configuration for now.",
				),
			);
			if (orm === "drizzle") {
				await setupDrizzleDependencies(projectDir);
				await setupTurso(projectDir, setupTursoDb);
			} else if (orm === "prisma") {
				await setupPrismaDependencies(projectDir);
				await setupTurso(projectDir, setupTursoDb);
			}
		}
	} catch (error) {
		s.stop(pc.red("Failed to set up database"));
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		throw error;
	}
}

async function setupDrizzleDependencies(projectDir: string): Promise<void> {
	const serverDir = path.join(projectDir, "packages/server");

	const packageJsonPath = path.join(serverDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJSON(packageJsonPath);

		packageJson.dependencies = {
			...packageJson.dependencies,
			"drizzle-orm": "^0.38.4",
			"@libsql/client": "^0.14.0",
		};

		packageJson.devDependencies = {
			...packageJson.devDependencies,
			"drizzle-kit": "^0.30.4",
		};

		packageJson.scripts = {
			...packageJson.scripts,
			"db:generate": "drizzle-kit generate",
			"db:migrate": "drizzle-kit push",
			"db:studio": "drizzle-kit studio",
		};

		await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
	}
}

async function setupPrismaDependencies(projectDir: string): Promise<void> {
	const serverDir = path.join(projectDir, "packages/server");

	const packageJsonPath = path.join(serverDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJSON(packageJsonPath);

		packageJson.dependencies = {
			...packageJson.dependencies,
			"@prisma/client": "^5.7.1",
			"@prisma/adapter-libsql": "^5.7.1",
			"@libsql/client": "^0.14.0",
		};

		packageJson.devDependencies = {
			...packageJson.devDependencies,
			prisma: "^5.7.1",
		};

		packageJson.scripts = {
			...packageJson.scripts,
			"prisma:generate": "prisma generate",
			"prisma:push": "prisma db push",
			"prisma:studio": "prisma studio",
		};

		await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
	}

	const envPath = path.join(serverDir, ".env");
	if (await fs.pathExists(envPath)) {
		const envContent = await fs.readFile(envPath, "utf8");
		if (!envContent.includes("DATABASE_URL")) {
			const databaseUrlLine = `\nDATABASE_URL="file:./dev.db"`;
			await fs.appendFile(envPath, databaseUrlLine);
		}
	}
}
