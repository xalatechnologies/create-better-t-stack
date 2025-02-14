import chalk from "chalk";
import { DEFAULT_CONFIG } from "../consts";
import type { ProjectConfig } from "../types";

export function generateReproducibleCommand(config: ProjectConfig): string {
	const flags: string[] = [];

	const isMainlyDefault = Object.entries(config).every(([key, value]) => {
		if (key === "projectName") return true;
		if (key === "features" && Array.isArray(value)) return value.length === 0;
		return value === DEFAULT_CONFIG[key as keyof ProjectConfig];
	});

	if (isMainlyDefault) {
		flags.push(chalk.gray("-y"));
	}

	if (config.database !== DEFAULT_CONFIG.database) {
		flags.push(chalk.cyan(`--database ${config.database}`));
	}

	if (config.auth !== DEFAULT_CONFIG.auth) {
		flags.push(chalk.yellow("--no-auth"));
	}

	if (!config.git) {
		flags.push(chalk.red("--no-git"));
	}

	// Updated package manager flag handling
	if (
		config.packageManager &&
		config.packageManager !== DEFAULT_CONFIG.packageManager
	) {
		flags.push(chalk.magenta(`--${config.packageManager}`));
	}

	for (const feature of config.features) {
		flags.push(chalk.green(`--${feature}`));
	}

	const baseCommand = chalk.bold("npx create-better-t-stack");
	const projectName = config.projectName
		? chalk.blue(` ${config.projectName}`)
		: "";
	const flagString = flags.length > 0 ? ` ${flags.join(" ")}` : "";

	return `${baseCommand}${projectName}${flagString}`;
}
