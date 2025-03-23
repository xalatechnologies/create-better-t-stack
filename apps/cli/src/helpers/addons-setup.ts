import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type { PackageManager, ProjectAddons } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";
import { setupTauri } from "./tauri-setup";

export async function setupAddons(
	projectDir: string,
	addons: ProjectAddons[],
	packageManager: PackageManager,
) {
	// if (addons.includes("docker")) {
	// 	await setupDocker(projectDir);
	// }
	if (addons.includes("pwa")) {
		await setupPwa(projectDir);
	}
	if (addons.includes("tauri")) {
		await setupTauri(projectDir, packageManager);
	}
	if (addons.includes("biome")) {
		await setupBiome(projectDir);
	}
	if (addons.includes("husky")) {
		await setupHusky(projectDir);
	}
}

async function setupBiome(projectDir: string) {
	const biomeTemplateDir = path.join(PKG_ROOT, "template/with-biome");
	if (await fs.pathExists(biomeTemplateDir)) {
		await fs.copy(biomeTemplateDir, projectDir, { overwrite: true });
	}

	addPackageDependency({
		devDependencies: ["@biomejs/biome"],
		projectDir,
	});

	const packageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			check: "biome check --write .",
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}
}

async function setupHusky(projectDir: string) {
	const huskyTemplateDir = path.join(PKG_ROOT, "template/with-husky");
	if (await fs.pathExists(huskyTemplateDir)) {
		await fs.copy(huskyTemplateDir, projectDir, { overwrite: true });
	}

	addPackageDependency({
		devDependencies: ["husky", "lint-staged"],
		projectDir,
	});

	const packageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			prepare: "husky",
		};

		packageJson["lint-staged"] = {
			"*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
				"biome check --write .",
			],
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}
}

async function setupPwa(projectDir: string) {
	const pwaTemplateDir = path.join(PKG_ROOT, "template/with-pwa");
	if (await fs.pathExists(pwaTemplateDir)) {
		await fs.copy(pwaTemplateDir, projectDir, { overwrite: true });
	}

	const clientPackageDir = path.join(projectDir, "packages/client");

	addPackageDependency({
		dependencies: ["vite-plugin-pwa"],
		devDependencies: ["@vite-pwa/assets-generator"],
		projectDir: clientPackageDir,
	});

	const clientPackageJsonPath = path.join(clientPackageDir, "package.json");
	if (await fs.pathExists(clientPackageJsonPath)) {
		const packageJson = await fs.readJson(clientPackageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			"generate-pwa-assets": "pwa-assets-generator",
		};

		await fs.writeJson(clientPackageJsonPath, packageJson, { spaces: 2 });
	}
}
