import path from "node:path";
import type { ProjectConfig } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupExamples(config: ProjectConfig): Promise<void> {
	const { projectName, examples } = config;
	const projectDir = path.resolve(process.cwd(), projectName);

	if (examples.includes("ai")) {
		const clientDir = path.join(projectDir, "apps/web");
		await addPackageDependency({
			dependencies: ["ai"],
			projectDir: clientDir,
		});
		const serverDir = path.join(projectDir, "apps/server");
		await addPackageDependency({
			dependencies: ["ai", "@ai-sdk/google"],
			projectDir: serverDir,
		});
	}
}
