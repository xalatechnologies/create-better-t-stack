import { cancel, isCancel, multiselect } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectDatabase, ProjectExamples } from "../types";

export async function getExamplesChoice(
	examples?: ProjectExamples[],
	database?: ProjectDatabase,
): Promise<ProjectExamples[]> {
	if (examples !== undefined) return examples;

	if (database === "none") return [];

	const response = await multiselect<ProjectExamples>({
		message: "Which examples would you like to include?",
		options: [
			{
				value: "todo",
				label: "Todo App",
				hint: "A simple CRUD example app",
			},
		],
		required: false,
		initialValues: DEFAULT_CONFIG.examples,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
