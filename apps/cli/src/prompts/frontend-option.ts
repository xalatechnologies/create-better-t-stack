import { cancel, isCancel, multiselect } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectFrontend } from "../types";

export async function getFrontendChoice(
	frontendOptions?: ProjectFrontend[],
): Promise<ProjectFrontend[]> {
	if (frontendOptions !== undefined) return frontendOptions;

	const response = await multiselect<ProjectFrontend>({
		message: "Choose frontends",
		options: [
			{
				value: "web",
				label: "Web App",
				hint: "React + TanStack Router web application",
			},
			{
				value: "native",
				label: "Native App",
				hint: "React Native + Expo application",
			},
		],
		initialValues: DEFAULT_CONFIG.frontend,
		required: false,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
