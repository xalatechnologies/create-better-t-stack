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
		// log.info(
		// 	pc.yellow(
		// 		"SEO feature is still a work-in-progress and will be available in a future update.",
		// 	),
		// );
		await setupSEO(projectDir);
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

async function setupSEO(projectDir: string) {
	const robotsContent = `# Instructions: Customize this file to control how search engines crawl your site
# Learn more: https://developers.google.com/search/docs/advanced/robots/create-robots-txt

# Allow all crawlers (default)
User-agent: *
Allow: /

# Disallow crawling of specific directories (uncomment and customize as needed)
# Disallow: /admin/
# Disallow: /private/

# Specify the location of your sitemap
Sitemap: https://yourdomain.com/sitemap.xml
`;

	await fs.writeFile(
		path.join(projectDir, "packages", "client", "robots.txt"),
		robotsContent,
	);

	const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://yourdomain.com/about</loc>
    <lastmod>2025-03-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>
`;
	await fs.writeFile(
		path.join(projectDir, "packages", "client", "sitemap.xml"),
		sitemapContent,
	);

	const metaContent = `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TanStack Router</title>
  <meta name="description"
    content="Replace this with your page description - keep it between 150-160 characters for optimal display in search results." />
  <meta name="keywords" content="keyword1, keyword2, keyword3, customize based on your content" />
  <meta name="robots" content="index, follow" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

  <!-- OPEN GRAPH TAGS: Optimize how your content appears when shared on Facebook, LinkedIn, etc. -->
  <meta property="og:title" content="Replace with your page title" />
  <meta property="og:description"
    content="Replace with your page description (typically the same as meta description)" />
  <meta property="og:image" content="path-to-image" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Your Site Name" />

  <!-- TWITTER CARD TAGS: Optimize how your content appears when shared on Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Replace with your page title" />
  <meta name="twitter:description" content="Replace with your page description" />
  <meta name="twitter:image" content="path-to-image" />
  <meta name="twitter:creator" content="@yourtwitterhandle" />

  <!-- STRUCTURED DATA: Help search engines understand your content better (JSON-LD format) -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Replace with your page title",
      "description": "Replace with your page description",
      "url": "https://yourdomain.com/your-page-url"
    }
    </script>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>
`;

	await fs.writeFile(
		path.join(projectDir, "packages", "client", "index.html"),
		metaContent,
	);
}
