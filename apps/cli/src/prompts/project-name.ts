import path from "node:path";
import { cancel, isCancel, text } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";

const INVALID_CHARS = ["<", ">", ":", '"', "|", "?", "*"];
const MAX_LENGTH = 255;

function validateDirectoryName(name: string): string | undefined {
	if (name === ".") return undefined;

	if (!name) return "Project name cannot be empty";
	if (name.length > MAX_LENGTH) {
		return `Project name must be less than ${MAX_LENGTH} characters`;
	}
	if (INVALID_CHARS.some((char) => name.includes(char))) {
		return "Project name contains invalid characters";
	}
	if (name.startsWith(".") || name.startsWith("-")) {
		return "Project name cannot start with a dot or dash";
	}
	if (name.toLowerCase() === "node_modules") {
		return "Project name is reserved";
	}
	return undefined;
}

export async function getProjectName(initialName?: string): Promise<string> {
	if (initialName) {
		if (initialName === ".") {
			return initialName;
		}
		const finalDirName = path.basename(initialName);
		const validationError = validateDirectoryName(finalDirName);
		if (!validationError) {
			return initialName;
		}
	}

	let isValid = false;
	let projectPath = "";
	let defaultName = DEFAULT_CONFIG.projectName;
	let counter = 1;

	while (
		fs.pathExistsSync(path.resolve(process.cwd(), defaultName)) &&
		fs.readdirSync(path.resolve(process.cwd(), defaultName)).length > 0
	) {
		defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
		counter++;
	}

	while (!isValid) {
		const response = await text({
			message:
				"Enter your project name or path (relative to current directory)",
			placeholder: defaultName,
			initialValue: initialName,
			defaultValue: defaultName,
			validate: (value) => {
				const nameToUse = value.trim() || defaultName;

				const finalDirName = path.basename(nameToUse);
				const validationError = validateDirectoryName(finalDirName);
				if (validationError) return validationError;

				if (nameToUse !== ".") {
					const projectDir = path.resolve(process.cwd(), nameToUse);
					if (!projectDir.startsWith(process.cwd())) {
						return "Project path must be within current directory";
					}
				}

				return undefined;
			},
		});

		if (isCancel(response)) {
			cancel(pc.red("Operation cancelled."));
			process.exit(0);
		}

		projectPath = response || defaultName;
		isValid = true;
	}

	return projectPath;
}
