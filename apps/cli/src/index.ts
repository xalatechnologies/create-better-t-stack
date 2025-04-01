import { cancel, intro, log, outro, spinner } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/create-project";
import { gatherConfig } from "./prompts/config-prompts";
import type {
	CLIOptions,
	ProjectAddons,
	ProjectBackend,
	ProjectConfig,
	ProjectDatabase,
	ProjectExamples,
	ProjectFrontend,
	ProjectOrm,
	ProjectPackageManager,
	ProjectRuntime,
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
		.option("--frontend <types...>", "Frontend types (web, native, none)")
		.option(
			"--addons <types...>",
			"Additional addons (pwa, tauri, biome, husky)",
		)
		.option("--no-addons", "Skip all additional addons")
		.option("--examples <types...>", "Examples to include (todo, ai)")
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

		const options = program.opts() as CLIOptions;
		const projectDirectory = program.args[0];

		validateOptions(options);

		const flagConfig = processFlags(options, projectDirectory);

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

		await createProject(config);

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

function validateOptions(options: CLIOptions): void {
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

	if (options.database === "none") {
		if (options.auth === true) {
			cancel(
				pc.red(
					"Authentication requires a database. Cannot use --auth with --database none.",
				),
			);
			process.exit(1);
		}

		if (options.orm && options.orm !== "none") {
			cancel(
				pc.red(
					`Cannot use ORM with no database. Cannot use --orm ${options.orm} with --database none.`,
				),
			);
			process.exit(1);
		}

		if ("turso" in options && options.turso === true) {
			cancel(
				pc.red(
					"Turso setup requires a SQLite database. Cannot use --turso with --database none.",
				),
			);
			process.exit(1);
		}
	}

	if (
		"turso" in options &&
		options.turso === true &&
		options.database &&
		options.database !== "sqlite"
	) {
		cancel(
			pc.red(
				`Turso setup requires a SQLite database. Cannot use --turso with --database ${options.database}`,
			),
		);
		process.exit(1);
	}

	if (
		"turso" in options &&
		options.turso === true &&
		options.orm === "prisma"
	) {
		cancel(
			pc.red(
				"Turso setup is not compatible with Prisma. Cannot use --turso with --orm prisma",
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
		cancel(pc.red(`Invalid runtime: ${options.runtime}. Must be bun or node.`));
		process.exit(1);
	}

	if (
		options.examples &&
		Array.isArray(options.examples) &&
		options.examples.length > 0
	) {
		const validExamples = ["todo", "ai"];
		const invalidExamples = options.examples.filter(
			(example: string) => !validExamples.includes(example),
		);

		if (invalidExamples.length > 0) {
			cancel(
				pc.red(
					`Invalid example(s): ${invalidExamples.join(", ")}. Valid options are: ${validExamples.join(", ")}.`,
				),
			);
			process.exit(1);
		}

		if (options.examples.includes("ai") && options.backend === "elysia") {
			cancel(
				pc.red(
					"AI example is only compatible with Hono backend. Cannot use --examples ai with --backend elysia",
				),
			);
			process.exit(1);
		}

		if (
			options.frontend &&
			!options.frontend.includes("web") &&
			!options.frontend.includes("none")
		) {
			cancel(
				pc.red(
					"Examples require a web frontend. Cannot use --examples with --frontend native only",
				),
			);
			process.exit(1);
		}
	}

	if (options.frontend && options.frontend.length > 0) {
		const validFrontends = ["web", "native", "none"];
		const invalidFrontends = options.frontend.filter(
			(frontend: string) => !validFrontends.includes(frontend),
		);

		if (invalidFrontends.length > 0) {
			cancel(
				pc.red(
					`Invalid frontend(s): ${invalidFrontends.join(", ")}. Valid options are: ${validFrontends.join(", ")}.`,
				),
			);
			process.exit(1);
		}

		if (options.frontend.includes("none") && options.frontend.length > 1) {
			cancel(pc.red(`Cannot combine 'none' with other frontend options.`));
			process.exit(1);
		}
	}

	if (options.addons && options.addons.length > 0) {
		const validAddons = ["pwa", "tauri", "biome", "husky"];
		const invalidAddons = options.addons.filter(
			(addon: string) => !validAddons.includes(addon),
		);

		if (invalidAddons.length > 0) {
			cancel(
				pc.red(
					`Invalid addon(s): ${invalidAddons.join(", ")}. Valid options are: ${validAddons.join(", ")}.`,
				),
			);
			process.exit(1);
		}

		const webSpecificAddons = ["pwa", "tauri"];
		const hasWebSpecificAddons = options.addons.some((addon) =>
			webSpecificAddons.includes(addon),
		);

		if (
			hasWebSpecificAddons &&
			options.frontend &&
			!options.frontend.includes("web") &&
			!options.frontend.includes("none")
		) {
			cancel(
				pc.red(
					`PWA and Tauri addons require a web frontend. Cannot use --addons ${options.addons
						.filter((a) => webSpecificAddons.includes(a))
						.join(", ")} with --frontend native only`,
				),
			);
			process.exit(1);
		}
	}
}

function processFlags(
	options: CLIOptions,
	projectDirectory?: string,
): Partial<ProjectConfig> {
	let frontend: ProjectFrontend[] | undefined = undefined;
	if (options.frontend) {
		if (options.frontend.includes("none")) {
			frontend = [];
		} else {
			frontend = options.frontend.filter(
				(f): f is ProjectFrontend => f === "web" || f === "native",
			);
		}
	}

	const database = options.database as ProjectDatabase | undefined;
	let orm: ProjectOrm | undefined;
	if (options.orm) {
		orm = options.orm as ProjectOrm;
	}

	let auth: boolean | undefined = "auth" in options ? options.auth : undefined;
	let tursoOption: boolean | undefined =
		"turso" in options ? options.turso : undefined;

	if (database === "none") {
		orm = "none";
		auth = false;
		tursoOption = false;
	}

	let examples: ProjectExamples[] | undefined;
	if ("examples" in options) {
		if (options.examples === false) {
			examples = [];
		} else if (Array.isArray(options.examples)) {
			examples = options.examples.filter(
				(ex): ex is ProjectExamples => ex === "todo" || ex === "ai",
			);

			if (frontend && frontend.length > 0 && !frontend.includes("web")) {
				examples = [];
				log.warn(
					pc.yellow("Examples require web frontend - ignoring examples flag"),
				);
			}

			if (examples.includes("ai") && options.backend === "elysia") {
				examples = examples.filter((ex) => ex !== "ai");
				log.warn(
					pc.yellow(
						"AI example is not compatible with Elysia - removing AI example",
					),
				);
			}
		}
	}

	let addons: ProjectAddons[] | undefined;
	if ("addons" in options) {
		if (options.addons === undefined) {
			addons = [];
		} else if (options.addons) {
			addons = options.addons.filter(
				(addon): addon is ProjectAddons =>
					addon === "pwa" ||
					addon === "tauri" ||
					addon === "biome" ||
					addon === "husky",
			);

			if (frontend && frontend.length > 0 && !frontend.includes("web")) {
				addons = addons.filter((addon) => !["pwa", "tauri"].includes(addon));
				if (addons.length !== options.addons.length) {
					log.warn(
						pc.yellow(
							"PWA and Tauri addons require web frontend - removing these addons",
						),
					);
				}
			}

			if (addons.includes("husky") && !addons.includes("biome")) {
				addons.push("biome");
			}
		}
	}

	const backend = options.backend as ProjectBackend | undefined;
	const runtime = options.runtime as ProjectRuntime | undefined;
	const packageManager = options.packageManager as
		| ProjectPackageManager
		| undefined;

	return {
		...(projectDirectory && { projectName: projectDirectory }),
		...(database !== undefined && { database }),
		...(orm !== undefined && { orm }),
		...(auth !== undefined && { auth }),
		...(packageManager && { packageManager }),
		...("git" in options && { git: options.git }),
		...("install" in options && { noInstall: !options.install }),
		...(tursoOption !== undefined && { turso: tursoOption }),
		...(backend && { backend }),
		...(runtime && { runtime }),
		...(frontend !== undefined && { frontend }),
		...(addons !== undefined && { addons }),
		...(examples !== undefined && { examples }),
	};
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
