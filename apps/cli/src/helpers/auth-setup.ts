import path from "node:path";
import consola from "consola";
import pc from "picocolors";
import type { ProjectFrontend } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export function generateAuthSecret(length = 32): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

import type { ProjectConfig } from "../types";

export async function setupAuth(config: ProjectConfig): Promise<void> {
	const { projectName, auth, frontend } = config;
	if (!auth) {
		return;
	}

	const projectDir = path.resolve(process.cwd(), projectName);
	const serverDir = path.join(projectDir, "apps/server");
	const clientDir = path.join(projectDir, "apps/web");
	const nativeDir = path.join(projectDir, "apps/native");

	try {
		await addPackageDependency({
			dependencies: ["better-auth"],
			projectDir: serverDir,
		});
		if (
			frontend.includes("react-router") ||
			frontend.includes("tanstack-router") ||
			frontend.includes("tanstack-start")
		) {
			await addPackageDependency({
				dependencies: ["better-auth"],
				projectDir: clientDir,
			});
		}
		if (frontend.includes("native")) {
			await addPackageDependency({
				dependencies: ["better-auth", "@better-auth/expo"],
				projectDir: nativeDir,
			});
			await addPackageDependency({
				dependencies: ["@better-auth/expo"],
				projectDir: serverDir,
			});
		}
	} catch (error) {
		consola.error(pc.red("Failed to configure authentication"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
		throw error;
	}
}
