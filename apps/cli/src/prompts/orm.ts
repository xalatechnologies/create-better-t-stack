import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectOrm } from "../types";

export async function getORMChoice(
	orm: ProjectOrm | undefined,
	hasDatabase: boolean,
): Promise<ProjectOrm> {
	if (!hasDatabase) return "none";
	if (orm !== undefined) return orm;

	const response = await select<ProjectOrm>({
		message: "Which ORM would you like to use?",
		options: [
			{
				value: "drizzle",
				label: "Drizzle",
				hint: "Type-safe, lightweight ORM",
			},
			{
				value: "prisma",
				label: "Prisma",
				hint: "Powerful, feature-rich ORM with schema migrations",
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
