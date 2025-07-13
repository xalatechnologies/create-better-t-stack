/**
 * Utility function to determine if telemetry should be enabled.
 *
 * Telemetry is enabled by default in production, but can be disabled by:
 * - Setting BTS_TELEMETRY=0 or BTS_TELEMETRY=false
 * - Running in development environment (NODE_ENV=development)
 */
export function isTelemetryEnabled(): boolean {
	// If user explicitly disabled telemetry
	if (
		process.env.BTS_TELEMETRY === "0" ||
		process.env.BTS_TELEMETRY === "false"
	) {
		return false;
	}

	// If user explicitly enabled telemetry
	if (
		process.env.BTS_TELEMETRY === "1" ||
		process.env.BTS_TELEMETRY === "true"
	) {
		return true;
	}

	if (
		process.env.BTS_TELEMETRY_DISABLED === "1" ||
		process.env.BTS_TELEMETRY_DISABLED === "true"
	) {
		return false;
	}

	// Default to enabled in production
	return true;
}
