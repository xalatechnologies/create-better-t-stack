import path from "node:path";
import type { AvailableDependencies } from "../constants";
import type { ProjectBackend, ProjectRuntime } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

import type { ProjectConfig } from "../types";

export async function setupBackendDependencies(
	config: ProjectConfig,
): Promise<void> {
	const { projectName, backend, runtime } = config;
	const projectDir = path.resolve(process.cwd(), projectName);
	const framework = backend;
	const serverDir = path.join(projectDir, "apps/server");

	const dependencies: AvailableDependencies[] = [];
	const devDependencies: AvailableDependencies[] = [];

	if (framework === "hono") {
		dependencies.push("hono", "@hono/trpc-server");

		if (runtime === "node") {
			dependencies.push("@hono/node-server");
			devDependencies.push("tsx", "@types/node");
		}
	} else if (framework === "elysia") {
		dependencies.push("elysia", "@elysiajs/cors", "@elysiajs/trpc");

		if (runtime === "node") {
			dependencies.push("@elysiajs/node");
			devDependencies.push("tsx", "@types/node");
		}
	} else if (framework === "express") {
		dependencies.push("express", "cors");
		devDependencies.push("@types/express", "@types/cors");

		if (runtime === "node") {
			devDependencies.push("tsx", "@types/node");
		}
	}

	if (runtime === "bun") {
		devDependencies.push("@types/bun");
	}

	await addPackageDependency({
		dependencies,
		devDependencies,
		projectDir: serverDir,
	});
}
