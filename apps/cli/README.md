# Create Better-T-Stack CLI

A CLI tool for scaffolding type-safe full-stack apps with Hono/Elysia backends, React web frontends, and Expo native apps, all connected through tRPC.

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

Follow the prompts to configure your project or use the `-y` flag for defaults.

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
- **Examples**: Todo app with full CRUD functionality
- **Developer Experience**: Git initialization, various package manager support (npm, pnpm, bun)

## Usage

```bash
Usage: create-better-t-stack [project-directory] [options]

Options:
  -V, --version          Output the version number
  -y, --yes              Use default configuration
  --no-database          Skip database setup
  --sqlite               Use SQLite database
  --postgres             Use PostgreSQL database
  --auth                 Include authentication
  --no-auth              Exclude authentication
  --pwa                  Include Progressive Web App support
  --tauri                Include Tauri desktop app support
  --biome                Include Biome for linting and formatting
  --husky                Include Husky, lint-staged for Git hooks
  --no-addons            Skip all additional addons
  --examples <examples>  Include specified examples
  --no-examples          Skip all examples
  --git                  Include git setup (default)
  --no-git               Skip git initialization
  --npm                  Use npm as package manager
  --pnpm                 Use pnpm as package manager
  --bun                  Use bun as package manager
  --drizzle              Use Drizzle ORM
  --prisma               Use Prisma ORM
  --install              Install dependencies (default)
  --no-install           Skip installing dependencies
  --turso                Set up Turso for SQLite database
  --no-turso             Skip Turso setup for SQLite database
  --hono                 Use Hono backend framework (default)
  --elysia               Use Elysia backend framework
  --runtime <runtime>    Specify runtime (bun or node)
  --web                  Include web frontend (default)
  --native               Include Expo frontend
  --no-web               Exclude web frontend
  --no-native            Exclude Expo frontend
  -h, --help             Display help
```

## Examples

Create a project with default configuration:
```bash
npx create-better-t-stack my-app -y
```

Create a project with specific options:
```bash
npx create-better-t-stack my-app --postgres --drizzle --auth --pwa --biome
```

Create a project with Elysia and Node.js runtime:
```bash
npx create-better-t-stack my-app --elysia --runtime node
```

Create a project using Hono with no addons:
```bash
npx create-better-t-stack my-app --hono --no-addons
```

Created by [Aman Varshney](https://github.com/AmanVarshney01) & [Nitish Singh](https://github.com/FgrReloaded)
