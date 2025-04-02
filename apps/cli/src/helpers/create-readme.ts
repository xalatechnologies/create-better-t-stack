import path from "node:path";
import fs from "fs-extra";
import type {
	ProjectAddons,
	ProjectConfig,
	ProjectDatabase,
	ProjectFrontend,
	ProjectOrm,
	ProjectRuntime,
} from "../types";

export async function createReadme(projectDir: string, options: ProjectConfig) {
	const readmePath = path.join(projectDir, "README.md");
	const content = generateReadmeContent(options);

	try {
		await fs.writeFile(readmePath, content);
	} catch (error) {
		console.error("Failed to create README.md file:", error);
	}
}

function generateReadmeContent(options: ProjectConfig): string {
	const {
		projectName,
		packageManager,
		database,
		auth,
		addons = [],
		orm = "drizzle",
		runtime = "bun",
		frontend = ["tanstack-router"],
	} = options;

	const hasReactRouter = frontend.includes("react-router");
	const hasTanstackRouter = frontend.includes("tanstack-router");
	const hasNative = frontend.includes("native");

	const packageManagerRunCmd =
		packageManager === "npm" ? "npm run" : packageManager;

	const port = hasReactRouter ? "5173" : "3001";

	return `# ${projectName}

This project was created with [Better-T-Stack](https://github.com/better-t-stack/Better-T-Stack), a modern TypeScript stack that combines React, ${hasTanstackRouter ? "TanStack Router" : "React Router"}, Hono, tRPC, and more.

## Features

${generateFeaturesList(database, auth, addons, orm, runtime, frontend)}

## Getting Started

First, install the dependencies:

\`\`\`bash
${packageManager} install
\`\`\`

${generateDatabaseSetup(database, auth, packageManagerRunCmd, orm)}

Then, run the development server:

\`\`\`bash
${packageManagerRunCmd} dev
\`\`\`

${
	hasTanstackRouter || hasReactRouter
		? `Open [http://localhost:${port}](http://localhost:${port}) in your browser to see the web application.`
		: ""
}
${hasNative ? "Use the Expo Go app to run the mobile application.\n" : ""}
The API is running at [http://localhost:3000](http://localhost:3000).

${
	addons.includes("pwa") && hasReactRouter
		? "\n## PWA Support with React Router v7\n\nThere is a known compatibility issue between VitePWA and React Router v7.\nSee: https://github.com/vite-pwa/vite-plugin-pwa/issues/809\n\nIf you encounter problems with the PWA functionality, you may need to manually modify\nthe service worker registration or consider waiting for a fix from VitePWA.\n"
		: ""
}

## Project Structure

\`\`\`
${projectName}/
├── apps/
${hasTanstackRouter || hasReactRouter ? `│   ├── web/         # Frontend application (React, ${hasTanstackRouter ? "TanStack Router" : "React Router"})\n` : ""}${hasNative ? "│   ├── native/      # Mobile application (React Native, Expo)\n" : ""}│   └── server/      # Backend API (Hono, tRPC)
\`\`\`

## Available Scripts

${generateScriptsList(packageManagerRunCmd, database, orm, auth, hasNative)}
`;
}

function generateFeaturesList(
	database: ProjectDatabase,
	auth: boolean,
	addons: ProjectAddons[],
	orm: ProjectOrm,
	runtime: ProjectRuntime,
	frontend: ProjectFrontend[],
): string {
	const hasTanstackRouter = frontend.includes("tanstack-router");
	const hasReactRouter = frontend.includes("react-router");
	const hasNative = frontend.includes("native");

	const addonsList = [
		"- **TypeScript** - For type safety and improved developer experience",
	];

	if (hasTanstackRouter) {
		addonsList.push(
			"- **TanStack Router** - File-based routing with full type safety",
		);
	} else if (hasReactRouter) {
		addonsList.push("- **React Router** - Declarative routing for React");
	}

	if (hasNative) {
		addonsList.push("- **React Native** - Build mobile apps using React");
		addonsList.push("- **Expo** - Tools for React Native development");
	}

	addonsList.push(
		"- **TailwindCSS** - Utility-first CSS for rapid UI development",
		"- **shadcn/ui** - Reusable UI components",
		"- **Hono** - Lightweight, performant server framework",
		"- **tRPC** - End-to-end type-safe APIs",
		`- **${runtime === "bun" ? "Bun" : "Node.js"}** - Runtime environment`,
	);

	if (database !== "none") {
		addonsList.push(
			`- **${orm === "drizzle" ? "Drizzle" : "Prisma"}** - TypeScript-first ORM`,
			`- **${database === "sqlite" ? "SQLite/Turso" : "PostgreSQL"}** - Database engine`,
		);
	}

	if (auth) {
		addonsList.push(
			"- **Authentication** - Email & password authentication with Better Auth",
		);
	}

	for (const addon of addons) {
		if (addon === "pwa") {
			addonsList.push("- **PWA** - Progressive Web App support");
		} else if (addon === "tauri") {
			addonsList.push("- **Tauri** - Build native desktop applications");
		} else if (addon === "biome") {
			addonsList.push("- **Biome** - Linting and formatting");
		} else if (addon === "husky") {
			addonsList.push("- **Husky** - Git hooks for code quality");
		}
	}

	return addonsList.join("\n");
}

function generateDatabaseSetup(
	database: ProjectDatabase,
	auth: boolean,
	packageManagerRunCmd: string,
	orm: ProjectOrm,
): string {
	if (database === "none") {
		return "";
	}

	let setup = "## Database Setup\n\n";

	if (database === "sqlite") {
		setup += `This project uses SQLite${orm === "drizzle" ? " with Drizzle ORM" : " with Prisma"}.

1. Start the local SQLite database:
\`\`\`bash
cd apps/server && ${packageManagerRunCmd} db:local
\`\`\`

2. Update your \`.env\` file in the \`apps/server\` directory with the appropriate connection details if needed.
`;
	} else if (database === "postgres") {
		setup += `This project uses PostgreSQL${orm === "drizzle" ? " with Drizzle ORM" : " with Prisma"}.

1. Make sure you have a PostgreSQL database set up.
2. Update your \`apps/server/.env\` file with your PostgreSQL connection details.
`;
	}

	setup += `
${auth ? "4" : "3"}. ${
		orm === "prisma"
			? `Generate the Prisma client and push the schema:
\`\`\`bash
${packageManagerRunCmd} db:push
\`\`\``
			: `Apply the schema to your database:
\`\`\`bash
${packageManagerRunCmd} db:push
\`\`\``
	}
`;

	return setup;
}

function generateScriptsList(
	packageManagerRunCmd: string,
	database: ProjectDatabase,
	orm: ProjectOrm,
	auth: boolean,
	hasNative: boolean,
): string {
	let scripts = `- \`${packageManagerRunCmd} dev\`: Start both web and server in development mode
- \`${packageManagerRunCmd} build\`: Build both web and server
- \`${packageManagerRunCmd} dev:web\`: Start only the web application
- \`${packageManagerRunCmd} dev:server\`: Start only the server
- \`${packageManagerRunCmd} check-types\`: Check TypeScript types across all apps`;

	if (hasNative) {
		scripts += `
- \`${packageManagerRunCmd} dev:native\`: Start the React Native/Expo development server`;
	}

	if (database !== "none") {
		scripts += `
- \`${packageManagerRunCmd} db:push\`: Push schema changes to database
- \`${packageManagerRunCmd} db:studio\`: Open database studio UI`;

		if (database === "sqlite" && orm === "drizzle") {
			scripts += `\n- \`cd apps/server && ${packageManagerRunCmd} db:local\`: Start the local SQLite database`;
		}
	}

	return scripts;
}
