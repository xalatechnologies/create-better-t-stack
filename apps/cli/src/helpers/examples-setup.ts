import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type { ProjectOrm } from "../types";

export async function setupExamples(
	projectDir: string,
	examples: string[],
	orm: ProjectOrm,
	auth: boolean,
): Promise<void> {
	if (examples.includes("todo")) {
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
		const todoRouteDir = path.join(
			todoExampleDir,
			"packages/client/src/routes",
		);
		const targetRouteDir = path.join(projectDir, "packages/client/src/routes");
		await fs.copy(todoRouteDir, targetRouteDir, { overwrite: true });

		if (orm !== "none") {
			const todoRouterSourceFile = path.join(
				todoExampleDir,
				`packages/server/src/routers/with-${orm}-todo.ts`,
			);
			const todoRouterTargetFile = path.join(
				projectDir,
				"packages/server/src/routers/todo.ts",
			);

			if (await fs.pathExists(todoRouterSourceFile)) {
				await fs.copy(todoRouterSourceFile, todoRouterTargetFile, {
					overwrite: true,
				});
			}
		}

		await updateHeaderWithTodoLink(projectDir, auth);
	}
}

async function updateHeaderWithTodoLink(
	projectDir: string,
	auth: boolean,
): Promise<void> {
	const headerPath = path.join(
		projectDir,
		"packages/client/src/components/header.tsx",
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
			"packages/server/src/db/schema/todo.ts",
		);
		if (await fs.pathExists(todoSchemaFile)) {
			await fs.remove(todoSchemaFile);
		}
	} else if (orm === "prisma") {
		const todoPrismaFile = path.join(
			projectDir,
			"packages/server/prisma/schema/todo.prisma",
		);
		if (await fs.pathExists(todoPrismaFile)) {
			await fs.remove(todoPrismaFile);
		}
	}

	const todoRouterFile = path.join(
		projectDir,
		"packages/server/src/routers/todo.ts",
	);
	if (await fs.pathExists(todoRouterFile)) {
		await fs.remove(todoRouterFile);
	}

	await updateRouterIndex(projectDir);
}

async function updateRouterIndex(projectDir: string): Promise<void> {
	const routerFile = path.join(
		projectDir,
		"packages/server/src/routers/index.ts",
	);

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
