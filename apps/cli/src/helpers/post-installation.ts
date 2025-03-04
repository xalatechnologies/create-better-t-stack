import { log } from "@clack/prompts";
import pc from "picocolors";

export function displayPostInstallInstructions(
	hasAuth: boolean,
	database: string,
	projectName: string,
	packageManager: string,
	depsInstalled: boolean,
	orm?: string,
) {
	const runCmd = packageManager === "npm" ? "npm run" : packageManager;

	log.info(`${pc.cyan("Installation completed!")} Here are some next steps:

${
	hasAuth && database !== "none"
		? `${pc.yellow("Authentication Setup:")}
${pc.cyan("1.")} Generate auth schema: ${pc.green(`cd ${projectName} && ${packageManager} run auth:generate`)}
${
	orm === "prisma"
		? `${pc.cyan("2.")} Generate Prisma client: ${pc.green(`${packageManager} run prisma:generate`)}
${pc.cyan("3.")} Push schema to database: ${pc.green(`${packageManager} run prisma:push`)}`
		: `${pc.cyan("2.")} Apply migrations: ${pc.green(`${packageManager} run drizzle:migrate`)}`
}

`
		: ""
}${
	database === "postgres"
		? `${pc.yellow("PostgreSQL Configuration:")}
Make sure to update ${pc.cyan("packages/server/.env")} with your PostgreSQL connection string.

`
		: database === "sqlite"
			? `${pc.yellow("Database Configuration:")}
${pc.cyan("packages/server/.env")} contains your SQLite connection details. Update if needed.`
			: ""
}

${pc.yellow("Start Development:")}
${pc.cyan("cd")} ${projectName}${!depsInstalled ? `\n${pc.cyan(packageManager)} install` : ""}
${pc.cyan(runCmd)} dev`);
}
