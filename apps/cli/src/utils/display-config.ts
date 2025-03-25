import pc from "picocolors";
import type { ProjectConfig } from "../types";

export function displayConfig(config: Partial<ProjectConfig>) {
	const configDisplay = [];

	if (config.projectName) {
		configDisplay.push(`${pc.blue("Project Name:")} ${config.projectName}`);
	}
	if (config.database) {
		configDisplay.push(`${pc.blue("Database:")} ${config.database}`);
	}
	if (config.orm) {
		configDisplay.push(`${pc.blue("ORM:")} ${config.orm}`);
	}
	if (config.auth !== undefined) {
		configDisplay.push(`${pc.blue("Authentication:")} ${config.auth}`);
	}
	if (config.runtime) {
		configDisplay.push(`${pc.blue("Runtime:")} ${config.runtime}`);
	}
	if (config.addons?.length) {
		configDisplay.push(`${pc.blue("Addons:")} ${config.addons.join(", ")}`);
	}
	if (config.git !== undefined) {
		configDisplay.push(`${pc.blue("Git Init:")} ${config.git}`);
	}
	if (config.packageManager) {
		configDisplay.push(
			`${pc.blue("Package Manager:")} ${config.packageManager}`,
		);
	}
	if (config.noInstall !== undefined) {
		configDisplay.push(`${pc.blue("Skip Install:")} ${config.noInstall}`);
	}
	if (config.turso !== undefined) {
		configDisplay.push(`${pc.blue("Turso Setup:")} ${config.turso}`);
	}

	return configDisplay.join("\n");
}
