import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../constants";
import type { ProjectBackend, ProjectFrontend, ProjectOrm } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupExamples(
	projectDir: string,
	examples: string[],
	orm: ProjectOrm,
	auth: boolean,
	backend: ProjectBackend,
	frontend: ProjectFrontend[] = ["web"],
): Promise<void> {
	console.log("EXAMPLEs:", examples);
	const hasWebFrontend = frontend.includes("web");
	const webAppExists = await fs.pathExists(path.join(projectDir, "apps/web"));

	if (examples.includes("todo") && hasWebFrontend && webAppExists) {
		await setupTodoExample(projectDir, orm, auth);
	} else {
		await cleanupTodoFiles(projectDir, orm);
	}

	if (
		examples.includes("ai") &&
		backend === "hono" &&
		hasWebFrontend &&
		webAppExists
	) {
		await setupAIExample(projectDir);
	}
}

async function setupAIExample(projectDir: string): Promise<void> {
	const aiExampleDir = path.join(PKG_ROOT, "template/examples/ai");

	if (await fs.pathExists(aiExampleDir)) {
		await fs.copy(aiExampleDir, projectDir);

		await updateHeaderWithAILink(projectDir);

		const clientDir = path.join(projectDir, "apps/web");
		addPackageDependency({
			dependencies: ["ai"],
			projectDir: clientDir,
		});

		const serverDir = path.join(projectDir, "apps/server");
		addPackageDependency({
			dependencies: ["ai", "@ai-sdk/google"],
			projectDir: serverDir,
		});

		await updateServerIndexWithAIRoute(projectDir);
	}
}

async function updateServerIndexWithAIRoute(projectDir: string): Promise<void> {
	const serverIndexPath = path.join(projectDir, "apps/server/src/index.ts");

	if (await fs.pathExists(serverIndexPath)) {
		let indexContent = await fs.readFile(serverIndexPath, "utf8");
		const isHono = indexContent.includes("hono");

		if (isHono) {
			const importSection = `import { streamText } from "ai";\nimport { google } from "@ai-sdk/google";\nimport { stream } from "hono/streaming";`;

			const aiRouteHandler = `
app.post("/ai", async (c) => {
		const body = await c.req.json();
		const messages = body.messages || [];

		const result = streamText({
				model: google("gemini-2.0-flash-exp"),
				messages,
		});

		c.header("X-Vercel-AI-Data-Stream", "v1");
		c.header("Content-Type", "text/plain; charset=utf-8");

		return stream(c, (stream) => stream.pipe(result.toDataStream()));
});`;

			// Add the import section
			if (indexContent.includes("import {")) {
				const lastImportIndex = indexContent.lastIndexOf("import");
				const endOfLastImport = indexContent.indexOf("\n", lastImportIndex);
				indexContent = `${indexContent.substring(0, endOfLastImport + 1)}
${importSection}
${indexContent.substring(endOfLastImport + 1)}`;
			} else {
				indexContent = `${importSection}

${indexContent}`;
			}

			// Add the route handler
			const trpcHandlerIndex =
				indexContent.indexOf('app.use("/trpc"') ||
				indexContent.indexOf("app.use(trpc(");
			if (trpcHandlerIndex !== -1) {
				indexContent = `${indexContent.substring(0, trpcHandlerIndex)}${aiRouteHandler}

${indexContent.substring(trpcHandlerIndex)}`;
			} else {
				// Add it near the end before export
				const exportIndex = indexContent.indexOf("export default");
				if (exportIndex !== -1) {
					indexContent = `${indexContent.substring(0, exportIndex)}${aiRouteHandler}

${indexContent.substring(exportIndex)}`;
				} else {
					indexContent = `${indexContent}

${aiRouteHandler}`;
				}
			}

			await fs.writeFile(serverIndexPath, indexContent);
		}
	}
}

async function updateHeaderWithAILink(projectDir: string): Promise<void> {
	const headerPath = path.join(
		projectDir,
		"apps/web/src/components/header.tsx",
	);

	if (await fs.pathExists(headerPath)) {
		let headerContent = await fs.readFile(headerPath, "utf8");

		if (headerContent.includes('{ to: "/todos"')) {
			headerContent = headerContent.replace(
				/{ to: "\/todos", label: "Todos" },/,
				`{ to: "/todos", label: "Todos" },\n    { to: "/ai", label: "AI Chat" },`,
			);
		} else if (headerContent.includes('{ to: "/dashboard"')) {
			headerContent = headerContent.replace(
				/{ to: "\/dashboard", label: "Dashboard" },/,
				`{ to: "/dashboard", label: "Dashboard" },\n    { to: "/ai", label: "AI Chat" },`,
			);
		} else {
			headerContent = headerContent.replace(
				/const links = \[\s*{ to: "\/", label: "Home" },/,
				`const links = [\n    { to: "/", label: "Home" },\n    { to: "/ai", label: "AI Chat" },`,
			);
		}

		await fs.writeFile(headerPath, headerContent);
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
