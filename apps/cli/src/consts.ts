import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ProjectConfig } from "./types";

export const TITLE_TEXT = `
     ╔════════════════════════════════════════════════════════════╗
     ║                                                            ║
     ║   ██████╗ ███████╗████████╗████████╗███████╗██████╗        ║
     ║   ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗       ║
     ║   ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝       ║
     ║   ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗       ║
     ║   ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║       ║
     ║   ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝       ║
     ║                                                            ║
     ║   ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗   ║
     ║   ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝   ║
     ║      ██║       ███████╗   ██║   ███████║██║     █████╔╝    ║
     ║      ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗    ║
     ║      ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗   ║
     ║      ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝   ║
     ║                                                            ║
     ║              The Modern Full-Stack Framework               ║
     ║                                                            ║
     ╚════════════════════════════════════════════════════════════╝
 `;

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const DEFAULT_CONFIG: ProjectConfig = {
	projectName: "my-better-t-app",
	database: "libsql",
	auth: true,
	features: [],
	git: true,
};
