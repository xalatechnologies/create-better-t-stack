import { DEFAULT_CONFIG } from "../consts";
import type { ProjectConfig } from "../types";
import { getUserPkgManager } from "./get-package-manager";

export function generateReproducibleCommand(config: ProjectConfig): string {
	const flags: string[] = [];
	const defaultPackageManager = getUserPkgManager();

	if (config.database !== DEFAULT_CONFIG.database) {
		flags.push(`--database ${config.database}`);
	}
	if (config.auth !== DEFAULT_CONFIG.auth) {
		flags.push("--no-auth");
	}
	if (
		config.packageManager &&
		config.packageManager !== defaultPackageManager
	) {
		flags.push(`--package-manager ${config.packageManager}`);
	}

	for (const feature of config.features) {
		flags.push(`--${feature}`);
	}

	return `npx create-better-t-stack${
		config.projectName ? ` ${config.projectName}` : ""
	}${flags.length > 0 ? ` ${flags.join(" ")}` : ""}`;
}
