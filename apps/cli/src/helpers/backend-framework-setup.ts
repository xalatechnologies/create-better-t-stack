import path from "node:path";
import type { AvailableDependencies } from "../constants";
import type { ProjectBackend, ProjectRuntime } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupBackendDependencies(
	projectDir: string,
	framework: ProjectBackend,
	runtime: ProjectRuntime,
): Promise<void> {
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
	}

	if (runtime === "bun") {
		devDependencies.push("@types/bun");
	}

	addPackageDependency({
		dependencies,
		devDependencies,
		projectDir: serverDir,
	});
}
