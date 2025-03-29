import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type {
	BackendFramework,
	ProjectDatabase,
	ProjectFrontend,
	ProjectOrm,
} from "../types";

export async function copyBaseTemplate(projectDir: string): Promise<void> {
	const templateDir = path.join(PKG_ROOT, "template/base");
	if (!(await fs.pathExists(templateDir))) {
		throw new Error(`Template directory not found: ${templateDir}`);
	}
	await fs.copy(templateDir, projectDir);
}

export async function setupFrontendTemplates(
	projectDir: string,
	frontends: ProjectFrontend[],
): Promise<void> {
	if (!frontends.includes("web")) {
		const webDir = path.join(projectDir, "apps/web");
		if (await fs.pathExists(webDir)) {
			await fs.remove(webDir);
		}
	}

	if (!frontends.includes("native")) {
		const nativeDir = path.join(projectDir, "apps/native");
		if (await fs.pathExists(nativeDir)) {
			await fs.remove(nativeDir);
		}
	} else {
		await fs.writeFile(
			path.join(projectDir, ".npmrc"),
			"node-linker=hoisted\n",
		);
	}
}

export async function setupBackendFramework(
	projectDir: string,
	framework: BackendFramework,
): Promise<void> {
	const frameworkDir = path.join(PKG_ROOT, `template/with-${framework}`);
	if (await fs.pathExists(frameworkDir)) {
		await fs.copy(frameworkDir, projectDir, { overwrite: true });
	}
}

export async function setupOrmTemplate(
	projectDir: string,
	orm: ProjectOrm,
	database: ProjectDatabase,
	auth: boolean,
): Promise<void> {
	if (orm === "none" || database === "none") return;

	const ormTemplateDir = path.join(PKG_ROOT, getOrmTemplateDir(orm, database));

	if (await fs.pathExists(ormTemplateDir)) {
		await fs.copy(ormTemplateDir, projectDir, { overwrite: true });

		if (!auth) {
			if (orm === "prisma") {
				const authSchemaPath = path.join(
					projectDir,
					"apps/server/prisma/schema/auth.prisma",
				);
				if (await fs.pathExists(authSchemaPath)) {
					await fs.remove(authSchemaPath);
				}
			} else if (orm === "drizzle") {
				const authSchemaPath = path.join(
					projectDir,
					"apps/server/src/db/schema/auth.ts",
				);
				if (await fs.pathExists(authSchemaPath)) {
					await fs.remove(authSchemaPath);
				}
			}
		}
	}
}

export async function setupAuthTemplate(
	projectDir: string,
	auth: boolean,
	framework: BackendFramework,
	orm: ProjectOrm,
	database: ProjectDatabase,
): Promise<void> {
	if (!auth) return;

	const authTemplateDir = path.join(PKG_ROOT, "template/with-auth");
	if (await fs.pathExists(authTemplateDir)) {
		const clientAuthDir = path.join(authTemplateDir, "apps/web");
		const projectClientDir = path.join(projectDir, "apps/web");
		await fs.copy(clientAuthDir, projectClientDir, { overwrite: true });

		const serverAuthDir = path.join(authTemplateDir, "apps/server/src");
		const projectServerDir = path.join(projectDir, "apps/server/src");

		await fs.copy(
			path.join(serverAuthDir, "lib/trpc.ts"),
			path.join(projectServerDir, "lib/trpc.ts"),
			{ overwrite: true },
		);

		await fs.copy(
			path.join(serverAuthDir, "routers/index.ts"),
			path.join(projectServerDir, "routers/index.ts"),
			{ overwrite: true },
		);

		const contextFileName = `with-${framework}-context.ts`;
		await fs.copy(
			path.join(serverAuthDir, "lib", contextFileName),
			path.join(projectServerDir, "lib/context.ts"),
			{ overwrite: true },
		);

		const indexFileName = `with-${framework}-index.ts`;
		await fs.copy(
			path.join(serverAuthDir, indexFileName),
			path.join(projectServerDir, "index.ts"),
			{ overwrite: true },
		);

		const authLibFileName = getAuthLibDir(orm, database);
		const authLibSourceDir = path.join(serverAuthDir, authLibFileName);
		if (await fs.pathExists(authLibSourceDir)) {
			const files = await fs.readdir(authLibSourceDir);
			for (const file of files) {
				await fs.copy(
					path.join(authLibSourceDir, file),
					path.join(projectServerDir, "lib", file),
					{ overwrite: true },
				);
			}
		}
	}
}

export async function fixGitignoreFiles(projectDir: string): Promise<void> {
	const gitignorePaths = [
		path.join(projectDir, "_gitignore"),
		path.join(projectDir, "apps/web/_gitignore"),
		path.join(projectDir, "apps/native/_gitignore"),
		path.join(projectDir, "apps/server/_gitignore"),
	];

	for (const gitignorePath of gitignorePaths) {
		if (await fs.pathExists(gitignorePath)) {
			const targetPath = path.join(path.dirname(gitignorePath), ".gitignore");
			await fs.move(gitignorePath, targetPath);
		}
	}
}

function getOrmTemplateDir(orm: ProjectOrm, database: ProjectDatabase): string {
	if (orm === "drizzle") {
		return database === "sqlite"
			? "template/with-drizzle-sqlite"
			: "template/with-drizzle-postgres";
	}

	if (orm === "prisma") {
		return database === "sqlite"
			? "template/with-prisma-sqlite"
			: "template/with-prisma-postgres";
	}

	return "template/base";
}

function getAuthLibDir(orm: ProjectOrm, database: ProjectDatabase): string {
	if (orm === "drizzle") {
		return database === "sqlite"
			? "with-drizzle-sqlite-lib"
			: "with-drizzle-postgres-lib";
	}

	if (orm === "prisma") {
		return database === "sqlite"
			? "with-prisma-sqlite-lib"
			: "with-prisma-postgres-lib";
	}

	throw new Error("Invalid ORM or database configuration for auth setup");
}
