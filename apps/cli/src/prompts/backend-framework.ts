import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { BackendFramework } from "../types";

export async function getBackendFrameworkChoice(
	backendFramework?: BackendFramework,
): Promise<BackendFramework> {
	if (backendFramework !== undefined) return backendFramework;

	const response = await select<BackendFramework>({
		message: "Which backend framework would you like to use?",
		options: [
			{
				value: "hono",
				label: "Hono",
				hint: "Lightweight, ultrafast web framework",
			},
			{
				value: "elysia",
				label: "Elysia",
				hint: "TypeScript framework with end-to-end type safety)",
			},
		],
		initialValue: DEFAULT_CONFIG.backendFramework,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
