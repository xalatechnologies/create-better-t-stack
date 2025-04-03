export type ProjectDatabase = "sqlite" | "postgres" | "none";
export type ProjectOrm = "drizzle" | "prisma" | "none";
export type ProjectPackageManager = "npm" | "pnpm" | "bun";
export type ProjectAddons = "pwa" | "biome" | "tauri" | "husky";
export type ProjectBackend = "hono" | "elysia";
export type ProjectRuntime = "node" | "bun";
export type ProjectExamples = "todo" | "ai";
export type ProjectFrontend = "react-router" | "tanstack-router" | "native";

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
	noInstall?: boolean;
	turso?: boolean;
	prismaPostgres: boolean;
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
	turso?: boolean;
	prismaPostgres?: boolean;
	backend?: string;
	runtime?: string;
};
