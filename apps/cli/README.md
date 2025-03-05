# Create Better-T-Stack CLI

> **Note:** This CLI is currently a work in progress (WIP).

An interactive CLI tool to quickly scaffold full-stack TypeScript applications using the Better-T-Stack framework.

## Quick Start

Run without installing globally:

```bash
npx create-better-t-stack@latest
# OR
bunx create-better-t-stack
```

Follow the prompts to configure your project.

## Features

- **Monorepo**: Turborepo for optimized build system and workspace management
- **Frontend**: React, TanStack Router, TanStack Query, Tailwind CSS with shadcn/ui components
- **Backend**: Hono, tRPC
- **Database Options**: SQLite (via Turso), PostgreSQL, or no database
- **ORM Selection**: Choose between Drizzle ORM or Prisma
- **Authentication**: Optional auth setup with Better-Auth
- **Developer Experience**: Git initialization, various package manager support (npm, pnpm, yarn, bun)
- **Deployment**: Optional Docker configuration
- **CI/CD**: Optional GitHub Actions workflows

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
  --install             Install dependencies (default)
  --no-install          Skip installing dependencies
  --turso               Set up Turso for SQLite database (default with sqlite)
  --no-turso            Skip Turso setup for SQLite database
  -h, --help            Display help
```

## Examples

Create a project with default configuration:
```bash
npx create-better-t-stack my-app -y
```

Create a project with specific options:
```bash
npx create-better-t-stack my-app --postgres --prisma --auth --docker
```

## Project Structure

The generated project follows a Turborepo monorepo structure:

```
my-app/
├── packages/
│   ├── client/         # Frontend application (React, TanStack Router)
│   └── server/         # Backend API (Hono, tRPC)
├── package.json        # Root package.json with Turborepo configuration
└── README.md           # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

Created by [Nitish Singh](https://github.com/FgrReloaded) & [Aman Varshney](https://github.com/AmanVarshney01)
