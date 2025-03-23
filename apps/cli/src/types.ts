export type ProjectDatabase = "sqlite" | "postgres" | "none";
export type ProjectOrm = "drizzle" | "prisma" | "none";
export type PackageManager = "npm" | "pnpm" | "bun";
export type ProjectAddons = "pwa" | "tauri" | "biome" | "husky";
export type ProjectExamples = "todo";

export interface ProjectConfig {
	projectName: string;
	database: ProjectDatabase;
	orm: ProjectOrm;
	auth: boolean;
	addons: ProjectAddons[];
	examples: ProjectExamples[];
	git: boolean;
	packageManager: PackageManager;
	noInstall?: boolean;
	turso?: boolean;
}
