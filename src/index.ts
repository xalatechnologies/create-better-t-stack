#!/usr/bin/env node

import { boolean, command, run, string } from "@drizzle-team/brocli";
import { confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { createProject } from "./create-project";

const createCommand = command({
  name: "init",
  desc: "Create a new Better-T Stack project",
  options: {
    projectDir: string()
      .desc("Project directory name")
      .default("my-better-t-app"),
    git: boolean().desc("Initialize git repository").default(true),
  },
  handler: async (opts) => {
    console.log(chalk.bold("\n🚀 Creating a new Better-T Stack project...\n"));

    const projectName =
      opts.projectDir ||
      (await input({
        message: "Project name:",
        default: "my-better-t-app",
      }));

    const database = await select({
      message: "Select database:",
      choices: [
        { value: "libsql", label: "libSQL (recommended)" },
        { value: "postgres", label: "PostgreSQL" },
      ],
    });

    const auth = await confirm({
      message: "Add authentication with Better-Auth?",
      default: true,
    });

    const features = await select({
      message: "Select additional features:",
      choices: [
        { value: "docker", label: "Docker setup" },
        { value: "github-actions", label: "GitHub Actions" },
        { value: "SEO", label: "Basic SEO setup" },
      ],
      multiselect: true,
    });

    const projectOptions = {
      projectName,
      git: opts.git,
      database,
      auth,
      features,
    };

    await createProject(projectOptions);
  },
});

run([createCommand], {
  name: "create-better-t",
  description: "Create a new Better-T Stack project",
  version: "1.0.0",
});
