import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ProjectConfig } from "./types";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const DEFAULT_CONFIG: ProjectConfig = {
	projectName: "my-better-t-app",
	database: "sqlite",
	auth: true,
	features: [],
	git: true,
	packageManager: "npm",
	orm: "drizzle",
};
