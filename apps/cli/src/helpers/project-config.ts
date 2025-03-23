import path from "node:path";
import { $ } from "execa";
import fs from "fs-extra";
import type { ProjectConfig, ProjectDatabase, ProjectOrm } from "../types";

export async function updatePackageConfigurations(
	projectDir: string,
	options: ProjectConfig,
): Promise<void> {
	await updateRootPackageJson(projectDir, options);
	await updateServerPackageJson(projectDir, options);
}

async function updateRootPackageJson(
	projectDir: string,
	options: ProjectConfig,
): Promise<void> {
	const rootPackageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(rootPackageJsonPath)) {
		const packageJson = await fs.readJson(rootPackageJsonPath);
		packageJson.name = options.projectName;

		if (options.packageManager !== "bun") {
			packageJson.packageManager =
				options.packageManager === "npm"
					? "npm@10.9.2"
					: options.packageManager === "pnpm"
						? "pnpm@10.6.4"
						: "bun@1.2.5";
		}

		await fs.writeJson(rootPackageJsonPath, packageJson, { spaces: 2 });
	}
}

async function updateServerPackageJson(
	projectDir: string,
	options: ProjectConfig,
): Promise<void> {
	const serverPackageJsonPath = path.join(
		projectDir,
		"packages/server/package.json",
	);

	if (await fs.pathExists(serverPackageJsonPath)) {
		const serverPackageJson = await fs.readJson(serverPackageJsonPath);

		if (options.database !== "none") {
			if (options.database === "sqlite") {
				serverPackageJson.scripts["db:local"] = "turso dev --db-file local.db";
			}

			if (options.orm === "prisma") {
				serverPackageJson.scripts["db:push"] =
					"prisma db push --schema ./prisma/schema";
				serverPackageJson.scripts["db:studio"] = "prisma studio";
			} else if (options.orm === "drizzle") {
				serverPackageJson.scripts["db:push"] = "drizzle-kit push";
				serverPackageJson.scripts["db:studio"] = "drizzle-kit studio";
			}
		}

		await fs.writeJson(serverPackageJsonPath, serverPackageJson, {
			spaces: 2,
		});
	}
}

export async function initializeGit(
	projectDir: string,
	useGit: boolean,
): Promise<void> {
	if (useGit) {
		await $({ cwd: projectDir })`git init`;
	}
}
