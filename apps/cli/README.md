# Create Better-T-Stack CLI

> **Note:** This CLI is currently a work in progress (WIP).

An interactive CLI tool to quickly scaffold full-stack applications using the Better-T-Stack framework.

## Quick Start

Run without installing globally:

```bash
npx create-better-t-stack
# OR
bunx create-better-t-stack
```

Follow the prompts to configure your project.

## Usage

```bash
Usage: create-better-t-stack [project-directory] [options]

Options:
  -V, --version         Output the version number
  -y, --yes             Use default configuration
  --no-database         Skip database setup
  --sqlite              Use SQLite database
  --postgres            Use PostgreSQL database
  --auth                Include authentication
  --no-auth             Disable authentication
  --docker              Include Docker setup
  --github-actions      Add GitHub Actions workflows
  --seo                 Configure SEO optimizations
  --git                 Initialize a new git repo (default)
  --no-git              Skip git initialization
  --npm                 Use npm as package manager
  --pnpm                Use pnpm as package manager
  --yarn                Use yarn as package manager
  --bun                 Use bun as package manager
  --drizzle             Use Drizzle ORM
  --prisma              Use Prisma ORM
  -h, --help            Display help
```

## Features

- **Project Setup**: Scaffold a full-stack TypeScript project with a monorepo structure
- **Database Options**: Choose between SQLite (via Turso), PostgreSQL, or no database
- **Authentication**: Optional auth setup with Better-Auth
- **ORM Selection**: Choose between Drizzle ORM or Prisma
- **Deployment**: Optional Docker configuration
- **CI/CD**: GitHub Actions workflows
- **Developer Experience**: Git initialization and package manager selection

## Stack

The generated project includes:

- **Frontend**: React, TanStack Router, TanStack Query
- **Backend**: Hono, tRPC
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: SQLite (Turso) or PostgreSQL with your choice of ORM

Created by [Nitish Singh](https://github.com/FgrReloaded) & [Aman Varshney](https://github.com/AmanVarshney01)
