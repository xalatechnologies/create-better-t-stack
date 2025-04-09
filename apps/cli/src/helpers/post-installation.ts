import { note } from "@clack/prompts";
import pc from "picocolors";
import type {
	ProjectAddons,
	ProjectDBSetup,
	ProjectDatabase,
	ProjectFrontend,
	ProjectOrm,
	ProjectPackageManager,
	ProjectRuntime,
} from "../types";

export function displayPostInstallInstructions(
	database: ProjectDatabase,
	projectName: string,
	packageManager: ProjectPackageManager,
	depsInstalled: boolean,
	orm: ProjectOrm,
	addons: ProjectAddons[],
	runtime: ProjectRuntime,
	frontends: ProjectFrontend[],
	dbSetup?: ProjectDBSetup,
) {
	const runCmd = packageManager === "npm" ? "npm run" : packageManager;
	const cdCmd = `cd ${projectName}`;
	const hasHuskyOrBiome =
		addons?.includes("husky") || addons?.includes("biome");

	const databaseInstructions =
		database !== "none"
			? getDatabaseInstructions(database, orm, runCmd, runtime)
			: "";
	const tauriInstructions = addons?.includes("tauri")
		? getTauriInstructions(runCmd)
		: "";
	const lintingInstructions = hasHuskyOrBiome
		? getLintingInstructions(runCmd)
		: "";
	const nativeInstructions = frontends?.includes("native")
		? getNativeInstructions()
		: "";
	const pwaInstructions =
		addons?.includes("pwa") && frontends?.includes("react-router")
			? getPwaInstructions()
			: "";

	const hasTanstackRouter = frontends?.includes("tanstack-router");
	const hasTanstackStart = frontends?.includes("tanstack-start");
	const hasReactRouter = frontends?.includes("react-router");
	const hasWebFrontend =
		hasTanstackRouter || hasReactRouter || hasTanstackStart;
	const hasNativeFrontend = frontends?.includes("native");
	const hasFrontend = hasWebFrontend || hasNativeFrontend;

	const webPort = hasReactRouter ? "5173" : "3001";

	note(
		`${pc.cyan("1.")} ${cdCmd}
${!depsInstalled ? `${pc.cyan("2.")} ${packageManager} install\n` : ""}${pc.cyan(depsInstalled ? "2." : "3.")} ${runCmd} dev

${pc.bold("Your project will be available at:")}
${
	hasFrontend
		? `${hasWebFrontend ? `${pc.cyan("•")} Frontend: http://localhost:${webPort}\n` : ""}`
		: `${pc.yellow("NOTE:")} You are creating a backend-only app (no frontend selected)\n`
}${pc.cyan("•")} API: http://localhost:3000
${nativeInstructions ? `\n${nativeInstructions.trim()}` : ""}${databaseInstructions ? `\n${databaseInstructions.trim()}` : ""}${tauriInstructions ? `\n${tauriInstructions.trim()}` : ""}${lintingInstructions ? `\n${lintingInstructions.trim()}` : ""}${pwaInstructions ? `\n${pwaInstructions.trim()}` : ""}
\n${pc.bold("Like Better-T Stack?")} Please consider giving us a star on GitHub:
${pc.cyan("https://github.com/AmanVarshney01/create-better-t-stack")}`,
		"Next steps",
	);
}

function getNativeInstructions(): string {
	return `${pc.yellow("NOTE:")} For Expo connectivity issues, update apps/native/.env \nwith your local IP:\n${"EXPO_PUBLIC_SERVER_URL=http://192.168.0.103:3000"}\n`;
}

function getLintingInstructions(runCmd?: string): string {
	return `${pc.bold("Linting and formatting:")}\n${pc.cyan("•")} Format and lint fix: ${`${runCmd} check`}\n\n`;
}

function getDatabaseInstructions(
	database: ProjectDatabase,
	orm?: ProjectOrm,
	runCmd?: string,
	runtime?: ProjectRuntime,
): string {
	const instructions = [];

	if (orm === "prisma") {
		if (database === "sqlite") {
			instructions.push(
				`${pc.yellow("NOTE:")} Turso support with Prisma is in Early Access and requires additional setup.`,
				`${"Learn more at: https://www.prisma.io/docs/orm/overview/databases/turso"}`,
			);
		}

		if (runtime === "bun") {
			instructions.push(
				`${pc.yellow("NOTE:")} Prisma with Bun may require additional configuration. If you encounter errors,\nfollow the guidance provided in the error messages`,
			);
		}

		instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
		instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
	} else if (orm === "drizzle") {
		instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
		instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
	}

	return instructions.length
		? `${pc.bold("Database commands:")}\n${instructions.join("\n")}\n\n`
		: "";
}

function getTauriInstructions(runCmd?: string): string {
	return `\n${pc.bold("Desktop app with Tauri:")}\n${pc.cyan("•")} Start desktop app: ${`cd apps/web && ${runCmd} desktop:dev`}\n${pc.cyan("•")} Build desktop app: ${`cd apps/web && ${runCmd} desktop:build`}\n${pc.yellow("NOTE:")} Tauri requires Rust and platform-specific dependencies.\nSee: ${"https://v2.tauri.app/start/prerequisites/"}\n\n`;
}

function getPwaInstructions(): string {
	return `${pc.bold("PWA with React Router v7:")}\n${pc.yellow("NOTE:")} There is a known compatibility issue between VitePWA and React Router v7.\nSee: https://github.com/vite-pwa/vite-plugin-pwa/issues/809\n`;
}
