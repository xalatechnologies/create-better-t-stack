import path from "node:path";
import { cancel, isCancel, text } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";

const INVALID_CHARS = ["<", ">", ":", '"', "|", "?", "*"];

const MAX_LENGTH = 255;

function validateDirectoryName(name: string): string | undefined {
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
	if (
		name.toLowerCase() === "node_modules" ||
		name.toLowerCase() === "favicon.ico"
	) {
		return "Project name is reserved";
	}
	return undefined;
}

export async function getProjectName(initialName?: string): Promise<string> {
	if (initialName) {
		const finalDirName = path.basename(initialName);
		const validationError = validateDirectoryName(finalDirName);
		if (!validationError) {
			const projectDir = path.resolve(process.cwd(), initialName);
			if (
				!fs.pathExistsSync(projectDir) ||
				fs.readdirSync(projectDir).length === 0
			) {
				return initialName;
			}
		}
	}

	let isValid = false;
	let projectName = "";
	let defaultName = DEFAULT_CONFIG.projectName;
	let counter = 1;

	while (fs.pathExistsSync(path.resolve(process.cwd(), defaultName))) {
		defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
		counter++;
	}

	while (!isValid) {
		const response = await text({
			message: "What is your project named? (directory name or path)",
			placeholder: defaultName,
			initialValue: initialName,
			defaultValue: defaultName,
			validate: (value) => {
				const nameToUse = value.trim() || defaultName;

				const finalDirName = path.basename(nameToUse);
				const validationError = validateDirectoryName(finalDirName);
				if (validationError) return validationError;

				const projectDir = path.resolve(process.cwd(), nameToUse);
				if (!projectDir.startsWith(process.cwd())) {
					return "Project path must be within current directory";
				}

				if (fs.pathExistsSync(projectDir)) {
					const dirContents = fs.readdirSync(projectDir);
					if (dirContents.length > 0) {
						return `Directory "${nameToUse}" already exists and is not empty. Please choose a different name.`;
					}
				}

				isValid = true;
				return undefined;
			},
		});

		if (isCancel(response)) {
			cancel(pc.red("Operation cancelled."));
			process.exit(0);
		}

		projectName = response || defaultName;
	}

	return projectName;
}
