export type ProjectFeature = "docker" | "github-actions" | "SEO";

export type ProjectDatabase = "libsql" | "postgres";

export type ProjectConfig = {
	yes?: boolean;
	projectName: string;
	git: boolean;
	database: ProjectDatabase;
	auth: boolean;
	packageManager: PackageManager;
	features: ProjectFeature[];
};

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
