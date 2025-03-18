import { cancel, confirm, isCancel } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";

export async function getNoInstallChoice(
	noInstall?: boolean,
): Promise<boolean> {
	if (noInstall !== undefined) return noInstall;

	const response = await confirm({
		message: "Do you want to install project dependencies?",
		initialValue: !DEFAULT_CONFIG.noInstall,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return !response;
}
