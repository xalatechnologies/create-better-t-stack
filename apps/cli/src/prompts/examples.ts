import { cancel, isCancel, multiselect } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type {
	ProjectBackend,
	ProjectDatabase,
	ProjectExamples,
	ProjectFrontend,
} from "../types";

export async function getExamplesChoice(
	examples?: ProjectExamples[],
	database?: ProjectDatabase,
	frontends?: ProjectFrontend[],
	backend?: ProjectBackend,
): Promise<ProjectExamples[]> {
	if (examples !== undefined) return examples;

	if (database === "none") return [];

	const hasWebFrontend = frontends?.includes("web");
	if (!hasWebFrontend) return [];

	let response: ProjectExamples[] | symbol = [];

	if (backend === "elysia") {
		response = await multiselect<ProjectExamples>({
			message: "Include examples",
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
	}

	if (backend === "hono") {
		response = await multiselect<ProjectExamples>({
			message: "Include examples",
			options: [
				{
					value: "todo",
					label: "Todo App",
					hint: "A simple CRUD example app",
				},
				{
					value: "ai",
					label: "AI Chat",
					hint: "A simple AI chat interface using AI SDK",
				},
			],
			required: false,
			initialValues: DEFAULT_CONFIG.examples,
		});
	}

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
