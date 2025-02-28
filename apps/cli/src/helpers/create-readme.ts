import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../types";

export async function createReadme(projectDir: string, config: ProjectConfig) {
	const readmePath = path.join(projectDir, "README.md");
	const projectName = path.basename(projectDir);

	const authSection = config.auth
		? `
## Authentication

This project uses [Better-Auth](https://www.better-auth.com/) for authentication.

To complete setup:
1. Create necessary auth tables: \`npx @better-auth/cli migrate\`
2. Configure environment variables in \`.env\` files
3. Check the auth documentation: https://www.better-auth.com/
`
		: "";

	const databaseSection =
		config.database !== "none"
			? `
## Database

This project uses ${config.database === "sqlite" ? "SQLite (via Turso)" : "PostgreSQL"} with ${config.orm} ORM.

${
	config.database === "sqlite"
		? "Ensure your Turso connection details are set in `packages/server/.env`."
		: "Ensure your PostgreSQL connection string is set in `packages/server/.env`."
}
`
			: "";

	const featuresSection =
		config.features.length > 0
			? `
## Features

This project includes:
${config.features.map((feature) => `- ${feature}`).join("\n")}
`
			: "";

	const readme = `# ${projectName}

A modern web application built with the Better-T Stack.

## Tech Stack

- **Frontend**: React, TanStack Router, TanStack Query
- **Backend**: Hono, tRPC
- **Styling**: Tailwind CSS with shadcn/ui components
${databaseSection}${authSection}${featuresSection}

## Getting Started

1. Install dependencies:
   \`\`\`
   ${config.packageManager} install
   \`\`\`

2. Start the development server:
   \`\`\`
   ${config.packageManager} run dev
   \`\`\`

## Project Structure

\`\`\`
packages/
  ├── client/        # React frontend application
  └── server/        # Hono + tRPC backend server
\`\`\`

## Commands

- \`${config.packageManager} run dev\`: Start development servers
- \`${config.packageManager} run build\`: Build for production
- \`${config.packageManager} run dev:client\`: Start only frontend server
- \`${config.packageManager} run dev:server\`: Start only backend server

## Environment Variables

Check \`.env.example\` files in each package directory for required environment variables.

## License

MIT
`;

	await fs.writeFile(readmePath, readme);
}
