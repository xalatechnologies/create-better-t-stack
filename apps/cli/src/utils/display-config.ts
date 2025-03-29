import pc from "picocolors";
import type { ProjectConfig } from "../types";

export function displayConfig(config: Partial<ProjectConfig>) {
	const configDisplay = [];

	if (config.projectName) {
		configDisplay.push(`${pc.blue("Project Name:")} ${config.projectName}`);
	}

	if (config.frontend !== undefined) {
		const frontendText =
			config.frontend.length > 0 ? config.frontend.join(", ") : "none";
		configDisplay.push(`${pc.blue("Frontend:")} ${frontendText}`);
	}

	if (config.backendFramework !== undefined) {
		configDisplay.push(
			`${pc.blue("Backend Framework:")} ${config.backendFramework}`,
		);
	}

	if (config.runtime !== undefined) {
		configDisplay.push(`${pc.blue("Runtime:")} ${config.runtime}`);
	}

	if (config.database !== undefined) {
		configDisplay.push(`${pc.blue("Database:")} ${config.database}`);
	}

	if (config.orm !== undefined) {
		configDisplay.push(`${pc.blue("ORM:")} ${config.orm}`);
	}

	if (config.auth !== undefined) {
		configDisplay.push(`${pc.blue("Authentication:")} ${config.auth}`);
	}

	if (config.addons !== undefined) {
		const addonsText =
			config.addons.length > 0 ? config.addons.join(", ") : "none";
		configDisplay.push(`${pc.blue("Addons:")} ${addonsText}`);
	}

	if (config.examples !== undefined) {
		const examplesText =
			config.examples.length > 0 ? config.examples.join(", ") : "none";
		configDisplay.push(`${pc.blue("Examples:")} ${examplesText}`);
	}

	if (config.git !== undefined) {
		configDisplay.push(`${pc.blue("Git Init:")} ${config.git}`);
	}

	if (config.packageManager !== undefined) {
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
