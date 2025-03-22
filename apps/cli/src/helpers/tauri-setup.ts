import path from "node:path";
import { log, spinner } from "@clack/prompts";
import { $, execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { PackageManager } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupTauri(
	projectDir: string,
	packageManager: PackageManager,
): Promise<void> {
	const s = spinner();
	const clientPackageDir = path.join(projectDir, "packages/client");

	try {
		s.start("Setting up Tauri desktop app support...");

		addPackageDependency({
			devDependencies: ["@tauri-apps/cli"],
			projectDir: clientPackageDir,
		});

		const clientPackageJsonPath = path.join(clientPackageDir, "package.json");
		if (await fs.pathExists(clientPackageJsonPath)) {
			const packageJson = await fs.readJson(clientPackageJsonPath);

			// Add Tauri scripts
			packageJson.scripts = {
				...packageJson.scripts,
				tauri: "tauri",
				"desktop:dev": "tauri dev",
				"desktop:build": "tauri build",
			};

			await fs.writeJson(clientPackageJsonPath, packageJson, { spaces: 2 });
		}

		// Initialize Tauri in the client directory
		// This creates the src-tauri folder structure with necessary config files

		await execa(
			"npx",
			[
				"@tauri-apps/cli@latest",
				"init",
				`--app-name=${path.basename(projectDir)}`,
				`--window-title=${path.basename(projectDir)}`,
				"--frontend-dist=dist",
				"--dev-url=http://localhost:3001",
				`--before-dev-command=${packageManager} run dev`,
				`--before-build-command=${packageManager} run build`,
			],
			{
				cwd: clientPackageDir,
				env: {
					CI: "true",
				},
			},
		);
		s.stop("Tauri desktop app support configured successfully!");
	} catch (error) {
		s.stop(pc.red("Failed to set up Tauri"));
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		throw error;
	}
}
