import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ProjectConfig } from "./types";
import { getUserPkgManager } from "./utils/get-package-manager";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const DEFAULT_CONFIG: ProjectConfig = {
	projectName: "my-better-t-app",
	frontend: ["tanstack-router"],
	database: "sqlite",
	orm: "drizzle",
	auth: true,
	addons: [],
	examples: [],
	git: true,
	packageManager: getUserPkgManager(),
	noInstall: false,
	dbSetup: "none",
	backend: "hono",
	runtime: "bun",
};

export const dependencyVersionMap = {
	"better-auth": "^1.2.4",
	"@better-auth/expo": "^1.2.5",

	"drizzle-orm": "^0.38.4",
	"drizzle-kit": "^0.30.5",

	"@libsql/client": "^0.14.0",
	postgres: "^3.4.5",

	"@prisma/client": "^6.5.0",
	prisma: "^6.5.0",

	"vite-plugin-pwa": "^0.21.2",
	"@vite-pwa/assets-generator": "^0.2.6",

	"@tauri-apps/cli": "^2.4.0",

	"@biomejs/biome": "1.9.4",

	husky: "^9.1.7",
	"lint-staged": "^15.5.0",

	"@hono/node-server": "^1.14.0",
	tsx: "^4.19.2",
	"@types/node": "^22.13.11",

	"@types/bun": "^1.2.6",

	"@elysiajs/node": "^1.2.6",

	"@elysiajs/cors": "^1.2.0",
	"@elysiajs/trpc": "^1.1.0",
	elysia: "^1.2.25",

	"@hono/trpc-server": "^0.3.4",
	hono: "^4.7.5",

	cors: "^2.8.5",
	express: "^5.1.0",
	"@types/express": "^5.0.1",
	"@types/cors": "^2.8.17",

	ai: "^4.2.8",
	"@ai-sdk/google": "^1.2.3",

	"@prisma/extension-accelerate": "^1.3.0",
} as const;

export type AvailableDependencies = keyof typeof dependencyVersionMap;
