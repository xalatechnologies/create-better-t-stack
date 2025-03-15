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
	const cdCmd = `cd ${projectName}`;

	const steps = [];

	if (!depsInstalled) {
		steps.push(`${pc.cyan(packageManager)} install`);
	}

	if (hasAuth && database !== "none") {
		steps.push(`${pc.yellow("Authentication Setup:")}`);
		steps.push(
			`${pc.cyan("1.")} Generate auth schema: ${pc.green(`${runCmd} auth:generate`)}`,
		);

		if (orm === "prisma") {
			steps.push(
				`${pc.cyan("2.")} Generate Prisma client: ${pc.green(`${runCmd} prisma:generate`)}`,
			);
			steps.push(
				`${pc.cyan("3.")} Push schema to database: ${pc.green(`${runCmd} prisma:push`)}`,
			);
		} else if (orm === "drizzle") {
			steps.push(
				`${pc.cyan("2.")} Apply migrations: ${pc.green(`${runCmd} drizzle:migrate`)}`,
			);
		}
	}

	if (database === "postgres") {
		steps.push(`${pc.yellow("PostgreSQL Configuration:")}`);
		steps.push(
			`Make sure to update ${pc.cyan("packages/server/.env")} with your PostgreSQL connection string.`,
		);
	} else if (database === "sqlite") {
		steps.push(`${pc.yellow("Database Configuration:")}`);
		steps.push(
			`${pc.cyan("packages/server/.env")} contains your SQLite connection details. Update if needed.`,
		);
		steps.push(
			`Start the local SQLite database with: ${pc.green(`${runCmd} db:local`)}`,
		);
	}

	steps.push(`${pc.yellow("Start Development:")}`);
	steps.push(`${pc.green(`${runCmd} dev`)}`);

	log.info(`${pc.cyan("Installation completed!")} Here are some next steps:

${cdCmd}
${steps.join("\n")}

The client application will be available at ${pc.cyan("http://localhost:3001")}
The API server will be running at ${pc.cyan("http://localhost:3000")}`);
}
