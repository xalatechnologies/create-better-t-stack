import type { ProjectConfig } from "../types";

export function generateReproducibleCommand(config: ProjectConfig): string {
	const flags: string[] = [];

	if (config.database === "none") {
		flags.push("--no-database");
	} else if (config.database === "sqlite") {
		flags.push("--sqlite");
	} else if (config.database === "postgres") {
		flags.push("--postgres");
	}

	if (config.database !== "none") {
		if (config.orm === "drizzle") {
			flags.push("--drizzle");
		} else if (config.orm === "prisma") {
			flags.push("--prisma");
		}
	}

	if (config.auth) {
		flags.push("--auth");
	} else {
		flags.push("--no-auth");
	}

	if (config.git) {
		flags.push("--git");
	} else {
		flags.push("--no-git");
	}

	if (config.noInstall) {
		flags.push("--no-install");
	} else {
		flags.push("--install");
	}

	if (config.packageManager) {
		flags.push(`--${config.packageManager}`);
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

	if (config.database === "sqlite") {
		if (config.turso) {
			flags.push("--turso");
		} else {
			flags.push("--no-turso");
		}
	}

	const baseCommand = "npx create-better-t-stack";
	const projectName = config.projectName ? ` ${config.projectName}` : "";
	const flagString = flags.length > 0 ? ` ${flags.join(" ")}` : "";

	return `${baseCommand}${projectName}${flagString}`;
}
