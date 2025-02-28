import crypto from "node:crypto";
import path from "node:path";
import { log, spinner } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../types";

export async function configureAuth(
	projectDir: string,
	initialEnableAuth: boolean,
	hasDatabase: boolean,
	options?: ProjectConfig,
) {
	let enableAuth = initialEnableAuth;

	if (!hasDatabase && enableAuth) {
		log.warn(
			pc.yellow(
				"Authentication requires a database. Disabling authentication.",
			),
		);
		enableAuth = false;
	}

	if (enableAuth) {
		const secret = crypto.randomBytes(32).toString("hex");

		const serverEnvPath = path.join(projectDir, "packages/server/.env");
		await fs.ensureFile(serverEnvPath);
		let envContent = await fs.readFile(serverEnvPath, "utf-8").catch(() => "");

		if (!envContent.includes("BETTER_AUTH_SECRET")) {
			envContent += `\n# Better Auth Configuration\nBETTER_AUTH_SECRET="${secret}"\nBETTER_AUTH_URL="${process.env.BETTER_AUTH_URL || "http://localhost:3000"}"\nCORS_ORIGIN="${process.env.CORS_ORIGIN || "http://localhost:3001"}"\n`;
			await fs.writeFile(serverEnvPath, envContent);
		}

		const orm = options?.orm || "drizzle";
		const database = options?.database || "sqlite";
		const databaseProvider = database === "sqlite" ? "sqlite" : "postgresql";

		await updatePackageJson(projectDir, true, orm);

		const configPath = path.join(
			projectDir,
			"packages/server/better-auth.config.js",
		);
		const adapterConfig =
			orm === "prisma"
				? `{
				name: "prisma",
				options: {
						provider: "${databaseProvider}",
						schemaPath: "./prisma/schema.prisma",
				}
		}`
				: `{
				name: "drizzle",
				options: {
						provider: "${databaseProvider}",
						schemaPath: "./src/db/schema.ts",
				}
		}`;

		const configContent = `/** @type {import('better-auth').BetterAuthConfig} */
module.exports = {
		adapter: ${adapterConfig}
};`;

		await fs.writeFile(configPath, configContent);

		await createAuthFile(projectDir, orm, databaseProvider);
		await createAuthClientFile(projectDir);

		if (orm === "prisma") {
			await setupBasicPrisma(projectDir, databaseProvider);
		} else {
			await fs.ensureDir(path.join(projectDir, "packages/server/src/db"));
		}

		await updateServerIndex(projectDir, true);

		await updateContext(projectDir, true, orm);
	} else {
		await updatePackageJson(projectDir, false);
		await updateAuthImplementations(projectDir, false);
		await updateServerIndex(projectDir, false);
		await updateContext(projectDir, false);
	}
}

async function updateServerIndex(projectDir: string, enableAuth: boolean) {
	const serverIndexPath = path.join(projectDir, "packages/server/src/index.ts");

	if (!(await fs.pathExists(serverIndexPath))) return;

	let content = await fs.readFile(serverIndexPath, "utf-8");

	if (enableAuth) {
		if (!content.includes('import { auth } from "./lib/auth"')) {
			const importLines = content
				.split("\n")
				.findIndex(
					(line) => line.startsWith("import") || line.startsWith("// import"),
				);

			const lines = content.split("\n");
			lines.splice(importLines + 1, 0, 'import { auth } from "./lib/auth";');
			content = lines.join("\n");
		}

		if (!content.includes('app.on(["POST", "GET"], "/api/auth/**"')) {
			const appCreation = content.indexOf("app.use");
			if (appCreation !== -1) {
				const insertPoint = content.indexOf("\n", appCreation) + 1;
				const authRouteHandler =
					'\n// Auth routes\napp.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));\n';
				content =
					content.slice(0, insertPoint) +
					authRouteHandler +
					content.slice(insertPoint);
			}
		}
	} else {
		content = content.replace(/import { auth } from "\.\/lib\/auth";?\n?/g, "");
		content = content.replace(/\/\/ Auth routes\n?/g, "");
		content = content.replace(
			/app\.on\(\["POST", "GET"\], "\/api\/auth\/\*\*", \(c\) => auth\.handler\(c\.req\.raw\)\);?\n?/g,
			"",
		);
	}

	await fs.writeFile(serverIndexPath, content);
}

async function updateContext(
	projectDir: string,
	enableAuth: boolean,
	_orm?: string,
) {
	const contextPath = path.join(
		projectDir,
		"packages/server/src/lib/context.ts",
	);

	if (!(await fs.pathExists(contextPath))) return;

	let content = await fs.readFile(contextPath, "utf-8");

	if (enableAuth) {
		if (!content.includes('import { auth } from "./auth"')) {
			const importLines = content
				.split("\n")
				.findIndex(
					(line) => line.startsWith("import") || line.startsWith("// import"),
				);

			const lines = content.split("\n");
			lines.splice(importLines + 1, 0, 'import { auth } from "./auth";');
			content = lines.join("\n");
		}

		if (!content.includes("const session =")) {
			const createContextBody = content.indexOf(
				"export async function createContext",
			);
			if (createContextBody !== -1) {
				const bodyStart = content.indexOf("{", createContextBody);
				const nextLine = content.indexOf("\n", bodyStart) + 1;

				const sessionExtraction =
					"  // Get the session from the request\n" +
					"  const session = await auth.api.getSession({\n" +
					"    headers: hono.req.raw.headers,\n" +
					"  });\n\n";

				content =
					content.slice(0, nextLine) +
					sessionExtraction +
					content.slice(nextLine);
			}

			const returnIndex = content.lastIndexOf("return {");
			if (returnIndex !== -1) {
				const returnEnd = content.indexOf("}", returnIndex);
				const returnContent = content.substring(returnIndex, returnEnd);

				if (!returnContent.includes("session")) {
					const updatedReturn = returnContent.replace(
						"return {",
						"return {\n    session,",
					);
					content =
						content.slice(0, returnIndex) +
						updatedReturn +
						content.slice(returnEnd);
				}
			}
		}
	} else {
		content = content.replace(/import { auth } from "\.\/auth";?\n?/g, "");
		content = content.replace(/\/\/ Get the session from the request\n?/g, "");
		content = content.replace(
			/const session = await auth\.api\.getSession\(\{\n?.*headers: hono\.req\.raw\.headers,\n?.*\}\);?\n?/g,
			"const session = null;\n",
		);

		if (!content.includes("const session = null")) {
			const createContextBody = content.indexOf(
				"export async function createContext",
			);
			if (createContextBody !== -1) {
				const bodyStart = content.indexOf("{", createContextBody);
				const nextLine = content.indexOf("\n", bodyStart) + 1;
				content = `${content.slice(0, nextLine)}  const session = null;\n\n${content.slice(nextLine)}`;
			}
		}
	}

	await fs.writeFile(contextPath, content);
}

async function updatePackageJson(
	projectDir: string,
	enableAuth: boolean,
	orm?: string,
) {
	const clientPackageJsonPath = path.join(
		projectDir,
		"packages/client/package.json",
	);
	const serverPackageJsonPath = path.join(
		projectDir,
		"packages/server/package.json",
	);

	if (enableAuth) {
		if (await fs.pathExists(clientPackageJsonPath)) {
			const clientPackageJson = await fs.readJson(clientPackageJsonPath);
			clientPackageJson.dependencies = clientPackageJson.dependencies || {};
			clientPackageJson.dependencies["better-auth"] = "latest";
			await fs.writeJson(clientPackageJsonPath, clientPackageJson, {
				spaces: 2,
			});
		}

		if (await fs.pathExists(serverPackageJsonPath)) {
			const serverPackageJson = await fs.readJson(serverPackageJsonPath);
			serverPackageJson.dependencies = serverPackageJson.dependencies || {};
			serverPackageJson.dependencies["better-auth"] = "latest";

			if (orm === "prisma") {
				serverPackageJson.dependencies["@prisma/client"] = "latest";
				serverPackageJson.devDependencies =
					serverPackageJson.devDependencies || {};
				serverPackageJson.devDependencies.prisma = "latest";
			} else if (orm === "drizzle") {
				serverPackageJson.dependencies["drizzle-orm"] = "latest";
				serverPackageJson.devDependencies =
					serverPackageJson.devDependencies || {};
				serverPackageJson.devDependencies["drizzle-kit"] = "latest";
			}

			await fs.writeJson(serverPackageJsonPath, serverPackageJson, {
				spaces: 2,
			});
		}
	} else {
		// Remove auth dependencies if disabling auth
		if (await fs.pathExists(clientPackageJsonPath)) {
			const clientPackageJson = await fs.readJson(clientPackageJsonPath);
			if (clientPackageJson.dependencies?.["better-auth"]) {
				clientPackageJson.dependencies = Object.fromEntries(
					Object.entries(clientPackageJson.dependencies).filter(
						([key]) => key !== "better-auth",
					),
				);
			}
			await fs.writeJson(clientPackageJsonPath, clientPackageJson, {
				spaces: 2,
			});
		}

		if (await fs.pathExists(serverPackageJsonPath)) {
			const serverPackageJson = await fs.readJson(serverPackageJsonPath);
			if (serverPackageJson.dependencies?.["better-auth"]) {
				serverPackageJson.dependencies = Object.fromEntries(
					Object.entries(serverPackageJson.dependencies).filter(
						([key]) => key !== "better-auth",
					),
				);
			}
			if (serverPackageJson.devDependencies?.["@better-auth/cli"]) {
				serverPackageJson.devDependencies = Object.fromEntries(
					Object.entries(serverPackageJson.devDependencies).filter(
						([key]) => key !== "@better-auth/cli",
					),
				);
			}
			await fs.writeJson(serverPackageJsonPath, serverPackageJson, {
				spaces: 2,
			});
		}
	}
}

async function setupBasicPrisma(projectDir: string, databaseProvider: string) {
	const prismaDir = path.join(projectDir, "packages/server/prisma");
	await fs.ensureDir(prismaDir);

	const schemaPath = path.join(prismaDir, "schema.prisma");
	const schemaContent = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
		provider = "prisma-client-js"
}

datasource db {
		provider = "${databaseProvider}"
		url      = env("DATABASE_URL")
}

// Models will be added by running:
// npx @better-auth/cli generate
`;

	await fs.writeFile(schemaPath, schemaContent);

	const clientDir = path.join(projectDir, "packages/server/src/db");
	await fs.ensureDir(clientDir);

	const clientPath = path.join(clientDir, "client.ts");
	const clientContent = `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`;

	await fs.writeFile(clientPath, clientContent);

	const indexPath = path.join(clientDir, "index.ts");
	const indexContent = `export * from './client';
`;
	await fs.writeFile(indexPath, indexContent);

	const envPath = path.join(projectDir, "packages/server/.env");
	let envContent = await fs.readFile(envPath, "utf-8").catch(() => "");

	if (!envContent.includes("DATABASE_URL")) {
		const defaultUrl =
			databaseProvider === "sqlite"
				? "file:./prisma/dev.db"
				: "postgresql://postgres:password@localhost:5432/better-t-stack";

		envContent += `\n# Database\nDATABASE_URL="${defaultUrl}"\n`;
		await fs.writeFile(envPath, envContent);
	}
}

async function createAuthFile(
	projectDir: string,
	orm: string,
	databaseProvider: string,
) {
	const authDir = path.join(projectDir, "packages/server/src/lib");
	await fs.ensureDir(authDir);

	const authFilePath = path.join(authDir, "auth.ts");

	let authContent = "";

	if (orm === "prisma") {
		authContent = `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/client";

export const auth = betterAuth({
		database: prismaAdapter(prisma, {
				provider: "${databaseProvider}",
		}),
		trustedOrigins: [process.env.CORS_ORIGIN!],
		emailAndPassword: {
				enabled: true,
		},
		session: {
				secret: process.env.BETTER_AUTH_SECRET!,
		},
});`;
	} else {
		authContent = `import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
		database: drizzleAdapter(db, {
				provider: "${databaseProvider}",
				schema: schema,
		}),
		trustedOrigins: [process.env.CORS_ORIGIN!],
		emailAndPassword: {
				enabled: true,
		},
		session: {
				secret: process.env.BETTER_AUTH_SECRET!,
		},
});`;
	}

	await fs.writeFile(authFilePath, authContent);
}

async function createAuthClientFile(projectDir: string) {
	const libDir = path.join(projectDir, "packages/client/src/lib");
	await fs.ensureDir(libDir);

	const authClientPath = path.join(libDir, "auth-client.ts");
	const authClientContent = `import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
		baseURL: import.meta.env.VITE_SERVER_URL,
});

// Export specific methods if needed
export const { signIn, signUp, useSession } = authClient;
`;

	await fs.writeFile(authClientPath, authClientContent);
}

async function updateAuthImplementations(
	projectDir: string,
	enableAuth: boolean,
) {
	if (enableAuth) {
	} else {
		const filesToRemove = [
			path.join(projectDir, "packages/server/src/lib/auth.ts"),
			path.join(projectDir, "packages/server/better-auth.config.js"),
			path.join(projectDir, "packages/client/src/lib/auth-client.ts"),
			path.join(projectDir, "packages/client/src/components/sign-up-form.tsx"),
			path.join(projectDir, "packages/client/src/components/user-menu.tsx"),
		];

		for (const file of filesToRemove) {
			if (await fs.pathExists(file)) {
				await fs.remove(file);
			}
		}

		const routeFiles = [
			path.join(projectDir, "packages/client/src/routes/index.tsx"),
			path.join(projectDir, "packages/client/src/routes/dashboard.tsx"),
			path.join(projectDir, "packages/client/src/components/header.tsx"),
		];

		for (const file of routeFiles) {
			if (await fs.pathExists(file)) {
				let content = await fs.readFile(file, "utf-8");

				content = content.replace(
					/import SignUp from "@\/components\/sign-up-form";/,
					"",
				);
				content = content.replace(/<SignUp \/>/, "");

				content = content.replace(
					/import { authClient } from "@\/lib\/auth-client";/,
					"",
				);
				content = content.replace(
					/import { (?:signIn, signUp, )?useSession } from "@\/lib\/auth-client";/,
					"",
				);
				content = content.replace(
					/const { data: session, isPending } = useSession\(\);/,
					"",
				);
				content = content.replace(
					/useEffect\(\(\) => \{\s*if \(!session && !isPending\) \{\s*navigate\(\{\s*to: "\/",\s*\}\);\s*\}\s*\}, \[session, isPending\]\);/,
					"",
				);

				content = content.replace(/import UserMenu from ".\/user-menu";/, "");
				content = content.replace(/<UserMenu \/>/, "");

				await fs.writeFile(file, content);
			}
		}
	}
}
