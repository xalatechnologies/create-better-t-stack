import { cancel, confirm, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import type { PackageManager } from "../types";
import { getUserPkgManager } from "../utils/get-package-manager";

export async function getPackageManagerChoice(
	packageManager?: PackageManager,
): Promise<PackageManager> {
	if (packageManager !== undefined) return packageManager;

	const detectedPackageManager = getUserPkgManager();
	const useDetected = await confirm({
		message: `Use ${detectedPackageManager} as your package manager?`,
	});

	if (isCancel(useDetected)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	if (useDetected) return detectedPackageManager;

	const response = await select<PackageManager>({
		message: "Which package manager would you like to use?",
		options: [
			{ value: "npm", label: "npm", hint: "Node Package Manager" },
			{
				value: "pnpm",
				label: "pnpm",
				hint: "Fast, disk space efficient package manager",
			},
			{
				value: "yarn",
				label: "yarn",
				hint: "Fast, reliable, and secure dependency management",
			},
			{
				value: "bun",
				label: "bun",
				hint: "All-in-one JavaScript runtime & toolkit (recommended)",
			},
		],
		initialValue: "bun",
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
