import { DEFAULT_CONFIG } from "../constants";
import type { ProjectConfig } from "../types";

export function generateReproducibleCommand(config: ProjectConfig): string {
	const flags: string[] = [];

	const isMainlyDefault = Object.entries(config).every(([key, value]) => {
		if (key === "projectName") return true;
		if (key === "features" && Array.isArray(value)) return value.length === 0;
		return value === DEFAULT_CONFIG[key as keyof ProjectConfig];
	});

	if (isMainlyDefault) {
		flags.push("-y");
	}

	if (config.database !== DEFAULT_CONFIG.database) {
		if (config.database === "none") {
			flags.push("--no-database");
		} else {
			flags.push(config.database === "sqlite" ? "--sqlite" : "--postgres");
		}
	}

	if (config.database !== "none" && config.orm !== DEFAULT_CONFIG.orm) {
		flags.push(config.orm === "drizzle" ? "--drizzle" : "--prisma");
	}

	if (config.auth !== DEFAULT_CONFIG.auth) {
		flags.push("--no-auth");
	}

	if (!config.git) {
		flags.push("--no-git");
	}

	if (
		config.packageManager &&
		config.packageManager !== DEFAULT_CONFIG.packageManager
	) {
		flags.push(`--${config.packageManager}`);
	}

	for (const feature of config.features) {
		flags.push(`--${feature}`);
	}

	const baseCommand = "npx create-better-t-stack";
	const projectName = config.projectName ? ` ${config.projectName}` : "";
	const flagString = flags.length > 0 ? ` ${flags.join(" ")}` : "";

	return `${baseCommand}${projectName}${flagString}`;
}
