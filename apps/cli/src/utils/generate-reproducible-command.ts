import chalk from "chalk";
import { DEFAULT_CONFIG } from "../consts";
import type { ProjectConfig } from "../types";
import { getUserPkgManager } from "./get-package-manager";

export function generateReproducibleCommand(config: ProjectConfig): string {
	const flags: string[] = [];
	const defaultPackageManager = getUserPkgManager();

	if (config.database !== DEFAULT_CONFIG.database) {
		flags.push(chalk.cyan(`--database ${config.database}`));
	}

	if (config.auth !== DEFAULT_CONFIG.auth) {
		flags.push(chalk.yellow("--no-auth"));
	}

	if (
		config.packageManager &&
		config.packageManager !== defaultPackageManager
	) {
		flags.push(chalk.magenta(`--package-manager ${config.packageManager}`));
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
