import path from "node:path";
import {
	cancel,
	intro,
	isCancel,
	log,
	outro,
	select,
	spinner,
} from "@clack/prompts";
import { consola } from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import { parseCliArguments } from "./cli";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/project-generation/create-project";
import { gatherConfig } from "./prompts/config-prompts";
import { getProjectName } from "./prompts/project-name";
import type { ProjectConfig } from "./types";
import { trackProjectCreation } from "./utils/analytics";
import { displayConfig } from "./utils/display-config";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { renderTitle } from "./utils/render-title";
import { processAndValidateFlags } from "./validation";

const exit = () => process.exit(0);
process.on("SIGINT", exit);
process.on("SIGTERM", exit);

async function main() {
	const startTime = Date.now();

	try {
		const options = await parseCliArguments();
		const cliProjectNameArg = options.projectDirectory;

		renderTitle();
		intro(pc.magenta("Creating a new Better-T-Stack project"));

		let currentPathInput: string;
		let finalPathInput: string;
		let finalResolvedPath: string;
		let finalBaseName: string;
		let shouldClearDirectory = false;

		if (options.yes && cliProjectNameArg) {
			currentPathInput = cliProjectNameArg;
		} else if (options.yes) {
			let defaultName = DEFAULT_CONFIG.relativePath;
			let counter = 1;
			while (
				fs.pathExistsSync(path.resolve(process.cwd(), defaultName)) &&
				fs.readdirSync(path.resolve(process.cwd(), defaultName)).length > 0
			) {
				defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
				counter++;
			}
			currentPathInput = defaultName;
		} else {
			currentPathInput = await getProjectName(cliProjectNameArg);
		}

		while (true) {
			const resolvedPath = path.resolve(process.cwd(), currentPathInput);
			const dirExists = fs.pathExistsSync(resolvedPath);
			const dirIsNotEmpty =
				dirExists && fs.readdirSync(resolvedPath).length > 0;

			if (!dirIsNotEmpty) {
				finalPathInput = currentPathInput;
				shouldClearDirectory = false;
				break;
			}

			log.warn(
				`Directory "${pc.yellow(
					currentPathInput,
				)}" already exists and is not empty.`,
			);

			const action = await select<"overwrite" | "merge" | "rename" | "cancel">({
				message: "What would you like to do?",
				options: [
					{
						value: "overwrite",
						label: "Overwrite",
						hint: "Empty the directory and create the project",
					},
					{
						value: "merge",
						label: "Merge",
						hint: "Create project files inside, potentially overwriting conflicts",
					},
					{
						value: "rename",
						label: "Choose a different name/path",
						hint: "Keep the existing directory and create a new one",
					},
					{ value: "cancel", label: "Cancel", hint: "Abort the process" },
				],
				initialValue: "rename",
			});

			if (isCancel(action)) {
				cancel(pc.red("Operation cancelled."));
				process.exit(0);
			}

			if (action === "overwrite") {
				finalPathInput = currentPathInput;
				shouldClearDirectory = true;
				break;
			}
			if (action === "merge") {
				finalPathInput = currentPathInput;
				shouldClearDirectory = false;
				log.info(
					`Proceeding into existing directory "${pc.yellow(
						currentPathInput,
					)}". Files may be overwritten.`,
				);
				break;
			}
			if (action === "rename") {
				log.info("Please choose a different project name or path.");
				currentPathInput = await getProjectName(undefined);
			} else if (action === "cancel") {
				cancel(pc.red("Operation cancelled."));
				process.exit(0);
			}
		}

		if (finalPathInput === ".") {
			finalResolvedPath = process.cwd();
			finalBaseName = path.basename(finalResolvedPath);
		} else {
			finalResolvedPath = path.resolve(process.cwd(), finalPathInput);
			finalBaseName = path.basename(finalResolvedPath);
		}

		if (shouldClearDirectory) {
			const s = spinner();
			s.start(`Clearing directory "${finalResolvedPath}"...`);
			try {
				await fs.emptyDir(finalResolvedPath);
				s.stop(`Directory "${finalResolvedPath}" cleared.`);
			} catch (error) {
				s.stop(pc.red(`Failed to clear directory "${finalResolvedPath}".`));
				consola.error(error);
				process.exit(1);
			}
		} else {
			await fs.ensureDir(finalResolvedPath);
		}

		const flagConfig = processAndValidateFlags(options, finalBaseName);
		const { projectName: _projectNameFromFlags, ...otherFlags } = flagConfig;

		if (!options.yes && Object.keys(otherFlags).length > 0) {
			log.info(pc.yellow("Using these pre-selected options:"));
			log.message(displayConfig(otherFlags));
			log.message("");
		}

		let config: ProjectConfig;
		if (options.yes) {
			config = {
				...DEFAULT_CONFIG,
				...flagConfig,
				projectName: finalBaseName,
				projectDir: finalResolvedPath,
				relativePath: finalPathInput,
			};

			if (config.backend === "convex") {
				log.info(
					"Due to '--backend convex' flag, the following options have been automatically set: auth=false, database=none, orm=none, api=none, runtime=none, dbSetup=none, examples=todo",
				);
			} else if (config.backend === "none") {
				log.info(
					"Due to '--backend none', the following options have been automatically set: --auth=false, --database=none, --orm=none, --api=none, --runtime=none, --db-setup=none, --examples=none",
				);
			}

			log.info(
				pc.yellow("Using default/flag options (config prompts skipped):"),
			);
			log.message(displayConfig(config));
			log.message("");
		} else {
			config = await gatherConfig(
				flagConfig,
				finalBaseName,
				finalResolvedPath,
				finalPathInput,
			);
		}

		await createProject(config);

		await trackProjectCreation(config);

		const reproducibleCommand = generateReproducibleCommand(config);

		log.success(
			pc.blue(
				`You can reproduce this setup with the following command:\n${reproducibleCommand}`,
			),
		);

		const elapsedTimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
		outro(
			pc.magenta(
				`Project created successfully in ${pc.bold(
					elapsedTimeInSeconds,
				)} seconds!`,
			),
		);
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === "YError") {
				cancel(pc.red(`Invalid arguments: ${error.message}`));
			} else {
				consola.error(`An unexpected error occurred: ${error.message}`);
				if (!error.message.includes("is only supported with")) {
					consola.error(error.stack);
				}
			}
			process.exit(1);
		} else {
			consola.error("An unexpected error occurred.");
			console.error(error);
			process.exit(1);
		}
	}
}

main().catch((err) => {
	consola.error("Aborting installation due to unexpected error...");
	if (err instanceof Error) {
		if (
			!err.message.includes("is only supported with") &&
			!err.message.includes("incompatible with") &&
			!err.message.includes("requires") &&
			!err.message.includes("Cannot use") &&
			!err.message.includes("Cannot select multiple") &&
			!err.message.includes("Cannot combine") &&
			!err.message.includes("not supported")
		) {
			consola.error(err.message);
			consola.error(err.stack);
		}
	} else {
		console.error(err);
	}
	process.exit(1);
});
