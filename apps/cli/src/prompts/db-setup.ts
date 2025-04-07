import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import type { ProjectDBSetup } from "../types";

export async function getDBSetupChoice(
	databaseType: string,
	dbSetup: ProjectDBSetup | undefined,
): Promise<ProjectDBSetup> {
	if (dbSetup !== undefined) return dbSetup as ProjectDBSetup;

	let options: Array<{ value: ProjectDBSetup; label: string; hint: string }> =
		[];

	if (databaseType === "sqlite") {
		options = [
			{
				value: "turso" as const,
				label: "Turso",
				hint: "Cloud SQLite with libSQL",
			},
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else if (databaseType === "postgres") {
		options = [
			{
				value: "prisma-postgres" as const,
				label: "Prisma Postgres",
				hint: "Managed by Prisma",
			},
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else if (databaseType === "mongodb") {
		options = [
			{
				value: "mongodb-atlas" as const,
				label: "MongoDB Atlas",
				hint: "Cloud MongoDB service",
			},
			{ value: "none" as const, label: "None", hint: "Manual setup" },
		];
	} else {
		return "none";
	}

	const response = await select<ProjectDBSetup>({
		message: `Select ${databaseType} setup option`,
		options,
		initialValue: "none",
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
