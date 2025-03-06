import path from "node:path";
import { log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectAddons } from "../types";

export async function setupAddons(projectDir: string, addons: ProjectAddons[]) {
	if (addons.includes("docker")) {
		await setupDocker(projectDir);
	}

	if (addons.includes("github-actions")) {
		await setupGithubActions(projectDir);
	}

	if (addons.includes("SEO")) {
		log.info(
			pc.yellow(
				"SEO feature is still a work-in-progress and will be available in a future update.",
			),
		);
	}
}

async function setupDocker(projectDir: string) {
	const dockerfileContent = `FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \\
		if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
		elif [ -f package-lock.json ]; then npm ci; \\
		elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \\
		elif [ -f bun.lockb ]; then yarn global add bun && bun install --frozen-lockfile; \\
		else npm i; \\
		fi

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# First build client
RUN npm run build -w @better-t/client
# Then build server
RUN npm run build -w @better-t/server

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/client/dist ./packages/client/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/server/package.json ./packages/server/package.json
COPY --from=builder /app/packages/client/package.json ./packages/client/package.json

EXPOSE 3000

CMD ["node", "packages/server/dist/index.js"]
`;

	// Create docker-compose.yml
	const dockerComposeContent = `version: '3'

services:
		app:
				build: .
				ports:
						- "3000:3000"
				environment:
						- NODE_ENV=production
						- TURSO_DATABASE_URL=\${TURSO_DATABASE_URL}
						- TURSO_AUTH_TOKEN=\${TURSO_AUTH_TOKEN}
						- CORS_ORIGIN=\${CORS_ORIGIN}
				restart: always
`;

	const dockerignoreContent = `.git
node_modules
**/node_modules
**/dist
.env
.env.*
`;

	await fs.writeFile(path.join(projectDir, "Dockerfile"), dockerfileContent);
	await fs.writeFile(
		path.join(projectDir, "docker-compose.yml"),
		dockerComposeContent,
	);
	await fs.writeFile(
		path.join(projectDir, ".dockerignore"),
		dockerignoreContent,
	);
}

async function setupGithubActions(projectDir: string) {
	const workflowsDir = path.join(projectDir, ".github/workflows");
	await fs.ensureDir(workflowsDir);

	const ciWorkflowContent = `name: CI

on:
		push:
				branches: [ main ]
		pull_request:
				branches: [ main ]

jobs:
		build:
				runs-on: ubuntu-latest

				steps:
						- uses: actions/checkout@v3

						- name: Setup Node.js
								uses: actions/setup-node@v3
								with:
										node-version: '18'
										cache: 'npm'

						- name: Install dependencies
								run: npm ci

						- name: Type check
								run: npm run check-types

						- name: Build
								run: npm run build
`;

	const deployWorkflowContent = `name: Deploy

on:
		push:
				branches: [ main ]

		# Enable manual trigger
		workflow_dispatch:

jobs:
		deploy:
				runs-on: ubuntu-latest

				steps:
						- uses: actions/checkout@v3

						- name: Setup Node.js
								uses: actions/setup-node@v3
								with:
										node-version: '18'
										cache: 'npm'

						- name: Install dependencies
								run: npm ci

						- name: Build
								run: npm run build

						# Add your deployment steps here
						# This is just a placeholder for your actual deployment logic
						- name: Deploy
								run: echo "Add your deployment commands here"
`;

	await fs.writeFile(path.join(workflowsDir, "ci.yml"), ciWorkflowContent);
	await fs.writeFile(
		path.join(workflowsDir, "deploy.yml"),
		deployWorkflowContent,
	);
}
