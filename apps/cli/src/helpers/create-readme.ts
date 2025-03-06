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

This project was created with [Better-T-Stack](https://github.com/better-t-stack/Better-T-Stack).

## Features

${generateFeaturesList(database, auth, addons, orm)}

## Getting Started

First, install the dependencies:

\`\`\`bash
${packageManager} install
\`\`\`

Then, run the development server:

\`\`\`bash
${packageManagerRunCmd} dev
\`\`\`

Open [http://localhost:3001](http://localhost:3001) in your browser to see the client application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Database Setup

${generateDatabaseSetup(database, auth, packageManagerRunCmd, orm)}

## Project Structure

\`\`\`
${projectName}/
├── packages/
│   ├── client/         # Frontend application (React, TanStack Router)
│   └── server/         # Backend API (Hono, tRPC)
\`\`\`

## Scripts

${generateScriptsList(packageManagerRunCmd)}
`;
}

function generateFeaturesList(
	database: string,
	auth: boolean,
	features: string[],
	orm: string,
): string {
	const featuresList = [
		"TypeScript - For type safety",
		"TanStack Router - File-based routing",
		`${orm === "drizzle" ? "Drizzle" : "Prisma"} - ORM`,
		"TailwindCSS - Utility-first CSS",
		"shadcn/ui - Reusable components",
		"Hono - Lightweight, performant server",
	];

	if (database !== "none") {
		featuresList.push(
			`${database === "sqlite" ? "SQLite/Turso DB" : "PostgreSQL"} - Database`,
		);
	}

	if (auth) {
		featuresList.push("Authentication - Email & password auth");
	}

	for (const feature of features) {
		if (feature === "docker") {
			featuresList.push("Docker - Containerized deployment");
		} else if (feature === "github-actions") {
			featuresList.push("GitHub Actions - CI/CD");
		} else if (feature === "SEO") {
			featuresList.push("SEO - Search engine optimization");
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
		return "This project does not include a database.";
	}

	if (database === "sqlite") {
		return `This project uses SQLite/Turso for the database.

1. Start the local database:
\`\`\`bash
${packageManagerRunCmd} db:local
\`\`\`

2. Update your \`.env\` file with the connection details.

${
	auth
		? `3. If using authentication, generate the auth schema:
\`\`\`bash
${packageManagerRunCmd} auth:generate
\`\`\`

4. Apply the schema to your database:
\`\`\`bash
${packageManagerRunCmd} ${orm === "drizzle" ? "drizzle:migrate" : "prisma:push"}
\`\`\``
		: ""
}`;
	}

	if (database === "postgres") {
		return `This project uses PostgreSQL for the database.

1. Set up your PostgreSQL database.
2. Update your \`.env\` file with the connection details.

${
	auth
		? `3. If using authentication, generate the auth schema:
\`\`\`bash
${packageManagerRunCmd} auth:generate
\`\`\`

4. Apply the schema to your database:
\`\`\`bash
${packageManagerRunCmd} ${orm === "drizzle" ? "drizzle:migrate" : "prisma:push"}
\`\`\``
		: ""
}`;
	}

	return "";
}

function generateScriptsList(packageManagerRunCmd: string): string {
	return `- \`${packageManagerRunCmd} dev\`: Start both client and server in development mode
- \`${packageManagerRunCmd} build\`: Build both client and server
- \`${packageManagerRunCmd} dev:client\`: Start only the client
- \`${packageManagerRunCmd} dev:server\`: Start only the server
- \`${packageManagerRunCmd} db:local\`: Start the local SQLite database (if applicable)
- \`${packageManagerRunCmd} db:push\`: Push schema changes to the database`;
}
