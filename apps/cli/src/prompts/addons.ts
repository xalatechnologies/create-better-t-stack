import { cancel, isCancel, multiselect } from "@clack/prompts";
import pc from "picocolors";
import type { ProjectAddons } from "../types";

export async function getAddonsChoice(
	Addons?: ProjectAddons[],
): Promise<ProjectAddons[]> {
	if (Addons !== undefined) return Addons;

	const response = await multiselect<ProjectAddons>({
		message: "Which Addons would you like to add?",
		options: [
			{
				value: "docker",
				label: "Docker setup",
				hint: "Containerize your application",
			},
			{
				value: "pwa",
				label: "PWA (Progressive Web App)",
				hint: "Make your app installable and work offline",
			},
		],
		required: false,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
