import path from "node:path";
import fs from "fs-extra";
import type { ProjectBackend, ProjectRuntime } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupRuntime(
	projectDir: string,
	runtime: ProjectRuntime,
	backendFramework: ProjectBackend,
): Promise<void> {
	const serverDir = path.join(projectDir, "apps/server");
	const serverIndexPath = path.join(serverDir, "src/index.ts");

	const indexContent = await fs.readFile(serverIndexPath, "utf-8");

	if (runtime === "bun") {
		await setupBunRuntime(
			serverDir,
			serverIndexPath,
			indexContent,
			backendFramework,
		);
	} else if (runtime === "node") {
		await setupNodeRuntime(
			serverDir,
			serverIndexPath,
			indexContent,
			backendFramework,
		);
	}
}

async function setupBunRuntime(
	serverDir: string,
	serverIndexPath: string,
	indexContent: string,
	backendFramework: ProjectBackend,
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

	if (backendFramework === "hono") {
		const updatedContent = `${indexContent}\n\nexport default app;\n`;
		await fs.writeFile(serverIndexPath, updatedContent);
	}
}

async function setupNodeRuntime(
	serverDir: string,
	serverIndexPath: string,
	indexContent: string,
	backendFramework: ProjectBackend,
): Promise<void> {
	const packageJsonPath = path.join(serverDir, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);

	packageJson.scripts = {
		...packageJson.scripts,
		dev: "tsx watch src/index.ts",
		start: "node dist/src/index.js",
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	addPackageDependency({
		devDependencies: ["tsx", "@types/node"],
		projectDir: serverDir,
	});

	if (backendFramework === "hono") {
		addPackageDependency({
			dependencies: ["@hono/node-server"],
			projectDir: serverDir,
		});

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

			const updatedContent =
				importSection + importLine + restOfFile + serverCode;
			await fs.writeFile(serverIndexPath, updatedContent);
		}
	} else if (backendFramework === "elysia") {
		addPackageDependency({
			dependencies: ["@elysiajs/node"],
			projectDir: serverDir,
		});

		if (!indexContent.includes("@elysiajs/node")) {
			const nodeImport = 'import { node } from "@elysiajs/node";\n';

			const firstImportEnd = indexContent.indexOf(
				"\n",
				indexContent.indexOf("import"),
			);
			const before = indexContent.substring(0, firstImportEnd + 1);
			const after = indexContent.substring(firstImportEnd + 1);

			let updatedContent = before + nodeImport + after;

			updatedContent = updatedContent.replace(
				/const app = new Elysia\([^)]*\)/,
				"const app = new Elysia({ adapter: node() })",
			);

			await fs.writeFile(serverIndexPath, updatedContent);
		}
	}
}
