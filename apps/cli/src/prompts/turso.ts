import { cancel, confirm, isCancel } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";

export async function getTursoSetupChoice(turso?: boolean): Promise<boolean> {
	if (turso !== undefined) return turso;

	const response = await confirm({
		message: "Set up a Turso database for this project?",
		initialValue: DEFAULT_CONFIG.turso,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
