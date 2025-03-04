import path from "node:path";
import { log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { PKG_ROOT } from "../constants";
import type { ProjectConfig } from "../types";

export async function configureAuth(
	projectDir: string,
	enableAuth: boolean,
	hasDatabase: boolean,
	options: ProjectConfig,
): Promise<void> {
	const serverDir = path.join(projectDir, "packages/server");
	const clientDir = path.join(projectDir, "packages/client");

	try {
		if (!enableAuth) {
			await fs.remove(path.join(clientDir, "src/components/sign-up-form.tsx"));
			await fs.remove(path.join(clientDir, "src/components/user-menu.tsx"));
			await fs.remove(path.join(clientDir, "src/lib/auth-client.ts"));
			await fs.remove(path.join(clientDir, "src/lib/schemas.ts"));

			await fs.remove(path.join(serverDir, "src/lib/auth.ts"));

			const indexFilePath = path.join(serverDir, "src/index.ts");
			const indexContent = await fs.readFile(indexFilePath, "utf8");
			const updatedIndexContent = indexContent
				.replace(/import { auth } from "\.\/lib\/auth";\n/, "")
				.replace(
					/app\.on\(\["POST", "GET"\], "\/api\/auth\/\*\*", \(c\) => auth\.handler\(c\.req\.raw\)\);\n\n/,
					"",
				);
			await fs.writeFile(indexFilePath, updatedIndexContent, "utf8");

			const contextFilePath = path.join(serverDir, "src/lib/context.ts");
			const contextContent = await fs.readFile(contextFilePath, "utf8");
			const updatedContextContent = contextContent
				.replace(/import { auth } from "\.\/auth";\n/, "")
				.replace(
					/const session = await auth\.api\.getSession\({\n\s+headers: hono\.req\.raw\.headers,\n\s+}\);/,
					"const session = null;",
				);
			await fs.writeFile(contextFilePath, updatedContextContent, "utf8");
		} else if (!hasDatabase) {
			log.warn(
				pc.yellow(
					"Authentication enabled but no database selected. Auth will not function properly.",
				),
			);
		} else {
			const envPath = path.join(serverDir, ".env");
			const envExamplePath = path.join(serverDir, "_env");

			if (await fs.pathExists(envExamplePath)) {
				await fs.copy(envExamplePath, envPath);
				await fs.remove(envExamplePath);
			}

			if (options.orm === "prisma") {
				const prismaAuthPath = path.join(serverDir, "src/lib/auth.ts");
				const defaultPrismaAuthPath = path.join(
					PKG_ROOT,
					"template/with-prisma/packages/server/src/lib/auth.ts",
				);

				if (
					(await fs.pathExists(defaultPrismaAuthPath)) &&
					!(await fs.pathExists(prismaAuthPath))
				) {
					await fs.ensureDir(path.dirname(prismaAuthPath));
					await fs.copy(defaultPrismaAuthPath, prismaAuthPath);
				}
			} else if (options.orm === "drizzle") {
				const drizzleAuthPath = path.join(serverDir, "src/lib/auth.ts");
				const defaultDrizzleAuthPath = path.join(
					PKG_ROOT,
					"template/with-drizzle/packages/server/src/lib/auth.ts",
				);

				if (
					(await fs.pathExists(defaultDrizzleAuthPath)) &&
					!(await fs.pathExists(drizzleAuthPath))
				) {
					await fs.ensureDir(path.dirname(drizzleAuthPath));
					await fs.copy(defaultDrizzleAuthPath, drizzleAuthPath);
				}
			}
		}
	} catch (error) {
		log.error(pc.red("Failed to configure authentication"));
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		throw error;
	}
}
