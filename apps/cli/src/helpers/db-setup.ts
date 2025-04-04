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
import { setupPrismaPostgres } from "./prisma-postgres-setup";
import { setupTurso } from "./turso-setup";

export async function setupDatabase(
	projectDir: string,
	databaseType: ProjectDatabase,
	orm: ProjectOrm,
	packageManager: ProjectPackageManager,
	setupTursoDb: boolean,
	setupPrismaPostgresDb: boolean,
): Promise<void> {
	const s = spinner();
	const serverDir = path.join(projectDir, "apps/server");

	if (databaseType === "none") {
		await fs.remove(path.join(serverDir, "src/db"));
		return;
	}

	try {
		if (databaseType === "sqlite") {
			if (orm === "drizzle") {
				addPackageDependency({
					dependencies: ["drizzle-orm", "@libsql/client"],
					devDependencies: ["drizzle-kit"],
					projectDir: serverDir,
				});
			} else if (orm === "prisma") {
				addPackageDependency({
					dependencies: ["@prisma/client"],
					devDependencies: ["prisma"],
					projectDir: serverDir,
				});
			}

			if (setupTursoDb) {
				await setupTurso(projectDir, true);
			}
		} else if (databaseType === "postgres") {
			if (orm === "drizzle") {
				addPackageDependency({
					dependencies: ["drizzle-orm", "postgres"],
					devDependencies: ["drizzle-kit"],
					projectDir: serverDir,
				});
			} else if (orm === "prisma") {
				addPackageDependency({
					dependencies: ["@prisma/client"],
					devDependencies: ["prisma"],
					projectDir: serverDir,
				});

				if (
					databaseType === "postgres" &&
					orm === "prisma" &&
					setupPrismaPostgresDb
				) {
					await setupPrismaPostgres(projectDir, packageManager);
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
