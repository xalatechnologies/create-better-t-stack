import path from "node:path";
import { cancel, spinner } from "@clack/prompts";
import { $ } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { PKG_ROOT } from "../constants";
import type { ProjectConfig } from "../types";
import { setupAddons } from "./addons-setup";
import { configureAuth } from "./auth-setup";
import { createReadme } from "./create-readme";
import { setupDatabase } from "./db-setup";
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

		if (options.orm !== "none" && options.database !== "none") {
			const ormTemplateDir = path.join(
				PKG_ROOT,
				getOrmTemplateDir(options.orm, options.database),
			);

			if (await fs.pathExists(ormTemplateDir)) {
				await fs.copy(ormTemplateDir, projectDir, { overwrite: true });
			}
		}

		const envFiles = [
			[
				path.join(projectDir, "packages/server/_env"),
				path.join(projectDir, "packages/server/.env"),
			],
		];

		for (const [source, target] of envFiles) {
			if (await fs.pathExists(source)) {
				if (!(await fs.pathExists(target))) {
					await fs.move(source, target);
				} else {
					await fs.remove(source);
				}
			}
		}

		await setupDatabase(
			projectDir,
			options.database,
			options.orm,
			options.turso ?? options.database === "sqlite",
		);
		await configureAuth(
			projectDir,
			options.auth,
			options.database !== "none",
			options,
		);

		if (options.git) {
			await $({ cwd: projectDir })`git init`;
		}

		if (options.addons.length > 0) {
			await setupAddons(projectDir, options.addons);
		}

		const packageJsonPath = path.join(projectDir, "package.json");
		if (await fs.pathExists(packageJsonPath)) {
			const packageJson = await fs.readJson(packageJsonPath);
			packageJson.name = options.projectName;

			if (options.packageManager !== "bun") {
				packageJson.packageManager =
					options.packageManager === "npm"
						? "npm@10.2.4"
						: options.packageManager === "pnpm"
							? "pnpm@8.15.4"
							: options.packageManager === "yarn"
								? "yarn@4.1.0"
								: "bun@1.2.4";
			}

			if (options.database !== "none") {
				if (options.database === "sqlite") {
					packageJson.scripts["db:local"] =
						"cd packages/server && turso dev --db-file local.db";
				}

				if (options.auth) {
					packageJson.scripts["auth:generate"] =
						"cd packages/server && npx @better-auth/cli generate --output ./src/db/auth-schema.ts";

					if (options.orm === "prisma") {
						packageJson.scripts["prisma:generate"] =
							"cd packages/server && npx prisma generate";
						packageJson.scripts["prisma:push"] =
							"cd packages/server && npx prisma db push";
						packageJson.scripts["prisma:studio"] =
							"cd packages/server && npx prisma studio";
						packageJson.scripts["db:setup"] =
							"npm run auth:generate && npm run prisma:generate && npm run prisma:push";
					} else if (options.orm === "drizzle") {
						packageJson.scripts["drizzle:migrate"] =
							"cd packages/server && npx @better-auth/cli migrate";
						packageJson.scripts["db:setup"] =
							"npm run auth:generate && npm run drizzle:migrate";
					}
				}
			}

			await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
		}

		await createReadme(projectDir, options);

		displayPostInstallInstructions(
			options.auth,
			options.database,
			options.projectName,
			options.packageManager,
			!options.noInstall,
			options.orm,
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

function getOrmTemplateDir(orm: string, database: string): string {
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
