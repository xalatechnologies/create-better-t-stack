import path from "node:path";
import { log } from "@clack/prompts";
import pc from "picocolors";
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

export async function setupAuth(
	projectDir: string,
	enableAuth: boolean,
): Promise<void> {
	const serverDir = path.join(projectDir, "packages/server");
	const clientDir = path.join(projectDir, "packages/client");

	try {
		if (!enableAuth) {
			return;
		}
		addPackageDependency({
			dependencies: ["better-auth"],
			devDependencies: false,
			projectDir: serverDir,
		});
		addPackageDependency({
			dependencies: ["better-auth"],
			devDependencies: false,
			projectDir: clientDir,
		});
	} catch (error) {
		log.error(pc.red("Failed to configure authentication"));
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		throw error;
	}
}
