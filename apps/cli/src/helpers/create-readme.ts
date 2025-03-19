import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../types";

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
	} = options;

	const packageManagerRunCmd =
		packageManager === "npm" ? "npm run" : packageManager;

	return `# ${projectName}

This project was created with [Better-T-Stack](https://github.com/better-t-stack/Better-T-Stack), a modern TypeScript stack that combines React, TanStack Router, Hono, tRPC, and more.

## Features

${generateFeaturesList(database, auth, addons, orm)}

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

Open [http://localhost:3001](http://localhost:3001) in your browser to see the client application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

\`\`\`
${projectName}/
├── packages/
│   ├── client/         # Frontend application (React, TanStack Router)
│   └── server/         # Backend API (Hono, tRPC)
\`\`\`

## Available Scripts

${generateScriptsList(packageManagerRunCmd, database, orm, auth)}
`;
}

function generateFeaturesList(
	database: string,
	auth: boolean,
	features: string[],
	orm: string,
): string {
	const featuresList = [
		"- **TypeScript** - For type safety and improved developer experience",
		"- **TanStack Router** - File-based routing with full type safety",
		"- **TailwindCSS** - Utility-first CSS for rapid UI development",
		"- **shadcn/ui** - Reusable UI components",
		"- **Hono** - Lightweight, performant server framework",
		"- **tRPC** - End-to-end type-safe APIs",
	];

	if (database !== "none") {
		featuresList.push(
			`- **${orm === "drizzle" ? "Drizzle" : "Prisma"}** - TypeScript-first ORM`,
			`- **${database === "sqlite" ? "SQLite/Turso" : "PostgreSQL"}** - Database engine`,
		);
	}

	if (auth) {
		featuresList.push(
			"- **Authentication** - Email & password authentication with Better Auth",
		);
	}

	for (const feature of features) {
		if (feature === "docker") {
			featuresList.push("- **Docker** - Containerized deployment");
		} else if (feature === "github-actions") {
			featuresList.push("- **GitHub Actions** - CI/CD workflows");
		} else if (feature === "SEO") {
			featuresList.push("- **SEO** - Search engine optimization tools");
		}
	}

	return featuresList.join("\n");
}

function generateDatabaseSetup(
	database: string,
	auth: boolean,
	packageManagerRunCmd: string,
	orm: string,
): string {
	if (database === "none") {
		return "";
	}

	let setup = "## Database Setup\n\n";

	if (database === "sqlite") {
		setup += `This project uses SQLite${orm === "drizzle" ? " with Drizzle ORM" : " with Prisma"}.

1. Start the local SQLite database:
\`\`\`bash
cd packages/server && ${packageManagerRunCmd} db:local
\`\`\`

2. Update your \`.env\` file in the \`packages/server\` directory with the appropriate connection details if needed.
`;
	} else if (database === "postgres") {
		setup += `This project uses PostgreSQL${orm === "drizzle" ? " with Drizzle ORM" : " with Prisma"}.

1. Make sure you have a PostgreSQL database set up.
2. Update your \`packages/server/.env\` file with your PostgreSQL connection details.
`;
	}

	if (auth) {
		setup += `
3. Generate the authentication schema:
\`\`\`bash
cd packages/server && ${packageManagerRunCmd} auth:generate
\`\`\`
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
	database: string,
	orm: string,
	auth: boolean,
): string {
	let scripts = `- \`${packageManagerRunCmd} dev\`: Start both client and server in development mode
- \`${packageManagerRunCmd} build\`: Build both client and server
- \`${packageManagerRunCmd} dev:client\`: Start only the client
- \`${packageManagerRunCmd} dev:server\`: Start only the server
- \`${packageManagerRunCmd} check-types\`: Check TypeScript types across all packages`;

	if (database !== "none") {
		scripts += `
- \`${packageManagerRunCmd} db:push\`: Push schema changes to database
- \`${packageManagerRunCmd} db:studio\`: Open database studio UI`;

		if (database === "sqlite" && orm === "drizzle") {
			scripts += `\n- \`cd packages/server && ${packageManagerRunCmd} db:local\`: Start the local SQLite database`;
		}
	}

	if (auth) {
		scripts += `\n- \`cd packages/server && ${packageManagerRunCmd} auth:generate\`: Generate authentication schema`;
	}

	return scripts;
}
