import path from "node:path";
import { log, spinner } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import type {
	ProjectDatabase,
	ProjectOrm,
	ProjectPackageManager,
} from "../types";
import { addPackageDependency } from "../utils/add-package-deps";
import { setupMongoDBAtlas } from "./mongodb-atlas-setup";
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
					dependencies: ["drizzle-orm", "postgres"],
					devDependencies: ["drizzle-kit"],
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
		} else if (
			databaseType === "postgres" &&
			orm === "prisma" &&
			setupPrismaPostgresDb
		) {
			await setupPrismaPostgres(projectDir, packageManager);
		} else if (databaseType === "mongodb" && setupMongoDBAtlasDb) {
			await setupMongoDBAtlas(projectDir);
		}
	} catch (error) {
		s.stop(pc.red("Failed to set up database"));
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		throw error;
	}
}
