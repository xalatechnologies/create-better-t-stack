import { log, spinner } from "@clack/prompts";
import { $ } from "execa";
import pc from "picocolors";
import type { PackageManager } from "../utils/get-package-manager";

interface InstallDependenciesOptions {
	projectDir: string;
	packageManager: PackageManager;
}

export async function installDependencies({
	projectDir,
	packageManager,
}: InstallDependenciesOptions) {
	const s = spinner();
	log.info(pc.blue(`Installing dependencies using ${packageManager}...`));

	try {
		s.start(`Running ${packageManager} install...`);

		switch (packageManager) {
			case "npm":
				await $({
					cwd: projectDir,
					stderr: "inherit",
				})`${packageManager} install`;
				break;
			case "pnpm":
			case "yarn":
			case "bun":
				await $({
					cwd: projectDir,
				})`${packageManager} install`;
				break;
		}

		s.stop(pc.green("Dependencies installed successfully"));
	} catch (error) {
		s.stop(pc.red("Failed to install dependencies"));
		if (error instanceof Error) {
			log.error(pc.red(`Installation error: ${error.message}`));
		}
		throw error;
	}
}
