import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type { ProjectDatabase, ProjectOrm } from "../types";

export async function copyBaseTemplate(projectDir: string): Promise<void> {
	const templateDir = path.join(PKG_ROOT, "template/base");
	if (!(await fs.pathExists(templateDir))) {
		throw new Error(`Template directory not found: ${templateDir}`);
	}
	await fs.copy(templateDir, projectDir);
}

export async function setupAuthTemplate(
	projectDir: string,
	auth: boolean,
): Promise<void> {
	if (!auth) return;

	const authTemplateDir = path.join(PKG_ROOT, "template/with-auth");
	if (await fs.pathExists(authTemplateDir)) {
		await fs.copy(authTemplateDir, projectDir, { overwrite: true });
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

		const serverSrcPath = path.join(projectDir, "apps/server/src");
		const libPath = path.join(serverSrcPath, "lib");
		const withAuthLibPath = path.join(serverSrcPath, "with-auth-lib");

		if (auth) {
			if (await fs.pathExists(withAuthLibPath)) {
				await fs.remove(libPath);
				await fs.move(withAuthLibPath, libPath);
			}
		} else {
			await fs.remove(withAuthLibPath);
		}
	}
}

export async function fixGitignoreFiles(projectDir: string): Promise<void> {
	const gitignorePaths = [
		path.join(projectDir, "_gitignore"),
		path.join(projectDir, "apps/client/_gitignore"),
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
