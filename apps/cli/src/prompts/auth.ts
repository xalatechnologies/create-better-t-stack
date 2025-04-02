import { cancel, confirm, isCancel, log } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectFrontend } from "../types";

export async function getAuthChoice(
	auth: boolean | undefined,
	hasDatabase: boolean,
	frontends?: ProjectFrontend[],
): Promise<boolean> {
	if (!hasDatabase) return false;

	const hasNative = frontends?.includes("native");
	const hasWeb =
		frontends?.includes("tanstack-router") ||
		frontends?.includes("react-router");

	if (hasNative) {
		log.warn(
			pc.yellow("Note: Authentication is not yet available with native"),
		);
	}

	if (!hasWeb) return false;

	if (auth !== undefined) return auth;

	const response = await confirm({
		message: "Add authentication with Better-Auth?",
		initialValue: DEFAULT_CONFIG.auth,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
