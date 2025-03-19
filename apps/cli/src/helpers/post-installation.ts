import { log } from "@clack/prompts";
import pc from "picocolors";

export function displayPostInstallInstructions(
	database: string,
	projectName: string,
	packageManager: string,
	depsInstalled: boolean,
	orm?: string,
) {
	const runCmd = packageManager === "npm" ? "npm run" : packageManager;
	const cdCmd = `cd ${projectName}`;

	log.info(`${pc.cyan("Project created successfully!")}

${pc.bold("Next steps:")}
${pc.cyan("1.")} ${cdCmd}
${!depsInstalled ? `${pc.cyan("2.")} ${packageManager} install\n` : ""}${pc.cyan(depsInstalled ? "2." : "3.")} ${runCmd} dev

${pc.bold("Your project will be available at:")}
${pc.cyan("•")} Frontend: http://localhost:3001
${pc.cyan("•")} API: http://localhost:3000

${database !== "none" ? getDatabaseInstructions(database, orm, runCmd) : ""}`);
}

function getDatabaseInstructions(
	database: string,
	orm?: string,
	runCmd?: string,
): string {
	const instructions = [];

	if (orm === "prisma") {
		instructions.push(
			`${pc.cyan("•")} Apply schema: ${pc.dim(`${runCmd} db:push`)}`,
		);
		instructions.push(
			`${pc.cyan("•")} Database UI: ${pc.dim(`${runCmd} db:studio`)}`,
		);

		if (database === "turso") {
			instructions.push(
				`${pc.yellow("NOTE:")} Turso support with Prisma is in Early Access and requires additional setup.`,
				`${pc.dim("Learn more at: https://www.prisma.io/docs/orm/overview/databases/turso")}`,
			);
		}
	} else if (orm === "drizzle") {
		instructions.push(
			`${pc.cyan("•")} Apply schema: ${pc.dim(`${runCmd} db:push`)}`,
		);
		instructions.push(
			`${pc.cyan("•")} Database UI: ${pc.dim(`${runCmd} db:studio`)}`,
		);
	}

	if (database === "sqlite") {
		instructions.push(
			`${pc.cyan("•")} Start local DB: ${pc.dim(`cd packages/server && ${runCmd} db:local`)}`,
		);
	}

	return instructions.length
		? `${pc.bold("Database commands:")}\n${instructions.join("\n")}\n\n`
		: "";
}
