import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type { ProjectFrontend, ProjectOrm } from "../types";

export async function setupExamples(
	projectDir: string,
	examples: string[],
	orm: ProjectOrm,
	auth: boolean,
	frontend: ProjectFrontend[] = ["web"],
): Promise<void> {
	const hasWebFrontend = frontend.includes("web");

	const webAppExists = await fs.pathExists(path.join(projectDir, "apps/web"));

	if (examples.includes("todo") && hasWebFrontend && webAppExists) {
		await setupTodoExample(projectDir, orm, auth);
	} else {
		await cleanupTodoFiles(projectDir, orm);
	}
}

async function setupTodoExample(
	projectDir: string,
	orm: ProjectOrm,
	auth: boolean,
): Promise<void> {
	const todoExampleDir = path.join(PKG_ROOT, "template/examples/todo");
	if (await fs.pathExists(todoExampleDir)) {
		const todoRouteDir = path.join(todoExampleDir, "apps/web/src/routes");
		const targetRouteDir = path.join(projectDir, "apps/web/src/routes");
		await fs.copy(todoRouteDir, targetRouteDir, { overwrite: true });

		if (orm !== "none") {
			const todoRouterSourceFile = path.join(
				todoExampleDir,
				`apps/server/src/routers/with-${orm}-todo.ts`,
			);
			const todoRouterTargetFile = path.join(
				projectDir,
				"apps/server/src/routers/todo.ts",
			);

			if (await fs.pathExists(todoRouterSourceFile)) {
				await fs.copy(todoRouterSourceFile, todoRouterTargetFile, {
					overwrite: true,
				});
			}
		}

		await updateHeaderWithTodoLink(projectDir, auth);
		await addTodoButtonToHomepage(projectDir);
	}
}

async function updateHeaderWithTodoLink(
	projectDir: string,
	auth: boolean,
): Promise<void> {
	const headerPath = path.join(
		projectDir,
		"apps/web/src/components/header.tsx",
	);

	if (await fs.pathExists(headerPath)) {
		let headerContent = await fs.readFile(headerPath, "utf8");

		if (auth) {
			headerContent = headerContent.replace(
				/const links = \[\s*{ to: "\/", label: "Home" },\s*{ to: "\/dashboard", label: "Dashboard" },/,
				`const links = [\n    { to: "/", label: "Home" },\n    { to: "/dashboard", label: "Dashboard" },\n    { to: "/todos", label: "Todos" },`,
			);
		} else {
			headerContent = headerContent.replace(
				/const links = \[\s*{ to: "\/", label: "Home" },/,
				`const links = [\n    { to: "/", label: "Home" },\n    { to: "/todos", label: "Todos" },`,
			);
		}

		await fs.writeFile(headerPath, headerContent);
	}
}

async function cleanupTodoFiles(
	projectDir: string,
	orm: ProjectOrm,
): Promise<void> {
	if (orm === "drizzle") {
		const todoSchemaFile = path.join(
			projectDir,
			"apps/server/src/db/schema/todo.ts",
		);
		if (await fs.pathExists(todoSchemaFile)) {
			await fs.remove(todoSchemaFile);
		}
	} else if (orm === "prisma") {
		const todoPrismaFile = path.join(
			projectDir,
			"apps/server/prisma/schema/todo.prisma",
		);
		if (await fs.pathExists(todoPrismaFile)) {
			await fs.remove(todoPrismaFile);
		}
	}

	const todoRouterFile = path.join(
		projectDir,
		"apps/server/src/routers/todo.ts",
	);
	if (await fs.pathExists(todoRouterFile)) {
		await fs.remove(todoRouterFile);
	}

	await updateRouterIndex(projectDir);
}

async function updateRouterIndex(projectDir: string): Promise<void> {
	const routerFile = path.join(projectDir, "apps/server/src/routers/index.ts");

	if (await fs.pathExists(routerFile)) {
		let routerContent = await fs.readFile(routerFile, "utf8");
		routerContent = routerContent.replace(
			/import { todoRouter } from ".\/todo";/,
			"",
		);
		routerContent = routerContent.replace(/todo: todoRouter,/, "");
		await fs.writeFile(routerFile, routerContent);
	}
}

async function addTodoButtonToHomepage(projectDir: string): Promise<void> {
	const indexPath = path.join(projectDir, "apps/web/src/routes/index.tsx");

	if (await fs.pathExists(indexPath)) {
		let indexContent = await fs.readFile(indexPath, "utf8");

		indexContent = indexContent.replace(
			/<div id="buttons"><\/div>/,
			`<div id="buttons" className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button asChild>
          <Link to="/todos" className="flex items-center">
            View Todo Demo
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>`,
		);

		await fs.writeFile(indexPath, indexContent);
	}
}
