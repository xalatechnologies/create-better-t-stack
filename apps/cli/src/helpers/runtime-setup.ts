import path from "node:path";
import fs from "fs-extra";
import type { Runtime } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupRuntime(
	projectDir: string,
	runtime: Runtime,
): Promise<void> {
	const serverDir = path.join(projectDir, "apps/server");
	const serverIndexPath = path.join(serverDir, "src/index.ts");

	const indexContent = await fs.readFile(serverIndexPath, "utf-8");

	if (runtime === "bun") {
		await setupBunRuntime(serverDir, serverIndexPath, indexContent);
	} else if (runtime === "node") {
		await setupNodeRuntime(serverDir, serverIndexPath, indexContent);
	}
}

async function setupBunRuntime(
	serverDir: string,
	serverIndexPath: string,
	indexContent: string,
): Promise<void> {
	const packageJsonPath = path.join(serverDir, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);

	packageJson.scripts = {
		...packageJson.scripts,
		dev: "bun run --hot src/index.ts",
		start: "bun run dist/src/index.js",
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	addPackageDependency({
		devDependencies: ["@types/bun"],
		projectDir: serverDir,
	});

	if (!indexContent.includes("export default app")) {
		const updatedContent = `${indexContent}\n\nexport default app;\n`;
		await fs.writeFile(serverIndexPath, updatedContent);
	}
}

async function setupNodeRuntime(
	serverDir: string,
	serverIndexPath: string,
	indexContent: string,
): Promise<void> {
	addPackageDependency({
		dependencies: ["@hono/node-server"],
		devDependencies: ["tsx", "@types/node"],
		projectDir: serverDir,
	});

	const packageJsonPath = path.join(serverDir, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);

	packageJson.scripts = {
		...packageJson.scripts,
		dev: "tsx watch src/index.ts",
		start: "node dist/src/index.js",
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	const importLine = 'import { serve } from "@hono/node-server";\n';
	const serverCode = `
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(\`Server is running on http://localhost:\${info.port}\`);
  },
);\n`;

	if (!indexContent.includes("@hono/node-server")) {
		const importEndIndex = indexContent.lastIndexOf("import");
		const importSection = indexContent.substring(0, importEndIndex);
		const restOfFile = indexContent.substring(importEndIndex);

		const updatedContent = importSection + importLine + restOfFile + serverCode;
		await fs.writeFile(serverIndexPath, updatedContent);
	} else if (!indexContent.includes("serve(")) {
		const updatedContent = indexContent + serverCode;
		await fs.writeFile(serverIndexPath, updatedContent);
	}
}
