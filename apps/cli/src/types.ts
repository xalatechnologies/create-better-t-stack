export type ProjectFeature = "docker" | "github-actions" | "SEO";

export type ProjectDatabase = "sqlite" | "postgres";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export type ProjectORM = "drizzle" | "prisma";

export type ProjectConfig = {
	yes?: boolean;
	projectName: string;
	git: boolean;
	database: ProjectDatabase;
	auth: boolean;
	packageManager: PackageManager;
	features: ProjectFeature[];
	orm: ProjectORM;
};
