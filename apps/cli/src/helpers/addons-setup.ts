import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type {
	ProjectAddons,
	ProjectFrontend,
	ProjectPackageManager,
} from "../types";
import { addPackageDependency } from "../utils/add-package-deps";
import { setupTauri } from "./tauri-setup";

export async function setupAddons(
	projectDir: string,
	addons: ProjectAddons[],
	packageManager: ProjectPackageManager,
	frontends: ProjectFrontend[],
) {
	const hasWebFrontend =
		frontends.includes("react-router") || frontends.includes("tanstack-router");

	if (addons.includes("pwa") && hasWebFrontend) {
		await setupPwa(projectDir, frontends);
	}
	if (addons.includes("tauri") && hasWebFrontend) {
		await setupTauri(projectDir, packageManager, frontends);
	}
	if (addons.includes("biome")) {
		await setupBiome(projectDir);
	}
	if (addons.includes("husky")) {
		await setupHusky(projectDir);
	}
}

export function getWebAppDir(
	projectDir: string,
	frontends: ProjectFrontend[],
): string {
	return path.join(projectDir, "apps/web");
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

async function setupPwa(projectDir: string, frontends: ProjectFrontend[]) {
	const pwaTemplateDir = path.join(PKG_ROOT, "template/with-pwa");
	if (await fs.pathExists(pwaTemplateDir)) {
		await fs.copy(pwaTemplateDir, projectDir, { overwrite: true });
	}

	const clientPackageDir = getWebAppDir(projectDir, frontends);

	if (!(await fs.pathExists(clientPackageDir))) {
		return;
	}

	addPackageDependency({
		dependencies: ["vite-plugin-pwa"],
		devDependencies: ["@vite-pwa/assets-generator"],
		projectDir: clientPackageDir,
	});

	const viteConfigPath = path.join(clientPackageDir, "vite.config.ts");
	if (await fs.pathExists(viteConfigPath)) {
		let viteConfig = await fs.readFile(viteConfigPath, "utf8");

		if (!viteConfig.includes("vite-plugin-pwa")) {
			const firstImportMatch = viteConfig.match(
				/^import .* from ['"](.*)['"]/m,
			);

			if (firstImportMatch) {
				viteConfig = viteConfig.replace(
					firstImportMatch[0],
					`import { VitePWA } from "vite-plugin-pwa";\n${firstImportMatch[0]}`,
				);
			} else {
				viteConfig = `import { VitePWA } from "vite-plugin-pwa";\n${viteConfig}`;
			}
		}

		const pwaPluginCode = `VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "My App",
        short_name: "My App",
        description: "My App",
        theme_color: "#0c0c0c",
      },
      pwaAssets: {
        disabled: false,
        config: true,
      },
      devOptions: {
        enabled: true,
      },
    })`;

		if (!viteConfig.includes("VitePWA(")) {
			if (frontends.includes("react-router")) {
				viteConfig = viteConfig.replace(
					/plugins: \[\s*tailwindcss\(\)/,
					`plugins: [\n    tailwindcss(),\n    ${pwaPluginCode}`,
				);
			} else if (frontends.includes("tanstack-router")) {
				viteConfig = viteConfig.replace(
					/plugins: \[\s*tailwindcss\(\)/,
					`plugins: [\n    tailwindcss(),\n    ${pwaPluginCode}`,
				);
			} else {
				viteConfig = viteConfig.replace(
					/plugins: \[/,
					`plugins: [\n    ${pwaPluginCode},`,
				);
			}
		}

		await fs.writeFile(viteConfigPath, viteConfig);
	}

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
