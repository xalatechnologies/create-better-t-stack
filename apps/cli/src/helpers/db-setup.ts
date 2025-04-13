import path from "node:path";
import { log, spinner } from "@clack/prompts";
import consola from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import type {
	ProjectDatabase,
	ProjectOrm,
	ProjectPackageManager,
} from "../types";
import { addPackageDependency } from "../utils/add-package-deps";
import { setupMongoDBAtlas } from "./mongodb-atlas-setup";
import { setupNeonPostgres } from "./neon-setup";
import { setupPrismaPostgres } from "./prisma-postgres-setup";
import { setupTurso } from "./turso-setup";

export async function setupDatabase(
	projectDir: string,
	databaseType: ProjectDatabase,
	orm: ProjectOrm,
	packageManager: ProjectPackageManager,
	setupTursoDb: boolean,
	setupPrismaPostgresDb: boolean,
	setupMongoDBAtlasDb: boolean,
	setupNeonPostgresDb: boolean,
): Promise<void> {
	const s = spinner();
	const serverDir = path.join(projectDir, "apps/server");

	if (databaseType === "none") {
		await fs.remove(path.join(serverDir, "src/db"));
		return;
	}

	try {
		if (orm === "prisma") {
			addPackageDependency({
				dependencies: ["@prisma/client"],
				devDependencies: ["prisma"],
				projectDir: serverDir,
			});
		} else if (orm === "drizzle") {
			if (databaseType === "sqlite") {
				addPackageDependency({
					dependencies: ["drizzle-orm", "@libsql/client"],
					devDependencies: ["drizzle-kit"],
					projectDir: serverDir,
				});
			} else if (databaseType === "postgres") {
				addPackageDependency({
					dependencies: ["drizzle-orm", "pg"],
					devDependencies: ["drizzle-kit", "@types/pg"],
					projectDir: serverDir,
				});
			} else if (databaseType === "mysql") {
				addPackageDependency({
					dependencies: ["drizzle-orm", "mysql2"],
					devDependencies: ["drizzle-kit"],
					projectDir: serverDir,
				});
			}
		}

		if (databaseType === "sqlite" && setupTursoDb) {
			await setupTurso(projectDir, orm === "drizzle");
		} else if (databaseType === "postgres") {
			if (orm === "prisma" && setupPrismaPostgresDb) {
				await setupPrismaPostgres(projectDir, packageManager);
			} else if (setupNeonPostgresDb) {
				await setupNeonPostgres(projectDir, packageManager);
			}
		} else if (databaseType === "mongodb" && setupMongoDBAtlasDb) {
			await setupMongoDBAtlas(projectDir);
		}
	} catch (error) {
		s.stop(pc.red("Failed to set up database"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
		throw error;
	}
}
