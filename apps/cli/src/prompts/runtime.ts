import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { Runtime } from "../types";

export async function getRuntimeChoice(runtime?: Runtime): Promise<Runtime> {
	if (runtime !== undefined) return runtime;

	const response = await select<Runtime>({
		message: "Which runtime would you like to use?",
		options: [
			{
				value: "bun",
				label: "Bun",
				hint: "Fast all-in-one JavaScript runtime",
			},
			{
				value: "node",
				label: "Node.js",
				hint: "Traditional Node.js runtime",
			},
		],
		initialValue: DEFAULT_CONFIG.runtime,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
