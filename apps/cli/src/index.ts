import { cancel, intro, log, outro, spinner } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/create-project";
import { installDependencies } from "./helpers/install-dependencies";
import { gatherConfig } from "./prompts/config-prompts";
import type {
	ProjectAddons,
	ProjectConfig,
	ProjectExamples,
	ProjectFrontend,
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
		.option("--database <type>", "Database type (none, sqlite, postgres)")
		.option("--orm <type>", "ORM type (none, drizzle, prisma)")
		.option("--auth", "Include authentication")
		.option("--no-auth", "Exclude authentication")
		.option(
			"--frontend <types>",
			"Frontend types (web,native or both)",
			(val) => val.split(",") as ProjectFrontend[],
		)
		.option(
			"--addons <types>",
			"Additional addons (pwa,tauri,biome,husky)",
			(val) => val.split(",") as ProjectAddons[],
		)
		.option("--no-addons", "Skip all additional addons")
		.option(
			"--examples <types>",
			"Examples to include (todo,ai)",
			(val) => val.split(",") as ProjectExamples[],
		)
		.option("--no-examples", "Skip all examples")
		.option("--git", "Initialize git repository")
		.option("--no-git", "Skip git initialization")
		.option("--package-manager <pm>", "Package manager (npm, pnpm, bun)")
		.option("--install", "Install dependencies")
		.option("--no-install", "Skip installing dependencies")
		.option("--turso", "Set up Turso for SQLite database")
		.option("--no-turso", "Skip Turso setup")
		.option("--backend <framework>", "Backend framework (hono, elysia)")
		.option("--runtime <runtime>", "Runtime (bun, node)")
		.parse();

	const s = spinner();

	try {
		renderTitle();
		intro(pc.magenta("Creating a new Better-T-Stack project"));

		const options = program.opts();
		const projectDirectory = program.args[0];

		if (
			options.database &&
			!["none", "sqlite", "postgres"].includes(options.database)
		) {
			cancel(
				pc.red(
					`Invalid database type: ${options.database}. Must be none, sqlite, or postgres.`,
				),
			);
			process.exit(1);
		}

		if (options.orm && !["none", "drizzle", "prisma"].includes(options.orm)) {
			cancel(
				pc.red(
					`Invalid ORM type: ${options.orm}. Must be none, drizzle, or prisma.`,
				),
			);
			process.exit(1);
		}

		if (
			options.packageManager &&
			!["npm", "pnpm", "bun"].includes(options.packageManager)
		) {
			cancel(
				pc.red(
					`Invalid package manager: ${options.packageManager}. Must be npm, pnpm, or bun.`,
				),
			);
			process.exit(1);
		}

		if (options.backend && !["hono", "elysia"].includes(options.backend)) {
			cancel(
				pc.red(
					`Invalid backend framework: ${options.backend}. Must be hono or elysia.`,
				),
			);
			process.exit(1);
		}

		if (options.runtime && !["bun", "node"].includes(options.runtime)) {
			cancel(
				pc.red(`Invalid runtime: ${options.runtime}. Must be bun or node.`),
			);
			process.exit(1);
		}

		if (options.examples && options.examples.length > 0) {
			const validExamples = ["todo", "ai"];
			const invalidExamples = options.examples.filter(
				(example: ProjectExamples) => !validExamples.includes(example),
			);

			if (invalidExamples.length > 0) {
				cancel(
					pc.red(
						`Invalid example(s): ${invalidExamples.join(", ")}. Valid options are: ${validExamples.join(", ")}.`,
					),
				);
				process.exit(1);
			}
		}

		const flagConfig: Partial<ProjectConfig> = {
			...(projectDirectory && { projectName: projectDirectory }),
			...(options.database && { database: options.database }),
			...(options.orm && { orm: options.orm }),
			...("auth" in options && { auth: options.auth }),
			...(options.packageManager && { packageManager: options.packageManager }),
			...("git" in options && { git: options.git }),
			...("install" in options && { noInstall: !options.install }),
			...("turso" in options && { turso: options.turso }),
			...(options.backend && { backend: options.backend }),
			...(options.runtime && { runtime: options.runtime }),
			...(options.frontend && { frontend: options.frontend }),
			...((options.addons || options.addons === false) && {
				addons: options.addons === false ? [] : options.addons,
			}),
			...((options.examples || options.examples === false) && {
				examples: options.examples === false ? [] : options.examples,
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
					...flagConfig,
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
