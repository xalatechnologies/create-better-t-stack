import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import type { ProjectORM } from "../types";

export async function getORMChoice(
	orm: ProjectORM | undefined,
	hasDatabase: boolean,
): Promise<ProjectORM> {
	if (!hasDatabase) return "none";
	if (orm !== undefined) return orm;

	const response = await select<ProjectORM>({
		message: "Which ORM would you like to use?",
		options: [
			{
				value: "drizzle",
				label: "Drizzle",
				hint: "Type-safe, lightweight ORM (recommended)",
			},
			{
				value: "prisma",
				label: "Prisma",
				hint: "Powerful, feature-rich ORM with schema migrations",
			},
		],
		initialValue: "drizzle",
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
