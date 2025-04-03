import { cancel, confirm, isCancel } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";

export async function getPrismaSetupChoice(
	prismaSetup?: boolean,
): Promise<boolean> {
	if (prismaSetup !== undefined) return prismaSetup;

	const response = await confirm({
		message: "Set up Prisma Postgres database?",
		initialValue: DEFAULT_CONFIG.prismaPostgres,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
