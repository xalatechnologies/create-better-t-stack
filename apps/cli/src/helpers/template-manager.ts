import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type {
	ProjectBackend,
	ProjectDatabase,
	ProjectFrontend,
	ProjectOrm,
} from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

/**
 * Copy base template structure but exclude app-specific folders that will be added based on options
 */
export async function copyBaseTemplate(projectDir: string): Promise<void> {
	const templateDir = path.join(PKG_ROOT, "template/base");

	if (!(await fs.pathExists(templateDir))) {
		throw new Error(`Template directory not found: ${templateDir}`);
	}

	await fs.ensureDir(projectDir);

	const rootFiles = await fs.readdir(templateDir);
	for (const file of rootFiles) {
		const srcPath = path.join(templateDir, file);
		const destPath = path.join(projectDir, file);

		if (file === "apps") continue;

		if (await fs.stat(srcPath).then((stat) => stat.isDirectory())) {
			await fs.copy(srcPath, destPath);
		} else {
			await fs.copy(srcPath, destPath);
		}
	}

	await fs.ensureDir(path.join(projectDir, "apps"));

	const serverSrcDir = path.join(templateDir, "apps/server");
	const serverDestDir = path.join(projectDir, "apps/server");
	if (await fs.pathExists(serverSrcDir)) {
		await fs.copy(serverSrcDir, serverDestDir);
	}
}

export async function setupFrontendTemplates(
	projectDir: string,
	frontends: ProjectFrontend[],
): Promise<void> {
	const hasTanstackWeb = frontends.includes("tanstack-router");
	const hasTanstackStart = frontends.includes("tanstack-start");
	const hasReactRouterWeb = frontends.includes("react-router");
	const hasNative = frontends.includes("native");

	if (hasTanstackWeb || hasReactRouterWeb || hasTanstackStart) {
		const webDir = path.join(projectDir, "apps/web");
		await fs.ensureDir(webDir);

		const webBaseDir = path.join(PKG_ROOT, "template/base/apps/web-base");
		if (await fs.pathExists(webBaseDir)) {
			await fs.copy(webBaseDir, webDir);
		}

		let frameworkName = "web-react-router";
		if (hasTanstackWeb) {
			frameworkName = "web-tanstack-router";
		} else if (hasTanstackStart) {
			frameworkName = "web-tanstack-start";
		}

		const webFrameworkDir = path.join(
			PKG_ROOT,
			`template/base/apps/${frameworkName}`,
		);

		if (await fs.pathExists(webFrameworkDir)) {
			await fs.copy(webFrameworkDir, webDir, { overwrite: true });
		}

		const packageJsonPath = path.join(webDir, "package.json");
		if (await fs.pathExists(packageJsonPath)) {
			const packageJson = await fs.readJson(packageJsonPath);
			packageJson.name = "web";
			await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
		}
	}

	if (hasNative) {
		const nativeSrcDir = path.join(PKG_ROOT, "template/base/apps/native");
		const nativeDestDir = path.join(projectDir, "apps/native");

		if (await fs.pathExists(nativeSrcDir)) {
			await fs.copy(nativeSrcDir, nativeDestDir);
		}

		await fs.writeFile(
			path.join(projectDir, ".npmrc"),
			"node-linker=hoisted\n",
		);
	}
}

export async function setupBackendFramework(
	projectDir: string,
	framework: ProjectBackend,
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
	framework: ProjectBackend,
	orm: ProjectOrm,
	database: ProjectDatabase,
	frontends: ProjectFrontend[],
): Promise<void> {
	if (!auth) return;

	const authTemplateDir = path.join(PKG_ROOT, "template/with-auth");
	if (await fs.pathExists(authTemplateDir)) {
		const hasReactRouter = frontends.includes("react-router");
		const hasTanStackRouter = frontends.includes("tanstack-router");
		const hasTanStackStart = frontends.includes("tanstack-start");

		if (hasReactRouter || hasTanStackRouter || hasTanStackStart) {
			const webDir = path.join(projectDir, "apps/web");

			const webBaseAuthDir = path.join(authTemplateDir, "apps/web-base");
			if (await fs.pathExists(webBaseAuthDir)) {
				await fs.copy(webBaseAuthDir, webDir, { overwrite: true });
			}

			if (hasReactRouter) {
				const reactRouterAuthDir = path.join(
					authTemplateDir,
					"apps/web-react-router",
				);
				if (await fs.pathExists(reactRouterAuthDir)) {
					await fs.copy(reactRouterAuthDir, webDir, { overwrite: true });
				}
			}

			if (hasTanStackRouter) {
				const tanstackAuthDir = path.join(
					authTemplateDir,
					"apps/web-tanstack-router",
				);
				if (await fs.pathExists(tanstackAuthDir)) {
					await fs.copy(tanstackAuthDir, webDir, { overwrite: true });
				}
			}

			if (hasTanStackStart) {
				const tanstackStartAuthDir = path.join(
					authTemplateDir,
					"apps/web-tanstack-start",
				);
				if (await fs.pathExists(tanstackStartAuthDir)) {
					await fs.copy(tanstackStartAuthDir, webDir, { overwrite: true });
				}
			}
		}

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

		if (frontends.includes("native")) {
			const nativeAuthDir = path.join(authTemplateDir, "apps/native");
			const projectNativeDir = path.join(projectDir, "apps/native");

			if (await fs.pathExists(nativeAuthDir)) {
				await fs.copy(nativeAuthDir, projectNativeDir, { overwrite: true });
			}

			addPackageDependency({
				dependencies: ["@better-auth/expo"],
				projectDir: path.join(projectDir, "apps/server"),
			});

			await updateAuthConfigWithExpoPlugin(projectDir, orm, database);
		}
	}
}

// Need to find a better way to handle this
async function updateAuthConfigWithExpoPlugin(
	projectDir: string,
	orm: ProjectOrm,
	database: ProjectDatabase,
): Promise<void> {
	const serverDir = path.join(projectDir, "apps/server");

	let authFilePath: string | undefined;
	if (orm === "drizzle") {
		if (database === "sqlite") {
			authFilePath = path.join(serverDir, "src/lib/auth.ts");
		} else if (database === "postgres") {
			authFilePath = path.join(serverDir, "src/lib/auth.ts");
		}
	} else if (orm === "prisma") {
		if (database === "sqlite") {
			authFilePath = path.join(serverDir, "src/lib/auth.ts");
		} else if (database === "postgres") {
			authFilePath = path.join(serverDir, "src/lib/auth.ts");
		}
	}

	if (authFilePath && (await fs.pathExists(authFilePath))) {
		let authFileContent = await fs.readFile(authFilePath, "utf8");

		if (!authFileContent.includes("@better-auth/expo")) {
			const importLine = 'import { expo } from "@better-auth/expo";\n';

			const lastImportIndex = authFileContent.lastIndexOf("import");
			const afterLastImport =
				authFileContent.indexOf("\n", lastImportIndex) + 1;

			authFileContent =
				authFileContent.substring(0, afterLastImport) +
				importLine +
				authFileContent.substring(afterLastImport);
		}

		if (!authFileContent.includes("plugins:")) {
			authFileContent = authFileContent.replace(
				/}\);/,
				"  plugins: [expo()],\n});",
			);
		} else if (!authFileContent.includes("expo()")) {
			authFileContent = authFileContent.replace(
				/plugins: \[(.*?)\]/s,
				(match, plugins) => {
					return `plugins: [${plugins}${plugins.trim() ? ", " : ""}expo()]`;
				},
			);
		}

		if (!authFileContent.includes("my-better-t-app://")) {
			authFileContent = authFileContent.replace(
				/trustedOrigins: \[(.*?)\]/s,
				(match, origins) => {
					return `trustedOrigins: [${origins}${origins.trim() ? ", " : ""}"my-better-t-app://"]`;
				},
			);
		}

		await fs.writeFile(authFilePath, authFileContent);
	}
}

export async function fixGitignoreFiles(projectDir: string): Promise<void> {
	const gitignorePaths = await findGitignoreFiles(projectDir);

	for (const gitignorePath of gitignorePaths) {
		if (await fs.pathExists(gitignorePath)) {
			const targetPath = path.join(path.dirname(gitignorePath), ".gitignore");
			await fs.move(gitignorePath, targetPath, { overwrite: true });
		}
	}
}

/**
 * Find all _gitignore files in the project recursively
 */
async function findGitignoreFiles(dir: string): Promise<string[]> {
	const gitignoreFiles: string[] = [];

	const gitignorePath = path.join(dir, "_gitignore");
	if (await fs.pathExists(gitignorePath)) {
		gitignoreFiles.push(gitignorePath);
	}

	try {
		const entries = await fs.readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			if (entry.isDirectory() && entry.name !== "node_modules") {
				const subDirPath = path.join(dir, entry.name);
				const subDirFiles = await findGitignoreFiles(subDirPath);
				gitignoreFiles.push(...subDirFiles);
			}
		}
	} catch (error) {}

	return gitignoreFiles;
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
