import { log, spinner } from "@clack/prompts";
import { $ } from "execa";
import pc from "picocolors";
import type { PackageManager, ProjectAddons } from "../types";

export async function installDependencies({
	projectDir,
	packageManager,
	addons = [],
}: {
	projectDir: string;
	packageManager: PackageManager;
	addons?: ProjectAddons[];
}) {
	const s = spinner();

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
			case "bun":
				await $({
					cwd: projectDir,
				})`${packageManager} install`;
				break;
		}

		s.stop("Dependencies installed successfully");

		if (addons.includes("biome") || addons.includes("husky")) {
			await runBiomeCheck(projectDir, packageManager);
		}
	} catch (error) {
		s.stop(pc.red("Failed to install dependencies"));
		if (error instanceof Error) {
			log.error(pc.red(`Installation error: ${error.message}`));
		}
		throw error;
	}
}

async function runBiomeCheck(
	projectDir: string,
	packageManager: PackageManager,
) {
	const s = spinner();

	try {
		s.start("Running Biome format check...");

		await $({ cwd: projectDir })`${packageManager} biome check --write .`;

		s.stop("Biome check completed successfully");
	} catch (error) {
		s.stop(pc.yellow("Biome check encountered issues"));
		log.warn(pc.yellow("Some files may need manual formatting"));
	}
}
