import path from "node:path";
import { cancel, spinner } from "@clack/prompts";
import { $ } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { PKG_ROOT } from "../constants";
import type { ProjectConfig, ProjectDatabase, ProjectOrm } from "../types";
import { setupAddons } from "./addons-setup";
import { setupAuth } from "./auth-setup";
import { createReadme } from "./create-readme";
import { setupDatabase } from "./db-setup";
import { setupEnvironmentVariables } from "./env-setup";
import { displayPostInstallInstructions } from "./post-installation";

export async function createProject(options: ProjectConfig): Promise<string> {
	const s = spinner();
	const projectDir = path.resolve(process.cwd(), options.projectName);

	try {
		await fs.ensureDir(projectDir);
		const templateDir = path.join(PKG_ROOT, "template/base");
		if (!(await fs.pathExists(templateDir))) {
			throw new Error(`Template directory not found: ${templateDir}`);
		}
		await fs.copy(templateDir, projectDir);

		const gitignorePaths = [
			path.join(projectDir, "_gitignore"),
			path.join(projectDir, "packages/client/_gitignore"),
			path.join(projectDir, "packages/server/_gitignore"),
		];

		for (const gitignorePath of gitignorePaths) {
			if (await fs.pathExists(gitignorePath)) {
				const targetPath = path.join(path.dirname(gitignorePath), ".gitignore");
				await fs.move(gitignorePath, targetPath);
			}
		}

		if (options.auth) {
			const authTemplateDir = path.join(PKG_ROOT, "template/with-auth");
			if (await fs.pathExists(authTemplateDir)) {
				await fs.copy(authTemplateDir, projectDir, { overwrite: true });
			}
		}

		if (options.orm !== "none" && options.database !== "none") {
			const ormTemplateDir = path.join(
				PKG_ROOT,
				getOrmTemplateDir(options.orm, options.database),
			);

			if (await fs.pathExists(ormTemplateDir)) {
				await fs.copy(ormTemplateDir, projectDir, { overwrite: true });
				const serverSrcPath = path.join(projectDir, "packages/server/src");
				const baseLibPath = path.join(serverSrcPath, "lib");
				const withAuthLibPath = path.join(serverSrcPath, "with-auth-lib");

				if (options.auth) {
					await fs.remove(baseLibPath);
					await fs.move(withAuthLibPath, baseLibPath);

					if (options.orm === "prisma") {
						const schemaPath = path.join(
							projectDir,
							"packages/server/prisma/schema.prisma",
						);
						const withAuthSchemaPath = path.join(
							projectDir,
							"packages/server/prisma/with-auth-schema.prisma",
						);

						if (await fs.pathExists(withAuthSchemaPath)) {
							await fs.remove(schemaPath);
							await fs.move(withAuthSchemaPath, schemaPath);
						}
					} else if (options.orm === "drizzle") {
						const schemaPath = path.join(
							projectDir,
							"packages/server/src/db/schema.ts",
						);
						const withAuthSchemaPath = path.join(
							projectDir,
							"packages/server/src/db/with-auth-schema.ts",
						);

						if (await fs.pathExists(withAuthSchemaPath)) {
							await fs.remove(schemaPath);
							await fs.move(withAuthSchemaPath, schemaPath);
						}
					}
				} else {
					await fs.remove(withAuthLibPath);
					if (options.orm === "prisma") {
						const withAuthSchema = path.join(
							projectDir,
							"packages/server/prisma/with-auth-schema.prisma",
						);
						if (await fs.pathExists(withAuthSchema)) {
							await fs.remove(withAuthSchema);
						}
					} else if (options.orm === "drizzle") {
						const withAuthSchema = path.join(
							projectDir,
							"packages/server/src/db/with-auth-schema.ts",
						);
						if (await fs.pathExists(withAuthSchema)) {
							await fs.remove(withAuthSchema);
						}
					}
				}
			}
		}

		await setupDatabase(
			projectDir,
			options.database,
			options.orm,
			options.turso ?? options.database === "sqlite",
		);
		await setupAuth(projectDir, options.auth);
		await setupEnvironmentVariables(projectDir, options);

		if (options.git) {
			await $({ cwd: projectDir })`git init`;
		}

		if (options.addons.length > 0) {
			await setupAddons(projectDir, options.addons, options.packageManager);
		}

		await updatePackageConfigurations(projectDir, options);
		await createReadme(projectDir, options);

		displayPostInstallInstructions(
			options.database,
			options.projectName,
			options.packageManager,
			!options.noInstall,
			options.orm,
			options.addons,
		);

		return projectDir;
	} catch (error) {
		s.message(pc.red("Failed"));
		if (error instanceof Error) {
			cancel(pc.red(`Error during project creation: ${error.message}`));
			process.exit(1);
		}
		throw error;
	}
}

async function updatePackageConfigurations(
	projectDir: string,
	options: ProjectConfig,
) {
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
						: options.packageManager === "yarn"
							? "yarn@4.1.0"
							: "bun@1.2.5";
		}

		await fs.writeJson(rootPackageJsonPath, packageJson, { spaces: 2 });
	}

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
				serverPackageJson.scripts["db:push"] = "prisma db push";
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
