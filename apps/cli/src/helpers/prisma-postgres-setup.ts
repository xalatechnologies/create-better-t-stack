import path from "node:path";
import { cancel, isCancel, log, password } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectPackageManager } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

type PrismaConfig = {
	databaseUrl: string;
};

async function initPrismaDatabase(
	serverDir: string,
	packageManager: ProjectPackageManager,
): Promise<PrismaConfig | null> {
	try {
		log.info(pc.blue("Initializing Prisma PostgreSQL"));

		const prismaDir = path.join(serverDir, "prisma");
		await fs.ensureDir(prismaDir);

		const initCmd =
			packageManager === "npm"
				? "npx"
				: packageManager === "pnpm"
					? "pnpm dlx"
					: "bunx";

		await execa(initCmd, ["prisma", "init", "--db"], {
			cwd: serverDir,
			stdio: "inherit",
		});

		log.info(
			pc.yellow(
				"Please copy the Prisma Postgres URL from the output above.\nIt looks like: prisma+postgres://accelerate.prisma-data.net/?api_key=...",
			),
		);

		const databaseUrl = await password({
			message: "Paste your Prisma Postgres database URL:",
			validate(value) {
				if (!value) return "Please enter a database URL";
				if (!value.startsWith("prisma+postgres://")) {
					return "URL should start with prisma+postgres://";
				}
			},
		});

		if (isCancel(databaseUrl)) {
			cancel("Database setup cancelled");
			return null;
		}

		return {
			databaseUrl: databaseUrl as string,
		};
	} catch (error) {
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		return null;
	}
}

async function writeEnvFile(projectDir: string, config?: PrismaConfig) {
	const envPath = path.join(projectDir, "apps/server", ".env");
	let envContent = "";

	if (await fs.pathExists(envPath)) {
		envContent = await fs.readFile(envPath, "utf8");
	}

	const databaseUrlLine = config
		? `DATABASE_URL="${config.databaseUrl}"`
		: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"`;

	if (!envContent.includes("DATABASE_URL=")) {
		envContent += `\n${databaseUrlLine}`;
	} else {
		envContent = envContent.replace(
			/DATABASE_URL=.*(\r?\n|$)/,
			`${databaseUrlLine}$1`,
		);
	}

	await fs.writeFile(envPath, envContent.trim());
}

function displayManualSetupInstructions() {
	log.info(`Manual Prisma PostgreSQL Setup Instructions:

1. Visit https://console.prisma.io and create an account
2. Create a new PostgreSQL database from the dashboard
3. Get your database URL
4. Add the database URL to the .env file in apps/server/.env

DATABASE_URL="your_database_url"`);
}

export async function setupPrismaPostgres(
	projectDir: string,
	shouldSetupPrisma: boolean,
	packageManager: ProjectPackageManager = "npm",
) {
	const serverDir = path.join(projectDir, "apps/server");

	if (!shouldSetupPrisma) {
		await writeEnvFile(projectDir);
		log.info(
			pc.blue(
				"Using default Postgres configuration. You'll need to provide your own database.",
			),
		);
		return;
	}

	try {
		const config = await initPrismaDatabase(serverDir, packageManager);

		if (config) {
			await writeEnvFile(projectDir, config);
			await addPrismaAccelerateExtension(serverDir);
			log.success(
				pc.green("Prisma PostgreSQL database configured successfully!"),
			);
		} else {
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
		}
	} catch (error) {
		log.error(pc.red(`Error during Prisma PostgreSQL setup: ${error}`));
		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
		log.info("Setup completed with manual configuration required.");
	}
}

async function addPrismaAccelerateExtension(serverDir: string) {
	try {
		addPackageDependency({
			dependencies: ["@prisma/extension-accelerate"],
			projectDir: serverDir,
		});

		const prismaIndexPath = path.join(serverDir, "prisma/index.ts");
		const prismaIndexContent = `
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export default prisma;
`;
		await fs.writeFile(prismaIndexPath, prismaIndexContent.trim());

		const dbFilePath = path.join(serverDir, "src/db/index.ts");
		if (await fs.pathExists(dbFilePath)) {
			let dbFileContent = await fs.readFile(dbFilePath, "utf8");

			if (!dbFileContent.includes("@prisma/extension-accelerate")) {
				dbFileContent = `import { withAccelerate } from "@prisma/extension-accelerate";\n${dbFileContent}`;

				dbFileContent = dbFileContent.replace(
					"export const db = new PrismaClient();",
					"export const db = new PrismaClient().$extends(withAccelerate());",
				);

				await fs.writeFile(dbFilePath, dbFileContent);
			}
		}
	} catch (error) {
		log.warn(
			pc.yellow("Could not add Prisma Accelerate extension automatically"),
		);
	}
}
