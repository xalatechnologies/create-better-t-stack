import { DEFAULT_CONFIG } from "../consts";
import type { ProjectConfig } from "../types";

export function generateReproducibleCommand(config: ProjectConfig): string {
	const parts = ["bunx create-better-t-stack"];

	if (config.projectName !== DEFAULT_CONFIG.projectName) {
		parts.push(config.projectName);
	}

	if (config.database !== DEFAULT_CONFIG.database) {
		parts.push(`--database ${config.database}`);
	}

	if (config.auth !== DEFAULT_CONFIG.auth) {
		parts.push(config.auth ? "--auth" : "--no-auth");
	}

	if (config.features.includes("docker")) {
		parts.push("--docker");
	}
	if (config.features.includes("github-actions")) {
		parts.push("--github-actions");
	}
	if (config.features.includes("SEO")) {
		parts.push("--seo");
	}

	return parts.join(" ");
}
