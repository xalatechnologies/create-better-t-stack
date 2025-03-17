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
				await setupDrizzleDependencies(projectDir, "sqlite");
				if (setupTursoDb) {
					await setupTurso(projectDir, true);
				}
			} else if (orm === "prisma") {
				await setupPrismaDependencies(projectDir, "sqlite");
				if (setupTursoDb) {
					await setupTurso(projectDir, true);
				}
			}
		} else if (databaseType === "postgres") {
			if (orm === "drizzle") {
				await setupDrizzleDependencies(projectDir, "postgres");
			} else if (orm === "prisma") {
				await setupPrismaDependencies(projectDir, "postgres");
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

async function setupDrizzleDependencies(
	projectDir: string,
	dbType: string,
): Promise<void> {
	const serverDir = path.join(projectDir, "packages/server");

	const packageJsonPath = path.join(serverDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJSON(packageJsonPath);

		packageJson.dependencies = {
			...packageJson.dependencies,
			"drizzle-orm": "^0.38.4",
		};

		if (dbType === "sqlite") {
			packageJson.dependencies["@libsql/client"] = "^0.14.0";
		} else if (dbType === "postgres") {
			packageJson.dependencies.postgres = "^3.4.5";
		}

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

async function setupPrismaDependencies(
	projectDir: string,
	dbType: string,
): Promise<void> {
	const serverDir = path.join(projectDir, "packages/server");

	const packageJsonPath = path.join(serverDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJSON(packageJsonPath);

		packageJson.dependencies = {
			...packageJson.dependencies,
			"@prisma/client": "^5.7.1",
		};

		if (dbType === "sqlite") {
			packageJson.dependencies["@prisma/adapter-libsql"] = "^5.7.1";
			packageJson.dependencies["@libsql/client"] = "^0.14.0";
		} else if (dbType === "postgres") {
			// PostgreSQL specific dependencies if needed
		}

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
			const databaseUrlLine =
				dbType === "sqlite"
					? `\nDATABASE_URL="file:./dev.db"`
					: `\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"`;
			await fs.appendFile(envPath, databaseUrlLine);
		}
	}
}
