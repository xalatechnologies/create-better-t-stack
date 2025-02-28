import { cancel, intro, log, outro, spinner } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/create-project";
import { gatherConfig } from "./prompts/config-prompts";
import type { ProjectConfig, ProjectFeature } from "./types";
import { displayConfig } from "./utils/display-config";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getVersion } from "./utils/get-version";
import { renderTitle } from "./utils/render-title";

process.on("SIGINT", () => {
	log.error(pc.red("Operation cancelled"));
	process.exit(0);
});

const program = new Command();

async function main() {
	const s = spinner();
	try {
		renderTitle();
		intro(pc.magenta("Creating a new Better-T-Stack project"));

		program
			.name("create-better-t-stack")
			.description("Create a new Better-T Stack project")
			.version(getVersion())
			.argument("[project-directory]", "Project name/directory")
			.option("-y, --yes", "Use default configuration")
			.option("--no-database", "Skip database setup")
			.option("--sqlite", "Use SQLite database")
			.option("--postgres", "Use PostgreSQL database")
			.option("--auth", "Include authentication")
			.option("--no-auth", "Exclude authentication")
			.option("--docker", "Include Docker setup")
			.option("--github-actions", "Include GitHub Actions")
			.option("--seo", "Include SEO setup")
			.option("--git", "Include git setup")
			.option("--no-git", "Skip git initialization")
			.option("--npm", "Use npm package manager")
			.option("--pnpm", "Use pnpm package manager")
			.option("--yarn", "Use yarn package manager")
			.option("--bun", "Use bun package manager")
			.option("--drizzle", "Use Drizzle ORM")
			.option("--prisma", "Use Prisma ORM (coming soon)")
			.parse();

		const options = program.opts();
		const projectDirectory = program.args[0];

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
			...(options.yarn && { packageManager: "yarn" }),
			...(options.bun && { packageManager: "bun" }),
			...("git" in options && { git: options.git }),
			...((options.docker || options.githubActions || options.seo) && {
				features: [
					...(options.docker ? ["docker"] : []),
					...(options.githubActions ? ["github-actions"] : []),
					...(options.seo ? ["SEO"] : []),
				] as ProjectFeature[],
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
							: (options.database ?? DEFAULT_CONFIG.database),
					orm:
						options.database === false
							? "none"
							: options.drizzle
								? "drizzle"
								: options.prisma
									? "prisma"
									: DEFAULT_CONFIG.orm,
					auth: options.auth ?? DEFAULT_CONFIG.auth,
					git: options.git ?? DEFAULT_CONFIG.git,
					packageManager:
						flagConfig.packageManager ?? DEFAULT_CONFIG.packageManager,
					features: flagConfig.features?.length
						? flagConfig.features
						: DEFAULT_CONFIG.features,
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

		outro(pc.magenta("Project created successfully!"));
	} catch (error) {
		s.stop(pc.red("Failed"));
		if (error instanceof Error) {
			cancel(pc.red("An unexpected error occurred"));
			process.exit(1);
		}
	}
}

main();
