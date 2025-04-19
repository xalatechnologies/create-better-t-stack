import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import { globby } from "globby";
import pc from "picocolors";
import { PKG_ROOT } from "../constants";
import type { ProjectConfig } from "../types";
import { processTemplate } from "../utils/template-processor";

async function processAndCopyFiles(
	sourcePattern: string | string[],
	baseSourceDir: string,
	destDir: string,
	context: ProjectConfig,
	overwrite = true,
): Promise<void> {
	const sourceFiles = await globby(sourcePattern, {
		cwd: baseSourceDir,
		dot: true,
		onlyFiles: true,
		absolute: false,
	});

	for (const relativeSrcPath of sourceFiles) {
		const srcPath = path.join(baseSourceDir, relativeSrcPath);
		let relativeDestPath = relativeSrcPath;

		if (relativeSrcPath.endsWith(".hbs")) {
			relativeDestPath = relativeSrcPath.slice(0, -4);
		}

		const destPath = path.join(destDir, relativeDestPath);

		await fs.ensureDir(path.dirname(destPath));

		if (srcPath.endsWith(".hbs")) {
			await processTemplate(srcPath, destPath, context);
		} else {
			if (!overwrite && (await fs.pathExists(destPath))) {
				continue;
			}
			await fs.copy(srcPath, destPath, { overwrite: true });
		}
	}
}

export async function copyBaseTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	const templateDir = path.join(PKG_ROOT, "templates/base");
	await processAndCopyFiles(
		["package.json", "_gitignore"],
		templateDir,
		projectDir,
		context,
	);
}

export async function setupFrontendTemplates(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	const webFrontends = context.frontend.filter(
		(f) =>
			f === "tanstack-router" ||
			f === "react-router" ||
			f === "tanstack-start" ||
			f === "next",
	);
	const hasNative = context.frontend.includes("native");

	if (webFrontends.length > 0) {
		const webAppDir = path.join(projectDir, "apps/web");
		await fs.ensureDir(webAppDir);

		const webBaseDir = path.join(PKG_ROOT, "templates/frontend/web-base");
		if (await fs.pathExists(webBaseDir)) {
			await processAndCopyFiles("**/*", webBaseDir, webAppDir, context);
		}

		for (const framework of webFrontends) {
			const frameworkSrcDir = path.join(
				PKG_ROOT,
				`templates/frontend/${framework}`,
			);
			if (await fs.pathExists(frameworkSrcDir)) {
				await processAndCopyFiles("**/*", frameworkSrcDir, webAppDir, context);
			}
		}

		const webFramework = webFrontends[0];

		const apiWebBaseDir = path.join(
			PKG_ROOT,
			`templates/api/${context.api}/web/base`,
		);
		if (await fs.pathExists(apiWebBaseDir)) {
			await processAndCopyFiles("**/*", apiWebBaseDir, webAppDir, context);
		}

		const apiWebFrameworkDir = path.join(
			PKG_ROOT,
			`templates/api/${context.api}/web/${webFramework}`,
		);
		if (await fs.pathExists(apiWebFrameworkDir)) {
			await processAndCopyFiles("**/*", apiWebFrameworkDir, webAppDir, context);
		}
	}

	if (hasNative) {
		const nativeAppDir = path.join(projectDir, "apps/native");
		await fs.ensureDir(nativeAppDir);

		const nativeBaseDir = path.join(PKG_ROOT, "templates/frontend/native");
		if (await fs.pathExists(nativeBaseDir)) {
			await processAndCopyFiles("**/*", nativeBaseDir, nativeAppDir, context);
		}

		const apiNativeSrcDir = path.join(
			PKG_ROOT,
			`templates/api/${context.api}/native`,
		);

		if (await fs.pathExists(apiNativeSrcDir)) {
			await processAndCopyFiles("**/*", apiNativeSrcDir, nativeAppDir, context);
		} else {
		}
	}
}

export async function setupBackendFramework(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if ((context.backend as string) === "none") return;

	const serverAppDir = path.join(projectDir, "apps/server");
	await fs.ensureDir(serverAppDir);

	const serverBaseDir = path.join(PKG_ROOT, "templates/backend/server-base");
	if (await fs.pathExists(serverBaseDir)) {
		await processAndCopyFiles("**/*", serverBaseDir, serverAppDir, context);
	} else {
		consola.warn(
			pc.yellow(`Warning: server-base template not found at ${serverBaseDir}`),
		);
	}

	const frameworkSrcDir = path.join(
		PKG_ROOT,
		`templates/backend/${context.backend}`,
	);
	if (await fs.pathExists(frameworkSrcDir)) {
		await processAndCopyFiles("**/*", frameworkSrcDir, serverAppDir, context);
	} else {
		consola.warn(
			pc.yellow(
				`Warning: Backend template directory not found, skipping: ${frameworkSrcDir}`,
			),
		);
	}

	const apiServerBaseDir = path.join(
		PKG_ROOT,
		`templates/api/${context.api}/server/base`,
	);
	if (await fs.pathExists(apiServerBaseDir)) {
		await processAndCopyFiles("**/*", apiServerBaseDir, serverAppDir, context);
	}

	const apiServerFrameworkDir = path.join(
		PKG_ROOT,
		`templates/api/${context.api}/server/${context.backend}`,
	);
	if (await fs.pathExists(apiServerFrameworkDir)) {
		await processAndCopyFiles(
			"**/*",
			apiServerFrameworkDir,
			serverAppDir,
			context,
		);
	}
}

export async function setupDbOrmTemplates(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (context.orm === "none" || context.database === "none") return;

	const serverAppDir = path.join(projectDir, "apps/server");
	await fs.ensureDir(serverAppDir);

	const dbOrmSrcDir = path.join(
		PKG_ROOT,
		`templates/db/${context.orm}/${context.database}`,
	);

	if (await fs.pathExists(dbOrmSrcDir)) {
		await processAndCopyFiles("**/*", dbOrmSrcDir, serverAppDir, context);
	} else {
		consola.warn(
			pc.yellow(
				`Warning: Database/ORM template directory not found, skipping: ${dbOrmSrcDir}`,
			),
		);
	}
}

export async function setupAuthTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (!context.auth) return;

	const serverAppDir = path.join(projectDir, "apps/server");
	const webAppDir = path.join(projectDir, "apps/web");
	const nativeAppDir = path.join(projectDir, "apps/native");

	const serverAppDirExists = await fs.pathExists(serverAppDir);
	const webAppDirExists = await fs.pathExists(webAppDir);
	const nativeAppDirExists = await fs.pathExists(nativeAppDir);

	const webFrontends = context.frontend.filter(
		(f) =>
			f === "tanstack-router" ||
			f === "react-router" ||
			f === "tanstack-start" ||
			f === "next",
	);
	const hasNative = context.frontend.includes("native");

	if (serverAppDirExists) {
		const authServerBaseSrc = path.join(PKG_ROOT, "templates/auth/server/base");
		if (await fs.pathExists(authServerBaseSrc)) {
			await processAndCopyFiles(
				"**/*",
				authServerBaseSrc,
				serverAppDir,
				context,
			);
		} else {
			consola.warn(
				pc.yellow(
					`Warning: Base auth server template not found at ${authServerBaseSrc}`,
				),
			);
		}

		if (context.backend === "next") {
			const authServerNextSrc = path.join(
				PKG_ROOT,
				"templates/auth/server/next",
			);
			if (await fs.pathExists(authServerNextSrc)) {
				await processAndCopyFiles(
					"**/*",
					authServerNextSrc,
					serverAppDir,
					context,
				);
			} else {
				consola.warn(
					pc.yellow(
						`Warning: Next auth server template not found at ${authServerNextSrc}`,
					),
				);
			}
		}

		if (context.orm !== "none" && context.database !== "none") {
			const orm = context.orm;
			const db = context.database;
			let authDbSrc = "";
			if (orm === "drizzle") {
				authDbSrc = path.join(
					PKG_ROOT,
					`templates/auth/server/db/drizzle/${db}`,
				);
			} else if (orm === "prisma") {
				authDbSrc = path.join(
					PKG_ROOT,
					`templates/auth/server/db/prisma/${db}`,
				);
			}
			if (authDbSrc && (await fs.pathExists(authDbSrc))) {
				await processAndCopyFiles("**/*", authDbSrc, serverAppDir, context);
			} else {
				consola.warn(
					pc.yellow(
						`Warning: Auth template for ${orm}/${db} not found at ${authDbSrc}`,
					),
				);
			}
		}
	} else {
		consola.warn(
			pc.yellow(
				"Warning: apps/server directory does not exist, skipping server-side auth template setup.",
			),
		);
	}

	if (webFrontends.length > 0 && webAppDirExists) {
		const authWebBaseSrc = path.join(PKG_ROOT, "templates/auth/web/base");
		if (await fs.pathExists(authWebBaseSrc)) {
			await processAndCopyFiles("**/*", authWebBaseSrc, webAppDir, context);
		} else {
			consola.warn(
				pc.yellow(
					`Warning: Base auth web template not found at ${authWebBaseSrc}`,
				),
			);
		}

		for (const framework of webFrontends) {
			const authWebFrameworkSrc = path.join(
				PKG_ROOT,
				`templates/auth/web/${framework}`,
			);
			if (await fs.pathExists(authWebFrameworkSrc)) {
				await processAndCopyFiles(
					"**/*",
					authWebFrameworkSrc,
					webAppDir,
					context,
				);
			} else {
				consola.warn(
					pc.yellow(
						`Warning: Auth web template for ${framework} not found at ${authWebFrameworkSrc}`,
					),
				);
			}
		}
	}

	if (hasNative && nativeAppDirExists) {
		const authNativeSrc = path.join(PKG_ROOT, "templates/auth/native");
		if (await fs.pathExists(authNativeSrc)) {
			await processAndCopyFiles("**/*", authNativeSrc, nativeAppDir, context);
		} else {
			consola.warn(
				pc.yellow(
					`Warning: Auth native template not found at ${authNativeSrc}`,
				),
			);
		}
	}
}

export async function setupAddonsTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (context.addons.includes("turborepo")) {
		const turboSrcDir = path.join(PKG_ROOT, "templates/addons/turborepo");
		if (await fs.pathExists(turboSrcDir)) {
			await processAndCopyFiles("**/*", turboSrcDir, projectDir, context);
		} else {
			consola.warn(pc.yellow("Warning: Turborepo addon template not found."));
		}
	}

	if (context.addons.includes("husky")) {
		const huskySrcDir = path.join(PKG_ROOT, "templates/addons/husky");
		if (await fs.pathExists(huskySrcDir)) {
			await processAndCopyFiles("**/*", huskySrcDir, projectDir, context);
		} else {
			consola.warn(pc.yellow("Warning: Husky addon template not found."));
		}
	}

	if (context.addons.includes("biome")) {
		const biomeSrcDir = path.join(PKG_ROOT, "templates/addons/biome");
		if (await fs.pathExists(biomeSrcDir)) {
			await processAndCopyFiles("**/*", biomeSrcDir, projectDir, context);
		} else {
			consola.warn(pc.yellow("Warning: Biome addon template not found."));
		}
	}

	if (context.addons.includes("pwa")) {
		const pwaSrcDir = path.join(PKG_ROOT, "templates/addons/pwa/apps/web");
		const webAppDir = path.join(projectDir, "apps/web");
		const webAppDirExists = await fs.pathExists(webAppDir);

		if (await fs.pathExists(pwaSrcDir)) {
			if (webAppDirExists) {
				await processAndCopyFiles("**/*", pwaSrcDir, webAppDir, context);
			} else {
				consola.warn(
					pc.yellow(
						"Warning: apps/web directory not found, cannot setup PWA addon template.",
					),
				);
			}
		} else {
			consola.warn(pc.yellow("Warning: PWA addon template not found."));
		}
	}
}

export async function setupExamplesTemplate(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (!context.examples || context.examples.length === 0) return;

	const serverAppDir = path.join(projectDir, "apps/server");
	const webAppDir = path.join(projectDir, "apps/web");

	const serverAppDirExists = await fs.pathExists(serverAppDir);
	const webAppDirExists = await fs.pathExists(webAppDir);

	for (const example of context.examples) {
		const exampleBaseDir = path.join(PKG_ROOT, `templates/examples/${example}`);

		if (serverAppDirExists) {
			const exampleServerSrc = path.join(exampleBaseDir, "server");
			if (await fs.pathExists(exampleServerSrc)) {
				if (context.orm !== "none") {
					const exampleOrmBaseSrc = path.join(
						exampleServerSrc,
						context.orm,
						"base",
					);
					if (await fs.pathExists(exampleOrmBaseSrc)) {
						await processAndCopyFiles(
							"**/*",
							exampleOrmBaseSrc,
							serverAppDir,
							context,
							false,
						);
					}

					if (context.database !== "none") {
						const exampleDbSchemaSrc = path.join(
							exampleServerSrc,
							context.orm,
							context.database,
						);
						if (await fs.pathExists(exampleDbSchemaSrc)) {
							await processAndCopyFiles(
								"**/*",
								exampleDbSchemaSrc,
								serverAppDir,
								context,
								false,
							);
						}
					}
				}
			}
		}

		if (webAppDirExists) {
			const exampleWebSrc = path.join(exampleBaseDir, "web");
			if (await fs.pathExists(exampleWebSrc)) {
				const webFrameworks = context.frontend.filter((f) =>
					[
						"next",
						"react-router",
						"tanstack-router",
						"tanstack-start",
					].includes(f),
				);
				for (const framework of webFrameworks) {
					const exampleWebFrameworkSrc = path.join(exampleWebSrc, framework);
					if (await fs.pathExists(exampleWebFrameworkSrc)) {
						await processAndCopyFiles(
							"**/*",
							exampleWebFrameworkSrc,
							webAppDir,
							context,
							false,
						);
					}
				}
			}
		}
	}
}

export async function fixGitignoreFiles(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	const gitignoreFiles = await globby(["**/.gitignore.hbs", "**/_gitignore"], {
		cwd: projectDir,
		dot: true,
		onlyFiles: true,
		absolute: true,
		ignore: ["**/node_modules/**", "**/.git/**"],
	});

	for (const currentPath of gitignoreFiles) {
		const dir = path.dirname(currentPath);
		const filename = path.basename(currentPath);
		const destPath = path.join(dir, ".gitignore");

		try {
			if (filename === ".gitignore.hbs") {
				await processTemplate(currentPath, destPath, context);
				await fs.remove(currentPath);
			} else if (filename === "_gitignore") {
				await fs.move(currentPath, destPath, { overwrite: true });
			}
		} catch (error) {
			consola.error(`Error processing gitignore file ${currentPath}:`, error);
		}
	}
}

export async function handleExtras(
	projectDir: string,
	context: ProjectConfig,
): Promise<void> {
	if (context.packageManager === "pnpm") {
		const src = path.join(PKG_ROOT, "templates/extras/pnpm-workspace.yaml");
		const dest = path.join(projectDir, "pnpm-workspace.yaml");
		if (await fs.pathExists(src)) {
			await fs.copy(src, dest);
		} else {
			consola.warn(
				pc.yellow("Warning: pnpm-workspace.yaml template not found."),
			);
		}
	}
}
