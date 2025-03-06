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
				value: "github-actions",
				label: "GitHub Actions",
				hint: "CI/CD workflows",
			},
			{
				value: "SEO",
				label: "Basic SEO setup",
				hint: "Search engine optimization configuration",
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
