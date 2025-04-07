import path from "node:path";
import { cancel, isCancel, log, text } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { commandExists } from "../utils/command-exists";

type MongoDBConfig = {
	connectionString: string;
};

async function checkAtlasCLI(): Promise<boolean> {
	return commandExists("atlas");
}

async function initMongoDBAtlas(
	serverDir: string,
): Promise<MongoDBConfig | null> {
	try {
		const hasAtlas = await checkAtlasCLI();

		if (!hasAtlas) {
			log.error(pc.red("MongoDB Atlas CLI not found."));
			log.info(
				pc.yellow(
					"Please install it from: https://www.mongodb.com/docs/atlas/cli/current/install-atlas-cli/",
				),
			);
			return null;
		}

		log.info(pc.yellow("Setting up MongoDB Atlas..."));

		await execa("atlas", ["deployments", "setup"], {
			cwd: serverDir,
			stdio: "inherit",
		});

		log.info(pc.yellow("Please enter your connection string"));

		const connectionString = await text({
			message: "Paste your complete MongoDB connection string:",
			validate(value) {
				if (!value) return "Please enter a connection string";
				if (!value.startsWith("mongodb")) {
					return "URL should start with mongodb";
				}
			},
		});

		if (isCancel(connectionString)) {
			cancel("MongoDB setup cancelled");
			return null;
		}

		return {
			connectionString: connectionString as string,
		};
	} catch (error) {
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		return null;
	}
}

async function writeEnvFile(projectDir: string, config?: MongoDBConfig) {
	const envPath = path.join(projectDir, "apps/server", ".env");
	let envContent = "";

	if (await fs.pathExists(envPath)) {
		envContent = await fs.readFile(envPath, "utf8");
	}

	const mongoUrlLine = config
		? `DATABASE_URL="${config.connectionString}"`
		: `DATABASE_URL="mongodb://localhost:27017/mydb"`;

	if (!envContent.includes("DATABASE_URL=")) {
		envContent += `\n${mongoUrlLine}`;
	} else {
		envContent = envContent.replace(
			/DATABASE_URL=.*(\r?\n|$)/,
			`${mongoUrlLine}$1`,
		);
	}

	await fs.writeFile(envPath, envContent.trim());
}

function displayManualSetupInstructions() {
	log.info(`MongoDB Atlas Setup:

1. Install Atlas CLI: https://www.mongodb.com/docs/atlas/cli/stable/install-atlas-cli/
2. Run 'atlas deployments setup' and follow prompts
3. Get your connection string from the output
4. Format: mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME
5. Add to .env as DATABASE_URL="your_connection_string"`);
}

export async function setupMongoDBAtlas(projectDir: string) {
	const serverDir = path.join(projectDir, "apps/server");

	try {
		const config = await initMongoDBAtlas(serverDir);

		if (config) {
			await writeEnvFile(projectDir, config);
			log.success(
				pc.green("MongoDB Atlas connection string saved to .env file!"),
			);
		} else {
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
		}
	} catch (error) {
		log.error(pc.red(`Error during MongoDB Atlas setup: ${error}`));
		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
	}
}
