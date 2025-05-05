import { cancel, isCancel, log, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectApi, ProjectBackend, ProjectFrontend } from "../types";

export async function getApiChoice(
	Api?: ProjectApi | undefined,
	frontend?: ProjectFrontend[],
	backend?: ProjectBackend,
): Promise<ProjectApi> {
	if (backend === "convex") {
		return "none";
	}

	if (Api) return Api;

	const includesNuxt = frontend?.includes("nuxt");
	const includesSvelte = frontend?.includes("svelte");
	const includesSolid = frontend?.includes("solid");

	let apiOptions = [
		{
			value: "trpc" as const,
			label: "tRPC",
			hint: "End-to-end typesafe APIs made easy",
		},
		{
			value: "orpc" as const,
			label: "oRPC",
			hint: "End-to-end type-safe APIs that adhere to OpenAPI standards",
		},
	];

	if (includesNuxt || includesSvelte || includesSolid) {
		apiOptions = [
			{
				value: "orpc" as const,
				label: "oRPC",
				hint: `End-to-end type-safe APIs (Required for ${
					includesNuxt ? "Nuxt" : includesSvelte ? "Svelte" : "Solid"
				} frontend)`,
			},
		];
	}

	const apiType = await select<ProjectApi>({
		message: "Select API type",
		options: apiOptions,
		initialValue:
			includesNuxt || includesSvelte || includesSolid
				? "orpc"
				: DEFAULT_CONFIG.api,
	});

	if (isCancel(apiType)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	if ((includesNuxt || includesSvelte || includesSolid) && apiType !== "orpc") {
		return "orpc";
	}

	return apiType;
}
