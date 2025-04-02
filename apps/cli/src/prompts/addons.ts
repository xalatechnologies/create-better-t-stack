import { cancel, isCancel, multiselect } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectAddons, ProjectFrontend } from "../types";

export async function getAddonsChoice(
	Addons?: ProjectAddons[],
	frontends?: ProjectFrontend[],
): Promise<ProjectAddons[]> {
	if (Addons !== undefined) return Addons;

	const hasWeb = frontends?.includes("web");

	const addonOptions = [
		{
			value: "biome" as const,
			label: "Biome",
			hint: "Add Biome for linting and formatting",
		},
		{
			value: "husky" as const,
			label: "Husky",
			hint: "Add Git hooks with Husky, lint-staged (requires Biome)",
		},
	];

	const webAddonOptions = [
		{
			value: "pwa" as const,
			label: "PWA (Progressive Web App)",
			hint: "Make your app installable and work offline",
		},
		{
			value: "tauri" as const,
			label: "Tauri Desktop App",
			hint: "Build native desktop apps from your web frontend",
		},
	];

	const options = hasWeb ? [...webAddonOptions, ...addonOptions] : addonOptions;

	const initialValues = DEFAULT_CONFIG.addons.filter(
		(addon) => hasWeb || (addon !== "pwa" && addon !== "tauri"),
	);

	const response = await multiselect<ProjectAddons>({
		message: "Select addons",
		options,
		initialValues,
		required: false,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	if (response.includes("husky") && !response.includes("biome")) {
		response.push("biome");
	}

	return response;
}
