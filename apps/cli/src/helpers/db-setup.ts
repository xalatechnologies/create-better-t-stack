import path from "node:path";
import { log, spinner } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { addPackageDependency } from "../utils/add-package-deps";
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
				addPackageDependency({
					dependencies: ["drizzle-orm", "drizzle-kit", "@libsql/client"],
					devDependencies: false,
					projectDir: serverDir,
				});
				if (setupTursoDb) {
					await setupTurso(projectDir, true);
				}
			} else if (orm === "prisma") {
				addPackageDependency({
					dependencies: [
						"@prisma/client",
						"@prisma/adapter-libsql",
						"@libsql/client",
					],
					devDependencies: false,
					projectDir: serverDir,
				});
				addPackageDependency({
					dependencies: ["prisma"],
					devDependencies: true,
					projectDir: serverDir,
				});
				if (setupTursoDb) {
					await setupTurso(projectDir, true);
				}
			}
		} else if (databaseType === "postgres") {
			if (orm === "drizzle") {
				addPackageDependency({
					dependencies: ["drizzle-orm", "postgres"],
					devDependencies: false,
					projectDir: serverDir,
				});
				addPackageDependency({
					dependencies: ["drizzle-kit"],
					devDependencies: true,
					projectDir: serverDir,
				});
			} else if (orm === "prisma") {
				addPackageDependency({
					dependencies: ["@prisma/client"],
					devDependencies: false,
					projectDir: serverDir,
				});
				addPackageDependency({
					dependencies: ["prisma"],
					devDependencies: true,
					projectDir: serverDir,
				});
			}
		}

		const packageJsonPath = path.join(serverDir, "package.json");
		if (await fs.pathExists(packageJsonPath)) {
			const packageJson = await fs.readJSON(packageJsonPath);

			if (orm === "drizzle") {
				packageJson.scripts = {
					...packageJson.scripts,
					"db:generate": "drizzle-kit generate",
					"db:migrate": "drizzle-kit push",
					"db:studio": "drizzle-kit studio",
				};
			} else if (orm === "prisma") {
				packageJson.scripts = {
					...packageJson.scripts,
					"prisma:generate": "prisma generate",
					"prisma:push": "prisma db push",
					"prisma:studio": "prisma studio",
				};
			}

			await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
		}

		if (orm === "prisma") {
			const envPath = path.join(serverDir, ".env");
			if (await fs.pathExists(envPath)) {
				const envContent = await fs.readFile(envPath, "utf8");
				if (!envContent.includes("DATABASE_URL")) {
					const databaseUrlLine =
						databaseType === "sqlite"
							? `\nDATABASE_URL="file:./dev.db"`
							: `\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"`;
					await fs.appendFile(envPath, databaseUrlLine);
				}
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
