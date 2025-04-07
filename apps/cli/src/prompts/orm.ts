import { cancel, isCancel, log, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectDatabase, ProjectOrm } from "../types";

export async function getORMChoice(
	orm: ProjectOrm | undefined,
	hasDatabase: boolean,
	database?: ProjectDatabase,
): Promise<ProjectOrm> {
	if (!hasDatabase) return "none";
	if (orm !== undefined) return orm;

	if (database === "mongodb") {
		log.info("Only Prisma is supported with MongoDB.");
		return "prisma";
	}

	const response = await select<ProjectOrm>({
		message: "Select ORM",
		options: [
			{
				value: "drizzle",
				label: "Drizzle",
				hint: "Type-safe, lightweight ORM",
			},
			{
				value: "prisma",
				label: "Prisma",
				hint: "Powerful, feature-rich ORM",
			},
		],
		initialValue: DEFAULT_CONFIG.orm,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
