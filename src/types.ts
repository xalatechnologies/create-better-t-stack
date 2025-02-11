export interface ProjectOptions {
  projectName: string;
  typescript: boolean;
  git: boolean;
  database: "libsql" | "postgres";
  auth: boolean;
  features: string[];
}
