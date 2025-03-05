# Better-T-Stack

Better-T-Stack is a project scaffolding system for creating modern TypeScript applications with complete type safety from frontend to backend.

## Repository Structure

This repository is organized as a monorepo containing:

- **CLI**: [`create-better-t-stack`](apps/cli) - A scaffolding CLI that creates type-safe TypeScript projects
- **Documentation**: [`web`](apps/web) - The official website and documentation

## Quick Start

```bash
# Using npm
npx create-better-t-stack my-app

# Using bun
bunx create-better-t-stack my-app
```

## Features

- 🚀 Fast project setup with interactive CLI
- 📦 Complete TypeScript type safety from database to frontend
- 🗄️ Multiple database options (libSQL/PostgreSQL)
- 🧩 Choice of ORMs (Drizzle or Prisma)
- 🔒 Built-in authentication with Better-Auth
- 🐳 Optional Docker configuration
- 🔄 Optional GitHub Actions workflows

## Documentation

Visit [better-t-stack.pages.dev](https://better-t-stack.pages.dev) for full documentation.

## Development

```bash
# Clone the repository
git clone https://github.com/better-t-stack/create-better-t-stack.git

# Install dependencies
bun install

# Start development
bun dev
```
