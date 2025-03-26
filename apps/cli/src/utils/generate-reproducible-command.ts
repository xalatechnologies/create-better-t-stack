import type { ProjectConfig } from "../types";

export function generateReproducibleCommand(config: ProjectConfig): string {
	const flags: string[] = [];

	if (config.database === "none") {
		flags.push("--no-database");
	} else {
		flags.push(`--${config.database}`);

		if (config.orm) {
			flags.push(`--${config.orm}`);
		}

		if (config.database === "sqlite") {
			flags.push(config.turso ? "--turso" : "--no-turso");
		}
	}

	flags.push(config.auth ? "--auth" : "--no-auth");

	flags.push(config.git ? "--git" : "--no-git");

	flags.push(config.noInstall ? "--no-install" : "--install");

	if (config.packageManager) {
		flags.push(`--${config.packageManager}`);
	}

	if (config.backendFramework) {
		flags.push(`--${config.backendFramework}`);
	}

	if (config.runtime) {
		flags.push(`--runtime ${config.runtime}`);
	}

	if (config.addons.length > 0) {
		for (const addon of config.addons) {
			flags.push(`--${addon}`);
		}
	} else {
		flags.push("--no-addons");
	}

	if (config.examples && config.examples.length > 0) {
		flags.push(`--examples ${config.examples.join(",")}`);
	} else {
		flags.push("--no-examples");
	}

	const baseCommand = "npx create-better-t-stack";
	const projectName = config.projectName ? ` ${config.projectName}` : "";

	return `${baseCommand}${projectName} ${flags.join(" ")}`;
}
