export type ProjectFeature = "docker" | "github-actions" | "SEO";
export type ProjectDatabase = "libsql" | "postgres";

export type ProjectOptions = {
  projectName: string;
  git: boolean;
  database: ProjectDatabase;
  auth: boolean;
  features: ProjectFeature[];
};
