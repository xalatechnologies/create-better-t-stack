import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectBackend } from "../types";

export async function getBackendFrameworkChoice(
	backendFramework?: ProjectBackend,
): Promise<ProjectBackend> {
	if (backendFramework !== undefined) return backendFramework;

	const response = await select<ProjectBackend>({
		message: "Select backend framework",
		options: [
			{
				value: "hono",
				label: "Hono",
				hint: "Lightweight, ultrafast web framework",
			},
			{
				value: "express",
				label: "Express",
				hint: "Fast, unopinionated, minimalist web framework for Node.js",
			},
			{
				value: "elysia",
				label: "Elysia",
				hint: "Ergonomic web framework for building backend servers",
			},
		],
		initialValue: DEFAULT_CONFIG.backend,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
