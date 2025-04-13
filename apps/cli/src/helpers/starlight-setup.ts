import path from "node:path";
import { log, spinner } from "@clack/prompts";
import consola from "consola";
import { execa } from "execa";
import pc from "picocolors";
import type { ProjectPackageManager } from "../types";

export async function setupStarlight(
	projectDir: string,
	packageManager: ProjectPackageManager,
): Promise<void> {
	const s = spinner();

	try {
		s.start("Setting up Starlight documentation site...");

		let cmd: string;
		let args: string[];

		switch (packageManager) {
			case "npm":
				cmd = "npx";
				args = ["create-astro@latest"];
				break;
			case "pnpm":
				cmd = "pnpm";
				args = ["dlx", "create-astro@latest"];
				break;
			case "bun":
				cmd = "bunx";
				args = ["create-astro@latest"];
				break;
			default:
				cmd = "npx";
				args = ["create-astro@latest"];
		}

		args = [
			...args,
			"docs",
			"--template",
			"starlight",
			"--no-install",
			"--add",
			"tailwind",
			"--no-git",
			"--skip-houston",
		];

		await execa(cmd, args, {
			cwd: path.join(projectDir, "apps"),
			env: {
				CI: "true",
			},
		});

		s.stop("Starlight documentation site setup successfully!");
	} catch (error) {
		s.stop(pc.red("Failed to set up Starlight documentation site"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
		throw error;
	}
}
