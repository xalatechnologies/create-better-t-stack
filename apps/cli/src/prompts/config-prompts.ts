import { cancel, group } from "@clack/prompts";
import pc from "picocolors";
import type {
	PackageManager,
	ProjectAddons,
	ProjectConfig,
	ProjectDatabase,
	ProjectOrm,
} from "../types";
import { getAddonsChoice } from "./addons";
import { getAuthChoice } from "./auth";
import { getDatabaseChoice } from "./database";
import { getGitChoice } from "./git";
import { getNoInstallChoice } from "./install";
import { getORMChoice } from "./orm";
import { getPackageManagerChoice } from "./package-manager";
import { getProjectName } from "./project-name";
import { getTursoSetupChoice } from "./turso";

interface PromptGroupResults {
	projectName: string;
	database: ProjectDatabase;
	orm: ProjectOrm;
	auth: boolean;
	addons: ProjectAddons[];
	git: boolean;
	packageManager: PackageManager;
	noInstall: boolean;
	turso: boolean;
}

export async function gatherConfig(
	flags: Partial<ProjectConfig>,
): Promise<ProjectConfig> {
	const result = await group<PromptGroupResults>(
		{
			projectName: async () => {
				return getProjectName(flags.projectName);
			},
			database: () => getDatabaseChoice(flags.database),
			orm: ({ results }) =>
				getORMChoice(flags.orm, results.database !== "none"),
			auth: ({ results }) =>
				getAuthChoice(flags.auth, results.database !== "none"),
			turso: ({ results }) =>
				results.database === "sqlite" && results.orm !== "prisma"
					? getTursoSetupChoice(flags.turso)
					: Promise.resolve(false),
			addons: () => getAddonsChoice(flags.addons),
			git: () => getGitChoice(flags.git),
			packageManager: () => getPackageManagerChoice(flags.packageManager),
			noInstall: () => getNoInstallChoice(flags.noInstall),
		},
		{
			onCancel: () => {
				cancel(pc.red("Operation cancelled"));
				process.exit(0);
			},
		},
	);

	return {
		projectName: result.projectName,
		database: result.database,
		orm: result.orm,
		auth: result.auth,
		addons: result.addons,
		git: result.git,
		packageManager: result.packageManager,
		noInstall: result.noInstall,
		turso: result.turso,
	};
}
