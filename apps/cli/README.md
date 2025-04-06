# Create Better-T-Stack CLI

A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations

## Quick Start

Run without installing globally:

```bash
# Using npm
npx create-better-t-stack@latest

# Using bun
bun create better-t-stack@latest

# Using pnpm
pnpm create better-t-stack@latest
```

Follow the prompts to configure your project or use the `--yes` flag for defaults.

## Features

- **Monorepo**: Turborepo for optimized build system and workspace management
- **Frontend**: React, TanStack Router, TanStack Query, Tailwind CSS with shadcn/ui components
- **Native Apps**: Create React Native apps with Expo for iOS and Android
- **Backend Frameworks**: Choose between Hono or Elysia
- **API Layer**: End-to-end type safety with tRPC
- **Runtime Options**: Choose between Bun or Node.js for your server
- **Database Options**: SQLite (via Turso), PostgreSQL, or no database
- **ORM Selection**: Choose between Drizzle ORM or Prisma
- **Authentication**: Optional auth setup with Better-Auth
- **Progressive Web App**: Add PWA support with service workers and installable apps
- **Desktop Apps**: Build native desktop apps with Tauri integration
- **Code Quality**: Biome for linting and formatting
- **Git Hooks**: Husky with lint-staged for pre-commit checks
- **Examples**: Todo app with full CRUD functionality, AI Chat using AI SDK
- **Developer Experience**: Git initialization, various package manager support (npm, pnpm, bun)

## Usage

```bash
Usage: create-better-t-stack [project-directory] [options]

Options:
  -V, --version                   Output the version number
  -y, --yes                       Use default configuration
  --database <type>               Database type (none, sqlite, postgres)
  --orm <type>                    ORM type (none, drizzle, prisma)
  --auth                          Include authentication
  --no-auth                       Exclude authentication
  --frontend <types...>           Frontend types (tanstack-router, react-router, tanstack-start, native, none)
  --addons <types...>             Additional addons (pwa, tauri, biome, husky, none)
  --examples <types...>           Examples to include (todo, ai)
  --no-examples                   Skip all examples
  --git                           Initialize git repository
  --no-git                        Skip git initialization
  --package-manager <pm>          Package manager (npm, pnpm, bun)
  --install                       Install dependencies
  --no-install                    Skip installing dependencies
  --turso                         Set up Turso for SQLite database
  --no-turso                      Skip Turso setup
  --prisma-postgres               Set up Prisma Postgres
  --no-prisma-postgres            Skip Prisma Postgres setup
  --backend <framework>           Backend framework (hono, elysia)
  --runtime <runtime>             Runtime (bun, node)
  -h, --help                      Display help
```

## Examples

Create a project with default configuration:
```bash
npx create-better-t-stack my-app --yes
```

Create a project with specific options:
```bash
npx create-better-t-stack my-app --database postgres --orm drizzle --auth --addons pwa biome
```

Create a project with Elysia and Node.js runtime:
```bash
npx create-better-t-stack my-app --backend elysia --runtime node
```

Create a project with specific frontend options:
```bash
npx create-better-t-stack my-app --frontend tanstack-router native
```

Create a project with examples:
```bash
npx create-better-t-stack my-app --examples todo ai
```
