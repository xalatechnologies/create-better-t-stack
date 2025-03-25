import { cancel, group } from "@clack/prompts";
import pc from "picocolors";
import type {
	BackendFramework,
	PackageManager,
	ProjectAddons,
	ProjectConfig,
	ProjectDatabase,
	ProjectExamples,
	ProjectOrm,
	Runtime,
} from "../types";
import { getAddonsChoice } from "./addons";
import { getAuthChoice } from "./auth";
import { getBackendFrameworkChoice } from "./backend-framework";
import { getDatabaseChoice } from "./database";
import { getExamplesChoice } from "./examples";
import { getGitChoice } from "./git";
import { getNoInstallChoice } from "./install";
import { getORMChoice } from "./orm";
import { getPackageManagerChoice } from "./package-manager";
import { getProjectName } from "./project-name";
import { getRuntimeChoice } from "./runtime";
import { getTursoSetupChoice } from "./turso";

type PromptGroupResults = {
	projectName: string;
	database: ProjectDatabase;
	orm: ProjectOrm;
	auth: boolean;
	addons: ProjectAddons[];
	examples: ProjectExamples[];
	git: boolean;
	packageManager: PackageManager;
	noInstall: boolean;
	turso: boolean;
	backendFramework: BackendFramework;
	runtime: Runtime;
};

export async function gatherConfig(
	flags: Partial<ProjectConfig>,
): Promise<ProjectConfig> {
	const result = await group<PromptGroupResults>(
		{
			projectName: async () => {
				return getProjectName(flags.projectName);
			},
			runtime: () => getRuntimeChoice(flags.runtime),
			backendFramework: () => getBackendFrameworkChoice(flags.backendFramework),
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
			examples: ({ results }) =>
				getExamplesChoice(flags.examples, results.database),
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
		examples: result.examples,
		git: result.git,
		packageManager: result.packageManager,
		noInstall: result.noInstall,
		turso: result.turso,
		backendFramework: result.backendFramework,
		runtime: result.runtime,
	};
}
