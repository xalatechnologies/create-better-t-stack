import consola from "consola";
import { PostHog } from "posthog-node";
import type { ProjectConfig } from "../types";
import { getLatestCLIVersion } from "./get-latest-cli-version";

const POSTHOG_API_KEY = "phc_8ZUxEwwfKMajJLvxz1daGd931dYbQrwKNficBmsdIrs";
const POSTHOG_HOST = "https://us.i.posthog.com";

export async function trackProjectCreation(
	config: ProjectConfig,
): Promise<void> {
	const posthog = new PostHog(POSTHOG_API_KEY, {
		host: POSTHOG_HOST,
		flushAt: 1,
		flushInterval: 0,
		privacyMode: true,
		disableGeoip: true,
	});

	try {
		const sessionId = `cli_${Date.now()}_${crypto
			.randomUUID()
			.replace(/-/g, "")}`;

		const { projectName, projectDir, relativePath, ...safeConfig } = config;

		posthog.capture({
			distinctId: sessionId,
			event: "project_created",
			properties: {
				...safeConfig,
				cli_version: getLatestCLIVersion(),
				node_version: process.version,
				platform: process.platform,
				$ip: null,
			},
		});
	} catch (error) {
		consola.debug("Analytics tracking failed:", error);
	} finally {
		await posthog.shutdown();
	}
}
