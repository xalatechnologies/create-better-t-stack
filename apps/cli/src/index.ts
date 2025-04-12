import { cancel, intro, log, outro, spinner } from "@clack/prompts";
import pc from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/create-project";
import { gatherConfig } from "./prompts/config-prompts";
import type {
	ProjectAddons,
	ProjectBackend,
	ProjectConfig,
	ProjectDBSetup,
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

type YargsArgv = {
	projectDirectory?: string;

	yes?: boolean;
	database?: ProjectDatabase;
	orm?: ProjectOrm;
	auth?: boolean;
	frontend?: ProjectFrontend[];
	addons?: ProjectAddons[];
	examples?: ProjectExamples[];
	git?: boolean;
	packageManager?: ProjectPackageManager;
	install?: boolean;
	dbSetup?: ProjectDBSetup;
	backend?: ProjectBackend;
	runtime?: ProjectRuntime;

	_: (string | number)[];
	$0: string;
};

const exit = () => process.exit(0);
process.on("SIGINT", exit);
process.on("SIGTERM", exit);

async function main() {
	const startTime = Date.now();
	const s = spinner();

	try {
		const argv = await yargs(hideBin(process.argv))
			.scriptName("create-better-t-stack")
			.usage(
				"$0 [project-directory] [options]",
				"Create a new Better-T Stack project",
			)
			.positional("project-directory", {
				describe: "Project name/directory",
				type: "string",
			})
			.option("yes", {
				alias: "y",
				type: "boolean",
				describe: "Use default configuration and skip prompts",
				default: false,
			})
			.option("database", {
				type: "string",
				describe: "Database type",
				choices: ["none", "sqlite", "postgres", "mysql", "mongodb"],
			})
			.option("orm", {
				type: "string",
				describe: "ORM type",
				choices: ["drizzle", "prisma", "none"],
			})
			.option("auth", {
				type: "boolean",
				describe: "Include authentication",
			})
			.option("frontend", {
				type: "array",
				string: true,
				describe: "Frontend types",
				choices: [
					"tanstack-router",
					"react-router",
					"tanstack-start",
					"native",
					"none",
				],
			})
			.option("addons", {
				type: "array",
				string: true,
				describe: "Additional addons",
				choices: ["pwa", "tauri", "starlight", "biome", "husky", "none"],
			})
			.option("examples", {
				type: "array",
				string: true,
				describe: "Examples to include",
				choices: ["todo", "ai", "none"],
			})
			.option("git", {
				type: "boolean",
				describe: "Initialize git repository",
			})
			.option("package-manager", {
				alias: "pm",
				type: "string",
				describe: "Package manager",
				choices: ["npm", "pnpm", "bun"],
			})
			.option("install", {
				type: "boolean",
				describe: "Install dependencies (use --no-install to explicitly skip)",
			})
			.option("db-setup", {
				type: "string",
				describe: "Database setup",
				choices: ["turso", "neon", "prisma-postgres", "mongodb-atlas", "none"],
			})
			.option("backend", {
				type: "string",
				describe: "Backend framework",
				choices: ["hono", "express", "elysia"],
			})
			.option("runtime", {
				type: "string",
				describe: "Runtime",
				choices: ["bun", "node"],
			})
			.completion()
			.recommendCommands()
			.version(getLatestCLIVersion())
			.alias("version", "v")
			.help()
			.alias("help", "h")
			.strict()
			.wrap(null)
			.parse();

		renderTitle();
		intro(pc.magenta("Creating a new Better-T-Stack project"));

		const options = argv as YargsArgv;
		const projectDirectory = options.projectDirectory;

		const flagConfig = processAndValidateFlags(options, projectDirectory);

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
			`You can reproduce this setup with the following command:\n${pc.white(
				generateReproducibleCommand(config),
			)}`,
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
			if (error.name === "YError") {
				cancel(pc.red(`Invalid arguments: ${error.message}`));
			} else {
				cancel(pc.red(`An unexpected error occurred: ${error.message}`));
			}
			process.exit(1);
		} else {
			cancel(pc.red("An unexpected error occurred."));
			console.error(error);
			process.exit(1);
		}
	}
}

function processAndValidateFlags(
	options: YargsArgv,
	projectDirectory?: string,
): Partial<ProjectConfig> {
	const config: Partial<ProjectConfig> = {};

	if (options.database) {
		config.database = options.database as ProjectDatabase;
	}

	if (options.orm) {
		if (options.orm === "none") {
			config.orm = "none";
		} else {
			config.orm = options.orm as ProjectOrm;
		}
	}

	if (
		(config.database ?? options.database) === "mongodb" &&
		(config.orm ?? options.orm) === "drizzle"
	) {
		cancel(
			pc.red(
				"MongoDB is only available with Prisma. Cannot use --database mongodb with --orm drizzle",
			),
		);
		process.exit(1);
	}

	if (options.dbSetup) {
		const dbSetup = options.dbSetup as ProjectDBSetup | "none";

		if (dbSetup !== "none") {
			config.dbSetup = dbSetup;

			if (dbSetup === "turso") {
				if (options.database && options.database !== "sqlite") {
					cancel(
						pc.red(
							`Turso setup requires a SQLite database. Cannot use --db-setup turso with --database ${options.database}`,
						),
					);
					process.exit(1);
				}
				config.database = "sqlite";

				if (options.orm === "prisma") {
					cancel(
						pc.red(
							"Turso setup is not compatible with Prisma. Cannot use --db-setup turso with --orm prisma",
						),
					);
					process.exit(1);
				}
				config.orm = "drizzle";
			} else if (dbSetup === "prisma-postgres") {
				if (options.database && options.database !== "postgres") {
					cancel(
						pc.red(
							"Prisma PostgreSQL setup requires PostgreSQL database. Cannot use --db-setup prisma-postgres with a different database type.",
						),
					);
					process.exit(1);
				}
				config.database = "postgres";

				if (options.orm && options.orm !== "prisma" && options.orm !== "none") {
					cancel(
						pc.red(
							"Prisma PostgreSQL setup requires Prisma ORM. Cannot use --db-setup prisma-postgres with a different ORM.",
						),
					);
					process.exit(1);
				}
				config.orm = "prisma";
			} else if (dbSetup === "mongodb-atlas") {
				if (options.database && options.database !== "mongodb") {
					cancel(
						pc.red(
							"MongoDB Atlas setup requires MongoDB database. Cannot use --db-setup mongodb-atlas with a different database type.",
						),
					);
					process.exit(1);
				}
				config.database = "mongodb";
				config.orm = "prisma";
			} else if (dbSetup === "neon") {
				if (options.database && options.database !== "postgres") {
					cancel(
						pc.red(
							"Neon PostgreSQL setup requires PostgreSQL database. Cannot use --db-setup neon with a different database type.",
						),
					);
					process.exit(1);
				}
				config.database = "postgres";
			}
		} else {
			config.dbSetup = "none";
		}
	}

	const effectiveDatabase = config.database ?? options.database;
	if (effectiveDatabase === "none") {
		if (options.auth === true) {
			cancel(
				pc.red(
					"Authentication requires a database. Cannot use --auth with --database none.",
				),
			);
			process.exit(1);
		}

		const effectiveOrm = config.orm ?? options.orm;
		if (effectiveOrm && effectiveOrm !== "none") {
			cancel(
				pc.red(
					`Cannot use ORM with no database. Cannot use --orm ${effectiveOrm} with --database none.`,
				),
			);
			process.exit(1);
		}
		config.orm = "none";

		const effectiveDbSetup = config.dbSetup ?? options.dbSetup;
		if (effectiveDbSetup && effectiveDbSetup !== "none") {
			cancel(
				pc.red(
					`Database setup requires a database. Cannot use --db-setup ${effectiveDbSetup} with --database none.`,
				),
			);
			process.exit(1);
		}
		config.dbSetup = "none";
	}

	if (options.auth !== undefined) {
		config.auth = options.auth;
	}

	if (options.backend) {
		config.backend = options.backend as ProjectBackend;
	}

	if (options.runtime) {
		config.runtime = options.runtime as ProjectRuntime;
	}

	if (options.frontend && options.frontend.length > 0) {
		if (options.frontend.includes("none")) {
			if (options.frontend.length > 1) {
				cancel(pc.red(`Cannot combine 'none' with other frontend options.`));
				process.exit(1);
			}
			config.frontend = [];
		} else {
			const validOptions = options.frontend.filter(
				(f): f is ProjectFrontend => f !== "none",
			);

			const webFrontends = validOptions.filter(
				(f) =>
					f === "tanstack-router" ||
					f === "react-router" ||
					f === "tanstack-start",
			);

			if (webFrontends.length > 1) {
				cancel(
					pc.red(
						"Cannot select multiple web frameworks. Choose only one of: tanstack-router, tanstack-start, react-router",
					),
				);
				process.exit(1);
			}
			config.frontend = validOptions;
		}
	}

	if (options.addons && options.addons.length > 0) {
		if (options.addons.includes("none")) {
			if (options.addons.length > 1) {
				cancel(pc.red(`Cannot combine 'none' with other addons.`));
				process.exit(1);
			}
			config.addons = [];
		} else {
			const validOptions = options.addons.filter(
				(addon): addon is ProjectAddons => addon !== "none",
			);

			const webSpecificAddons = ["pwa", "tauri"];
			const hasWebSpecificAddons = validOptions.some((addon) =>
				webSpecificAddons.includes(addon),
			);

			const effectiveFrontend =
				config.frontend ?? (options.yes ? DEFAULT_CONFIG.frontend : undefined);

			const hasCompatibleWebFrontend = effectiveFrontend?.some(
				(f) => f === "tanstack-router" || f === "react-router",
			);

			if (hasWebSpecificAddons && !hasCompatibleWebFrontend) {
				if (options.frontend) {
					cancel(
						pc.red(
							"PWA and Tauri addons require tanstack-router or react-router. Cannot use these addons with your frontend selection.",
						),
					);
					process.exit(1);
				} else if (!options.yes) {
				} else {
					cancel(
						pc.red(
							"PWA and Tauri addons require tanstack-router or react-router (default frontend incompatible).",
						),
					);
					process.exit(1);
				}
			}

			if (validOptions.includes("husky") && !validOptions.includes("biome")) {
				validOptions.push("biome");
			}

			config.addons = [...new Set(validOptions)];
		}
	}

	if (options.examples && options.examples.length > 0) {
		if (options.examples.includes("none")) {
			if (options.examples.length > 1) {
				cancel(pc.red("Cannot combine 'none' with other examples."));
				process.exit(1);
			}
			config.examples = [];
		} else {
			const validExamples = options.examples.filter(
				(ex): ex is ProjectExamples => ex !== "none",
			);

			const effectiveBackend = config.backend ?? options.backend;
			if (
				validExamples.includes("ai") &&
				effectiveBackend === "elysia" &&
				!(options.yes && DEFAULT_CONFIG.backend !== "elysia")
			) {
				cancel(
					pc.red(
						"AI example is only compatible with Hono backend. Cannot use --examples ai with --backend elysia",
					),
				);
				process.exit(1);
			}

			const effectiveFrontend =
				config.frontend ??
				(options.frontend?.filter((f) => f !== "none") as ProjectFrontend[]) ??
				(options.yes ? DEFAULT_CONFIG.frontend : undefined);

			const hasWebFrontend = effectiveFrontend?.some((f) =>
				["tanstack-router", "react-router", "tanstack-start"].includes(f),
			);

			if (!hasWebFrontend) {
				if (options.frontend) {
					cancel(
						pc.red(
							"Examples require a web frontend (tanstack-router, react-router, or tanstack-start). Cannot use --examples with your frontend selection.",
						),
					);
					process.exit(1);
				} else if (!options.yes) {
				} else {
					cancel(
						pc.red(
							"Examples require a web frontend (tanstack-router, react-router, or tanstack-start) (default frontend incompatible).",
						),
					);
					process.exit(1);
				}
			}

			config.examples = validExamples;
		}
	}

	if (options.packageManager) {
		config.packageManager = options.packageManager as ProjectPackageManager;
	}

	if (options.git !== undefined) {
		config.git = options.git;
	}

	if (options.install !== undefined) {
		config.noInstall = !options.install;
	}

	if (projectDirectory) {
		config.projectName = projectDirectory;
	}

	return config;
}

main().catch((err) => {
	log.error("Aborting installation due to unexpected error...");
	if (err instanceof Error) {
		log.error(err.message);
		console.error(err.stack);
	} else {
		log.error(
			"An unknown error has occurred. Please open an issue on GitHub with the below:",
		);
		console.error(err);
	}
	process.exit(1);
});
