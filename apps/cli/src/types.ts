export type ProjectDatabase =
	| "sqlite"
	| "postgres"
	| "mongodb"
	| "mysql"
	| "none";
export type ProjectOrm = "drizzle" | "prisma" | "none";
export type ProjectPackageManager = "npm" | "pnpm" | "bun";
export type ProjectAddons = "pwa" | "biome" | "tauri" | "husky" | "starlight";
export type ProjectBackend = "hono" | "elysia" | "express";
export type ProjectRuntime = "node" | "bun";
export type ProjectExamples = "todo" | "ai";
export type ProjectFrontend =
	| "react-router"
	| "tanstack-router"
	| "tanstack-start"
	| "native";
export type ProjectDBSetup =
	| "turso"
	| "prisma-postgres"
	| "mongodb-atlas"
	| "neon"
	| "none";

export interface ProjectConfig {
	projectName: string;
	backend: ProjectBackend;
	runtime: ProjectRuntime;
	database: ProjectDatabase;
	orm: ProjectOrm;
	auth: boolean;
	addons: ProjectAddons[];
	examples: ProjectExamples[];
	git: boolean;
	packageManager: ProjectPackageManager;
	noInstall: boolean;
	dbSetup: ProjectDBSetup;
	frontend: ProjectFrontend[];
}

export type CLIOptions = {
	yes?: boolean;
	database?: string;
	orm?: string;
	auth?: boolean;
	frontend?: string[];
	addons?: string[];
	examples?: string[] | boolean;
	git?: boolean;
	packageManager?: string;
	install?: boolean;
	dbSetup?: string;
	backend?: string;
	runtime?: string;
};
