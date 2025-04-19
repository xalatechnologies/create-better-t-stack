import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectApi, ProjectFrontend } from "../types";

export async function getApiChoice(
	Api?: ProjectApi | undefined,
	frontend?: ProjectFrontend[],
): Promise<ProjectApi> {
	if (Api) return Api;

	const includesNative = frontend?.includes("native");

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

	if (includesNative) {
		apiOptions = [
			{
				value: "trpc" as const,
				label: "tRPC",
				hint: "End-to-end typesafe APIs made easy (Required for Native frontend)",
			},
		];
	}

	const apiType = await select<ProjectApi>({
		message: "Select API type",
		options: apiOptions,
		initialValue: includesNative ? "trpc" : DEFAULT_CONFIG.api,
	});

	if (isCancel(apiType)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	if (includesNative && apiType !== "trpc") {
		return "trpc";
	}

	return apiType;
}
