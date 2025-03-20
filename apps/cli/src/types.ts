export type ProjectDatabase = "sqlite" | "postgres" | "none";
export type ProjectOrm = "drizzle" | "prisma" | "none";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export type ProjectAddons = "docker";

export interface ProjectConfig {
	projectName: string;
	database: ProjectDatabase;
	orm: ProjectOrm;
	auth: boolean;
	addons: ProjectAddons[];
	git: boolean;
	packageManager: PackageManager;
	noInstall?: boolean;
	turso?: boolean;
}
