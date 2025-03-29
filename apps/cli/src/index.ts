import { cancel, intro, log, outro, spinner } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/create-project";
import { installDependencies } from "./helpers/install-dependencies";
import { gatherConfig } from "./prompts/config-prompts";
import type {
	BackendFramework,
	ProjectAddons,
	ProjectConfig,
	ProjectExamples,
	ProjectFrontend,
	Runtime,
} from "./types";
import { displayConfig } from "./utils/display-config";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { renderTitle } from "./utils/render-title";

process.on("SIGINT", () => {
	log.error(pc.red("Operation cancelled"));
	process.exit(0);
});

const program = new Command();

async function main() {
	const startTime = Date.now();

	program
		.name("create-better-t-stack")
		.description("Create a new Better-T Stack project")
		.version(getLatestCLIVersion())
		.argument("[project-directory]", "Project name/directory")
		.option("-y, --yes", "Use default configuration")
		.option("--no-database", "Skip database setup")
		.option("--sqlite", "Use SQLite database")
		.option("--postgres", "Use PostgreSQL database")
		.option("--auth", "Include authentication")
		.option("--no-auth", "Exclude authentication")
		.option("--pwa", "Include Progressive Web App support")
		.option("--tauri", "Include Tauri desktop app support")
		.option("--biome", "Include Biome for linting and formatting")
		.option("--husky", "Include Husky, lint-staged for Git hooks")
		.option("--no-addons", "Skip all additional addons")
		.option("--examples <examples>", "Include specified examples")
		.option("--no-examples", "Skip all examples")
		.option("--git", "Include git setup")
		.option("--no-git", "Skip git initialization")
		.option("--npm", "Use npm package manager")
		.option("--pnpm", "Use pnpm package manager")
		.option("--bun", "Use bun package manager")
		.option("--drizzle", "Use Drizzle ORM")
		.option("--prisma", "Use Prisma ORM (coming soon)")
		.option("--install", "Install dependencies")
		.option("--no-install", "Skip installing dependencies")
		.option("--turso", "Set up Turso for SQLite database")
		.option("--no-turso", "Skip Turso setup for SQLite database")
		.option("--hono", "Use Hono backend framework")
		.option("--elysia", "Use Elysia backend framework")
		.option("--runtime <runtime>", "Specify runtime (bun or node)")
		.option("--web", "Include web frontend")
		.option("--native", "Include Expo frontend")
		.option("--no-web", "Exclude web frontend")
		.option("--no-native", "Exclude Expo frontend")
		.parse();

	const s = spinner();

	try {
		renderTitle();
		intro(pc.magenta("Creating a new Better-T-Stack project"));

		const options = program.opts();
		const projectDirectory = program.args[0];

		let backendFramework: BackendFramework | undefined;
		if (options.hono) backendFramework = "hono";
		if (options.elysia) backendFramework = "elysia";

		const flagConfig: Partial<ProjectConfig> = {
			...(projectDirectory && { projectName: projectDirectory }),
			...(options.database === false && { database: "none" }),
			...(options.sqlite && { database: "sqlite" }),
			...(options.postgres && { database: "postgres" }),
			...(options.drizzle && { orm: "drizzle" }),
			...(options.prisma && { orm: "prisma" }),
			...("auth" in options && { auth: options.auth }),
			...(options.npm && { packageManager: "npm" }),
			...(options.pnpm && { packageManager: "pnpm" }),
			...(options.bun && { packageManager: "bun" }),
			...("git" in options && { git: options.git }),
			...("install" in options && { noInstall: !options.install }),
			...("turso" in options && { turso: options.turso }),
			...(backendFramework && { backendFramework }),
			...(options.runtime && { runtime: options.runtime as Runtime }),
			...((options.pwa ||
				options.tauri ||
				options.biome ||
				options.husky ||
				options.addons === false) && {
				addons:
					options.addons === false
						? []
						: ([
								...(options.pwa ? ["pwa"] : []),
								...(options.tauri ? ["tauri"] : []),
								...(options.biome ? ["biome"] : []),
								...(options.husky ? ["husky"] : []),
							] as ProjectAddons[]),
			}),
			...((options.examples || options.examples === false) && {
				examples:
					options.examples === false
						? []
						: typeof options.examples === "string"
							? (options.examples
									.split(",")
									.filter((e) => e === "todo") as ProjectExamples[])
							: [],
			}),
			...((options.web !== undefined || options.native !== undefined) && {
				frontend: [
					...(options.web === false ? [] : ["web"]),
					...(options.native === false
						? []
						: options.native === true
							? ["native"]
							: []),
				].filter(Boolean) as ProjectFrontend[],
			}),
		};

		if (!options.yes && Object.keys(flagConfig).length > 0) {
			log.info(pc.yellow("Using these pre-selected options:"));
			log.message(displayConfig(flagConfig));
			log.message("");
		}
		const config = options.yes
			? {
					...DEFAULT_CONFIG,
					projectName: projectDirectory ?? DEFAULT_CONFIG.projectName,
					database:
						options.database === false
							? "none"
							: options.sqlite
								? "sqlite"
								: options.postgres
									? "postgres"
									: DEFAULT_CONFIG.database,
					orm:
						options.database === false
							? "none"
							: options.drizzle
								? "drizzle"
								: options.prisma
									? "prisma"
									: DEFAULT_CONFIG.orm,
					auth: "auth" in options ? options.auth : DEFAULT_CONFIG.auth,
					git: "git" in options ? options.git : DEFAULT_CONFIG.git,
					noInstall:
						"install" in options ? !options.install : DEFAULT_CONFIG.noInstall,
					packageManager:
						flagConfig.packageManager ?? DEFAULT_CONFIG.packageManager,
					addons: flagConfig.addons?.length
						? flagConfig.addons
						: DEFAULT_CONFIG.addons,
					examples: flagConfig.examples?.length
						? flagConfig.examples
						: DEFAULT_CONFIG.examples,
					turso:
						"turso" in options
							? options.turso
							: flagConfig.database === "sqlite"
								? DEFAULT_CONFIG.turso
								: false,
					backendFramework: backendFramework ?? DEFAULT_CONFIG.backendFramework,
					runtime: options.runtime
						? (options.runtime as Runtime)
						: DEFAULT_CONFIG.runtime,
					frontend:
						options.web === false || options.native === true
							? ([
									...(options.web === false ? [] : ["web"]),
									...(options.native ? ["native"] : []),
								] as ProjectFrontend[])
							: DEFAULT_CONFIG.frontend,
				}
			: await gatherConfig(flagConfig);

		if (options.yes) {
			log.info(pc.yellow("Using these default options:"));
			log.message(displayConfig(config));
			log.message("");
		}

		const projectDir = await createProject(config);

		if (!config.noInstall) {
			await installDependencies({
				projectDir,
				packageManager: config.packageManager,
				addons: config.addons,
			});
		}

		log.success(
			pc.blue(
				`You can reproduce this setup with the following command:\n${pc.white(
					generateReproducibleCommand(config),
				)}`,
			),
		);

		const elapsedTimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
		outro(
			pc.magenta(
				`Project created successfully in ${pc.bold(elapsedTimeInSeconds)} seconds!`,
			),
		);
	} catch (error) {
		s.stop(pc.red("Failed"));
		if (error instanceof Error) {
			cancel(pc.red(`An unexpected error occurred: ${error.message}`));
			process.exit(1);
		}
	}
}

main().catch((err) => {
	log.error("Aborting installation...");
	if (err instanceof Error) {
		log.error(err.message);
	} else {
		log.error(
			"An unknown error has occurred. Please open an issue on GitHub with the below:",
		);
		console.log(err);
	}
	process.exit(1);
});
