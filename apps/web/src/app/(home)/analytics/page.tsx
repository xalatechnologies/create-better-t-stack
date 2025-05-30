"use client";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import discordLogo from "@/public/icon/discord.svg";
import { format, parseISO } from "date-fns";
import { Cpu, Download, Terminal, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Papa from "papaparse";
import { useCallback, useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from "recharts";
import Navbar from "../_components/navbar";

interface AnalyticsData {
	date: string;
	cli_version: string;
	node_version: string;
	platform: string;
	backend: string;
	database: string;
	auth: string;
	api: string;
	packageManager: string;
	frontend0: string;
	frontend1: string;
	examples0: string;
	examples1: string;
	addons: string[];
	git: string;
	install: string;
}

const timeSeriesConfig = {
	projects: {
		label: "Projects Created",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

const platformConfig = {
	darwin: {
		label: "macOS",
		color: "hsl(var(--chart-1))",
	},
	linux: {
		label: "Linux",
		color: "hsl(var(--chart-2))",
	},
	win32: {
		label: "Windows",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const packageManagerConfig = {
	npm: {
		label: "npm",
		color: "hsl(var(--chart-1))",
	},
	pnpm: {
		label: "pnpm",
		color: "hsl(var(--chart-2))",
	},
	bun: {
		label: "bun",
		color: "hsl(var(--chart-3))",
	},
	yarn: {
		label: "yarn",
		color: "hsl(var(--chart-4))",
	},
	unknown: {
		label: "Unknown",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const backendConfig = {
	hono: {
		label: "Hono",
		color: "hsl(var(--chart-1))",
	},
	express: {
		label: "Express",
		color: "hsl(var(--chart-2))",
	},
	fastify: {
		label: "Fastify",
		color: "hsl(var(--chart-3))",
	},
	next: {
		label: "Next.js",
		color: "hsl(var(--chart-4))",
	},
	elysia: {
		label: "Elysia",
		color: "hsl(var(--chart-5))",
	},
	convex: {
		label: "Convex",
		color: "hsl(var(--chart-1))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-6))",
	},
} satisfies ChartConfig;

const databaseConfig = {
	sqlite: {
		label: "SQLite",
		color: "hsl(var(--chart-1))",
	},
	postgres: {
		label: "PostgreSQL",
		color: "hsl(var(--chart-2))",
	},
	mysql: {
		label: "MySQL",
		color: "hsl(var(--chart-3))",
	},
	mongodb: {
		label: "MongoDB",
		color: "hsl(var(--chart-4))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-6))",
	},
} satisfies ChartConfig;

const apiConfig = {
	trpc: {
		label: "tRPC",
		color: "hsl(var(--chart-1))",
	},
	orpc: {
		label: "oRPC",
		color: "hsl(var(--chart-2))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-6))",
	},
} satisfies ChartConfig;

const frontendConfig = {
	"react-router": {
		label: "React Router",
		color: "hsl(var(--chart-1))",
	},
	"tanstack-router": {
		label: "TanStack Router",
		color: "hsl(var(--chart-2))",
	},
	"tanstack-start": {
		label: "TanStack Start",
		color: "hsl(var(--chart-3))",
	},
	next: {
		label: "Next.js",
		color: "hsl(var(--chart-4))",
	},
	nuxt: {
		label: "Nuxt",
		color: "hsl(var(--chart-5))",
	},
	"native-nativewind": {
		label: "Native NativeWind",
		color: "hsl(var(--chart-6))",
	},
	"native-unistyles": {
		label: "Native Unistyles",
		color: "hsl(var(--chart-7))",
	},
	svelte: {
		label: "Svelte",
		color: "hsl(var(--chart-3))",
	},
	solid: {
		label: "Solid",
		color: "hsl(var(--chart-4))",
	},
	none: {
		label: "None",
		color: "hsl(var(--chart-6))",
	},
} satisfies ChartConfig;

const nodeVersionConfig = {
	"18": {
		label: "Node.js 18",
		color: "hsl(var(--chart-1))",
	},
	"20": {
		label: "Node.js 20",
		color: "hsl(var(--chart-2))",
	},
	"22": {
		label: "Node.js 22",
		color: "hsl(var(--chart-3))",
	},
	"16": {
		label: "Node.js 16",
		color: "hsl(var(--chart-4))",
	},
	other: {
		label: "Other",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const cliVersionConfig = {
	latest: {
		label: "Latest",
		color: "hsl(var(--chart-1))",
	},
	outdated: {
		label: "Outdated",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const authConfig = {
	enabled: {
		label: "Enabled",
		color: "hsl(var(--chart-1))",
	},
	disabled: {
		label: "Disabled",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const gitConfig = {
	enabled: {
		label: "Git Initialized",
		color: "hsl(var(--chart-1))",
	},
	disabled: {
		label: "No Git",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const installConfig = {
	enabled: {
		label: "Auto Install",
		color: "hsl(var(--chart-1))",
	},
	disabled: {
		label: "Skip Install",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const examplesConfig = {
	todo: {
		label: "Todo App",
		color: "hsl(var(--chart-1))",
	},
	ai: {
		label: "AI Example",
		color: "hsl(var(--chart-2))",
	},
	none: {
		label: "No Examples",
		color: "hsl(var(--chart-6))",
	},
} satisfies ChartConfig;

const addonsConfig = {
	pwa: {
		label: "PWA",
		color: "hsl(var(--chart-1))",
	},
	biome: {
		label: "Biome",
		color: "hsl(var(--chart-2))",
	},
	husky: {
		label: "Husky",
		color: "hsl(var(--chart-3))",
	},
	turborepo: {
		label: "Turborepo",
		color: "hsl(var(--chart-4))",
	},
	tauri: {
		label: "Tauri",
		color: "hsl(var(--chart-5))",
	},
	starlight: {
		label: "Starlight",
		color: "hsl(var(--chart-6))",
	},
	none: {
		label: "No Addons",
		color: "hsl(var(--chart-7))",
	},
} satisfies ChartConfig;

export default function AnalyticsPage() {
	const [data, setData] = useState<AnalyticsData[]>([]);
	const [lastUpdated, setLastUpdated] = useState<string | null>(null);
	const [loadingLastUpdated, setLoadingLastUpdated] = useState(true);

	const loadCSVData = useCallback(async () => {
		try {
			const response = await fetch("/export.csv");
			const csvText = await response.text();

			Papa.parse(csvText, {
				header: true,
				complete: (results) => {
					try {
						const parsedData = (results.data as Record<string, string>[])
							.map((row) => {
								const timestamp =
									row["*.timestamp"] || new Date().toISOString();
								const date = timestamp.includes("T")
									? timestamp.split("T")[0]
									: timestamp.split(" ")[0];

								const addons = [
									row["*.properties.addons.0"],
									row["*.properties.addons.1"],
									row["*.properties.addons.2"],
									row["*.properties.addons.3"],
									row["*.properties.addons.4"],
									row["*.properties.addons.5"],
								].filter(Boolean);

								return {
									date,
									cli_version: row["*.properties.cli_version"] || "unknown",
									node_version: row["*.properties.node_version"] || "unknown",
									platform: row["*.properties.platform"] || "unknown",
									backend: row["*.properties.backend"] || "none",
									database: row["*.properties.database"] || "none",
									auth:
										row["*.properties.auth"] === "True"
											? "enabled"
											: "disabled",
									api: row["*.properties.api"] || "none",
									packageManager:
										row["*.properties.packageManager"] || "unknown",
									frontend0: row["*.properties.frontend.0"] || "",
									frontend1: row["*.properties.frontend.1"] || "",
									examples0: row["*.properties.examples.0"] || "",
									examples1: row["*.properties.examples.1"] || "",
									addons,
									git:
										row["*.properties.git"] === "True" ? "enabled" : "disabled",
									install:
										row["*.properties.install"] === "True"
											? "enabled"
											: "disabled",
								};
							})
							.filter((item): item is AnalyticsData =>
								Boolean(item.date && item.platform !== "unknown"),
							);

						if (parsedData.length > 0) {
							setData(parsedData);
							console.log(`Loaded ${parsedData.length} records from CSV`);
						}
					} catch (error: unknown) {
						console.error("Error parsing CSV:", error);
					}
				},
				error: (error: unknown) => {
					console.error("Papa Parse error:", error);
				},
			});
		} catch (error: unknown) {
			console.error("Error loading CSV:", error);
		}
	}, []);

	const fetchLastUpdated = useCallback(async () => {
		try {
			const response = await fetch("/export.csv");
			const csvText = await response.text();
			const lines = csvText.split("\n");
			const timestampColumn = lines[0]
				.split(",")
				.findIndex((header) => header.includes("timestamp"));

			if (timestampColumn !== -1) {
				const timestamps = lines
					.slice(1)
					.filter((line) => line.trim())
					.map((line) => {
						const columns = line.split(",");
						return columns[timestampColumn]?.replace(/"/g, "");
					})
					.filter(Boolean)
					.map((timestamp) => new Date(timestamp))
					.filter((date) => !Number.isNaN(date.getTime()));

				if (timestamps.length > 0) {
					const mostRecentDate = new Date(
						Math.max(...timestamps.map((d) => d.getTime())),
					);
					setLastUpdated(
						mostRecentDate.toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
							timeZone: "UTC",
						}),
					);
				} else {
					setLastUpdated("NO_DATA_FOUND");
				}
			} else {
				setLastUpdated("TIMESTAMP_COLUMN_NOT_FOUND");
			}
		} catch (error) {
			console.error("Error fetching last updated date:", error);
			setLastUpdated("ERROR_PARSING_CSV");
		} finally {
			setLoadingLastUpdated(false);
		}
	}, []);

	useEffect(() => {
		loadCSVData();
		fetchLastUpdated();
	}, [loadCSVData, fetchLastUpdated]);

	const getPlatformData = () => {
		const platformCounts = data.reduce(
			(acc, item) => {
				const platform = item.platform;
				acc[platform] = (acc[platform] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(platformCounts).map(([name, value]) => ({
			name,
			value,
		}));
	};

	const getPackageManagerData = () => {
		const packageManagerCounts = data.reduce(
			(acc, item) => {
				const pm = item.packageManager;
				acc[pm] = (acc[pm] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(packageManagerCounts).map(([name, value]) => ({
			name,
			value,
		}));
	};

	const getBackendData = () => {
		const backendCounts = data.reduce(
			(acc, item) => {
				const backend = item.backend || "none";
				acc[backend] = (acc[backend] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(backendCounts)
			.map(([name, value]) => ({
				name,
				value,
			}))
			.sort((a, b) => b.value - a.value);
	};

	const getDatabaseData = () => {
		const databaseCounts = data.reduce(
			(acc, item) => {
				const database = item.database || "none";
				acc[database] = (acc[database] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(databaseCounts)
			.map(([name, value]) => ({
				name,
				value,
			}))
			.sort((a, b) => b.value - a.value);
	};

	const getAPIData = () => {
		const apiCounts = data.reduce(
			(acc, item) => {
				const api = item.api || "none";
				acc[api] = (acc[api] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(apiCounts)
			.map(([name, value]) => ({
				name,
				value,
			}))
			.sort((a, b) => b.value - a.value);
	};

	const getFrontendData = () => {
		const frontendCounts = data.reduce(
			(acc, item) => {
				const frontend = item.frontend0 || item.frontend1 || "none";
				if (frontend && frontend !== "none") {
					acc[frontend] = (acc[frontend] || 0) + 1;
				}
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(frontendCounts)
			.map(([name, value]) => ({
				name,
				value,
			}))
			.sort((a, b) => b.value - a.value);
	};

	const getTimeSeriesData = () => {
		if (data.length === 0) return [];

		const dates = data
			.map((item) => item.date)
			.filter(Boolean)
			.sort();
		if (dates.length === 0) return [];

		const startDate = new Date(dates[0]);
		const endDate = new Date(dates[dates.length - 1]);
		const today = new Date();

		const actualEndDate = endDate > today ? today : endDate;
		const daysDiff = Math.ceil(
			(actualEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		const maxDays = 60;

		let finalStartDate = startDate;
		if (daysDiff > maxDays) {
			finalStartDate = new Date(
				actualEndDate.getTime() - maxDays * 24 * 60 * 60 * 1000,
			);
		}

		const dateRange = [];
		const currentDate = new Date(finalStartDate);
		while (currentDate <= actualEndDate) {
			dateRange.push(format(currentDate, "yyyy-MM-dd"));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		const dailyCounts = data.reduce(
			(acc, item) => {
				acc[item.date] = (acc[item.date] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return dateRange.map((date) => ({
			date,
			displayDate: format(parseISO(date), "MMM dd"),
			count: dailyCounts[date] || 0,
		}));
	};

	const getNodeVersionData = () => {
		const versionCounts = data.reduce(
			(acc, item) => {
				const version = item.node_version.replace(/^v/, "").split(".")[0];
				acc[version] = (acc[version] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(versionCounts)
			.map(([version, count]) => ({
				version,
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);
	};

	const getCLIVersionData = () => {
		const versionCounts = data.reduce(
			(acc, item) => {
				const version = item.cli_version || "unknown";
				acc[version] = (acc[version] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(versionCounts)
			.map(([version, count]) => ({
				version,
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 8);
	};

	const getAuthData = () => {
		const authCounts = data.reduce(
			(acc, item) => {
				const auth = item.auth || "disabled";
				acc[auth] = (acc[auth] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(authCounts).map(([name, value]) => ({
			name,
			value,
		}));
	};

	const getGitData = () => {
		const gitCounts = data.reduce(
			(acc, item) => {
				const git = item.git || "disabled";
				acc[git] = (acc[git] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(gitCounts).map(([name, value]) => ({
			name,
			value,
		}));
	};

	const getInstallData = () => {
		const installCounts = data.reduce(
			(acc, item) => {
				const install = item.install || "disabled";
				acc[install] = (acc[install] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(installCounts).map(([name, value]) => ({
			name,
			value,
		}));
	};

	const getExamplesData = () => {
		const exampleCounts = data.reduce(
			(acc, item) => {
				const examples = [item.examples0, item.examples1].filter(Boolean);
				if (examples.length === 0) {
					acc.none = (acc.none || 0) + 1;
				} else {
					for (const example of examples) {
						acc[example] = (acc[example] || 0) + 1;
					}
				}
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(exampleCounts)
			.map(([name, value]) => ({
				name,
				value,
			}))
			.sort((a, b) => b.value - a.value);
	};

	const getAddonsData = () => {
		const addonCounts = data.reduce(
			(acc, item) => {
				if (!item.addons || item.addons.length === 0) {
					acc.none = (acc.none || 0) + 1;
				} else {
					for (const addon of item.addons) {
						if (addon) {
							acc[addon] = (acc[addon] || 0) + 1;
						}
					}
				}
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(addonCounts)
			.map(([name, value]) => ({
				name,
				value,
			}))
			.sort((a, b) => b.value - a.value);
	};

	const totalProjects = data.length;
	const getAvgProjectsPerDay = () => {
		if (data.length === 0) return 0;
		const dates = data.map((item) => item.date).filter(Boolean);
		if (dates.length === 0) return 0;

		const uniqueDates = new Set(dates);
		const daysCovered = uniqueDates.size;
		return daysCovered > 0 ? totalProjects / daysCovered : 0;
	};

	const avgProjectsPerDay = getAvgProjectsPerDay();
	const authEnabledPercent =
		totalProjects > 0
			? Math.round(
					(data.filter((d) => d.auth === "enabled").length / totalProjects) *
						100,
				)
			: 0;

	const frontendData = getFrontendData();
	const backendData = getBackendData();
	const mostPopularFrontend =
		frontendData.length > 0 ? frontendData[0].name : "None";
	const mostPopularBackend =
		backendData.length > 0 ? backendData[0].name : "None";

	return (
		<div className="terminal-scanlines min-h-screen bg-background font-mono">
			<Navbar />
			<div className="terminal-matrix-bg container mx-auto max-w-7xl space-y-8 px-4 py-8 pt-28">
				<div className="mb-8">
					<div className="mb-6 flex items-center gap-2">
						<Terminal className="h-5 w-5 text-primary" />
						<span className="font-bold font-mono text-xl">
							ANALYTICS_DASHBOARD.EXE
						</span>
						<div className="h-px flex-1 bg-border" />
						<span className="font-mono text-muted-foreground text-xs">
							[{totalProjects} PROJECTS_ANALYZED]
						</span>
					</div>

					<div className="terminal-block-hover rounded border border-border bg-muted/20 p-4">
						<div className="flex items-center gap-2 text-sm">
							<span className="text-primary">$</span>
							<span className="font-mono text-foreground">
								# Analytics from Better-T-Stack CLI usage data
							</span>
						</div>
						<div className="mt-2 flex items-center gap-2 text-sm">
							<span className="text-primary">$</span>
							<span className="font-mono text-muted-foreground">
								# Uses PostHog - no personal info tracked, runs on each project
								creation
							</span>
						</div>
						<div className="mt-2 flex items-center gap-2 text-sm">
							<span className="text-primary">$</span>
							<span className="font-mono text-muted-foreground">
								# Source:{" "}
								<Link
									href="https://github.com/amanvarshney01/create-better-t-stack/blob/main/apps/cli/src/utils/analytics.ts"
									target="_blank"
									rel="noopener noreferrer"
									className="text-accent underline hover:text-primary"
								>
									analytics.ts
								</Link>
								{" | "}
								<Link
									href="https://github.com/amanvarshney01/create-better-t-stack/blob/main/apps/web/public/export.csv"
									target="_blank"
									rel="noopener noreferrer"
									className="text-accent underline hover:text-primary"
								>
									export.csv
								</Link>
							</span>
						</div>
						<div className="mt-2 flex items-center gap-2 text-sm">
							<span className="text-primary">$</span>
							<span className="font-mono text-muted-foreground">
								# Last updated:{" "}
								{loadingLastUpdated
									? "CHECKING..."
									: lastUpdated
										? `${lastUpdated} UTC`
										: "UNKNOWN"}
							</span>
						</div>
					</div>

					<Link
						href="https://discord.com/invite/tMunxM5R"
						target="_blank"
						rel="noopener noreferrer"
						className="terminal-block-hover block rounded border border-border bg-background transition-colors hover:bg-accent/10"
					>
						<div className="flex items-center justify-between p-3">
							<div className="flex items-center gap-3">
								<Image src={discordLogo} alt="discord" className="h-4 w-4" />
								<div>
									<span className="font-mono font-semibold text-sm">
										DISCORD_NOTIFICATIONS.IRC
									</span>
									<p className="font-mono text-muted-foreground text-xs">
										Join for LIVE project creation alerts
									</p>
								</div>
							</div>
							<div className="flex items-center gap-1 rounded border border-border bg-primary/10 px-2 py-1">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-primary text-xs">
									JOIN
								</span>
							</div>
						</div>
					</Link>
				</div>

				<div className="space-y-4">
					<div className="mb-4 flex items-center gap-2">
						<span className="font-bold font-mono text-lg">
							SYSTEM_METRICS.LOG
						</span>
						<div className="h-px flex-1 bg-border" />
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center justify-between">
									<span className="font-mono font-semibold text-sm">
										TOTAL_PROJECTS
									</span>
									<Terminal className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="font-bold font-mono text-2xl text-primary">
									{totalProjects.toLocaleString()}
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									$ ./create-better-t-stack executions
								</p>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center justify-between">
									<span className="font-mono font-semibold text-sm">
										TOP_FRONTEND
									</span>
									<Cpu className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold font-mono text-accent text-lg">
									{mostPopularFrontend}
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									$ most_selected_frontend.sh
								</p>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center justify-between">
									<span className="font-mono font-semibold text-sm">
										TOP_BACKEND
									</span>
									<Terminal className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold font-mono text-accent text-lg">
									{mostPopularBackend}
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									$ most_selected_backend.sh
								</p>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center justify-between">
									<span className="font-mono font-semibold text-sm">
										TOP_DATABASE
									</span>
									<Download className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold font-mono text-accent text-lg">
									{getDatabaseData().length > 0
										? getDatabaseData()[0].name
										: "None"}
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									$ most_selected_database.sh
								</p>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center justify-between">
									<span className="font-mono font-semibold text-sm">
										TOP_API
									</span>
									<TrendingUp className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold font-mono text-accent text-lg">
									{getAPIData().length > 0 ? getAPIData()[0].name : "None"}
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									$ most_selected_api.sh
								</p>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center justify-between">
									<span className="font-mono font-semibold text-sm">
										AUTH_ADOPTION
									</span>
									<Users className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="font-bold font-mono text-2xl text-primary">
									{authEnabledPercent}%
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									$ auth_enabled_percentage.sh
								</p>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center justify-between">
									<span className="font-mono font-semibold text-sm">
										TOP_PKG_MGR
									</span>
									<Terminal className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="truncate font-bold font-mono text-accent text-lg">
									{getPackageManagerData().length > 0
										? getPackageManagerData()[0].name
										: "npm"}
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									$ most_used_package_manager.sh
								</p>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center justify-between">
									<span className="font-mono font-semibold text-sm">
										AVG_DAILY
									</span>
									<TrendingUp className="h-4 w-4 text-primary" />
								</div>
							</div>
							<div className="p-4">
								<div className="font-bold font-mono text-2xl text-primary">
									{avgProjectsPerDay.toFixed(1)}
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									$ average_projects_per_day.sh
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="mb-4 flex items-center gap-2">
						<span className="font-bold font-mono text-lg">
							TIMELINE_ANALYSIS.CHARTS
						</span>
						<div className="h-px flex-1 bg-border" />
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										PROJECT_TIMELINE.CHART
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Daily project creation timeline from actual data
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={timeSeriesConfig}
									className="h-[300px] w-full"
								>
									<AreaChart data={getTimeSeriesData()}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="displayDate" />
										<YAxis />
										<ChartTooltip
											content={<ChartTooltipContent />}
											labelFormatter={(value, payload) => {
												const date = payload?.[0]?.payload?.date;
												return date
													? format(parseISO(date), "MMM dd, yyyy")
													: value;
											}}
										/>
										<Area
											type="monotone"
											dataKey="count"
											stroke="var(--color-projects)"
											fill="var(--color-projects)"
											fillOpacity={0.2}
										/>
									</AreaChart>
								</ChartContainer>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										PLATFORM_DISTRIBUTION.PIE
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Operating system distribution
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={platformConfig}
									className="h-[300px] w-full"
								>
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getPlatformData()}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
											outerRadius={80}
											fill="var(--color-platform)"
											dataKey="value"
										>
											{getPlatformData().map((entry) => (
												<Cell
													key={entry.name}
													fill={`var(--color-${entry.name})`}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="mb-4 flex items-center gap-2">
						<span className="font-bold font-mono text-lg">
							STACK_CONFIGURATION.DB
						</span>
						<div className="h-px flex-1 bg-border" />
						<span className="font-mono text-muted-foreground text-xs">
							[CORE_COMPONENTS]
						</span>
					</div>

					<div className="terminal-block-hover rounded border border-border bg-background">
						<div className="border-border border-b bg-muted/20 px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-sm">
									FRONTEND_FRAMEWORKS.BAR
								</span>
							</div>
							<p className="mt-1 font-mono text-muted-foreground text-xs">
								# Frontend framework and meta-framework usage (Step 1)
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={frontendConfig}
								className="h-[300px] w-full"
							>
								<BarChart data={getFrontendData()}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className="font-mono text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="value" radius={4}>
										{getFrontendData().map((entry) => (
											<Cell
												key={`frontend-${entry.name}`}
												fill={`var(--color-${entry.name})`}
											/>
										))}
									</Bar>
								</BarChart>
							</ChartContainer>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										BACKEND_FRAMEWORKS.BAR
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Backend framework distribution (Step 2)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={backendConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getBackendData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="value" radius={4}>
											{getBackendData().map((entry) => (
												<Cell
													key={`backend-${entry.name}`}
													fill={`var(--color-${entry.name})`}
												/>
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										DATABASE_DISTRIBUTION.BAR
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Database technology distribution (Step 4)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={databaseConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getDatabaseData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="value" radius={4}>
											{getDatabaseData().map((entry) => (
												<Cell
													key={`database-${entry.name}`}
													fill={`var(--color-${entry.name})`}
												/>
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										API_LAYER.PIE
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# API layer technology distribution (Step 6)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer config={apiConfig} className="h-[300px] w-full">
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getAPIData()}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
										>
											{getAPIData().map((entry) => (
												<Cell
													key={`api-${entry.name}`}
													fill={`var(--color-${entry.name})`}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										AUTH_ADOPTION.PIE
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Authentication implementation rate (Step 7)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={authConfig}
									className="h-[300px] w-full"
								>
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getAuthData()}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{getAuthData().map((entry) => (
												<Cell
													key={`auth-${entry.name}`}
													fill={`var(--color-${entry.name})`}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>
					</div>

					<div className="terminal-block-hover rounded border border-border bg-background">
						<div className="border-border border-b bg-muted/20 px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-sm">
									ADDONS_USAGE.BAR
								</span>
							</div>
							<p className="mt-1 font-mono text-muted-foreground text-xs">
								# Additional features and tooling adoption (Step 8)
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={addonsConfig}
								className="h-[300px] w-full"
							>
								<BarChart data={getAddonsData()}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className="font-mono text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="value" radius={4}>
										{getAddonsData().map((entry) => (
											<Cell
												key={`addons-${entry.name}`}
												fill={`var(--color-${entry.name})`}
											/>
										))}
									</Bar>
								</BarChart>
							</ChartContainer>
						</div>
					</div>

					<div className="terminal-block-hover rounded border border-border bg-background">
						<div className="border-border border-b bg-muted/20 px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-sm">
									EXAMPLES_USAGE.BAR
								</span>
							</div>
							<p className="mt-1 font-mono text-muted-foreground text-xs">
								# Example applications included in projects (Step 9)
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={examplesConfig}
								className="h-[300px] w-full"
							>
								<BarChart data={getExamplesData()}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className="font-mono text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="value" radius={4}>
										{getExamplesData().map((entry) => (
											<Cell
												key={`examples-${entry.name}`}
												fill={`var(--color-${entry.name})`}
											/>
										))}
									</Bar>
								</BarChart>
							</ChartContainer>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="mb-4 flex items-center gap-2">
						<span className="font-bold font-mono text-lg">
							DEV_ENVIRONMENT.CONFIG
						</span>
						<div className="h-px flex-1 bg-border" />
						<span className="font-mono text-muted-foreground text-xs">
							[TOOLING_PREFERENCES]
						</span>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										GIT_INITIALIZATION.PIE
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Git repository initialization rate (Step 11)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer config={gitConfig} className="h-[300px] w-full">
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getGitData()}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{getGitData().map((entry) => (
												<Cell
													key={`git-${entry.name}`}
													fill={`var(--color-${entry.name})`}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										PACKAGE_MANAGER.BAR
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Package manager usage distribution (Step 12)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={packageManagerConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getPackageManagerData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="name"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<YAxis />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="value" radius={4}>
											{getPackageManagerData().map((entry) => (
												<Cell
													key={`package-${entry.name}`}
													fill={`var(--color-${entry.name})`}
												/>
											))}
										</Bar>
									</BarChart>
								</ChartContainer>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										INSTALL_PREFERENCE.PIE
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Automatic dependency installation preference (Step 13)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={installConfig}
									className="h-[300px] w-full"
								>
									<PieChart>
										<ChartTooltip
											content={<ChartTooltipContent nameKey="name" />}
										/>
										<Pie
											data={getInstallData()}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{getInstallData().map((entry) => (
												<Cell
													key={`install-${entry.name}`}
													fill={`var(--color-${entry.name})`}
												/>
											))}
										</Pie>
										<ChartLegend content={<ChartLegendContent />} />
									</PieChart>
								</ChartContainer>
							</div>
						</div>

						<div className="terminal-block-hover rounded border border-border bg-background">
							<div className="border-border border-b bg-muted/20 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="text-primary text-xs">▶</span>
									<span className="font-mono font-semibold text-sm">
										NODE_VERSIONS.BAR
									</span>
								</div>
								<p className="mt-1 font-mono text-muted-foreground text-xs">
									# Node.js version distribution (major versions)
								</p>
							</div>
							<div className="p-4">
								<ChartContainer
									config={nodeVersionConfig}
									className="h-[300px] w-full"
								>
									<BarChart data={getNodeVersionData()}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="version"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											className="font-mono text-xs"
										/>
										<YAxis hide />
										<ChartTooltip content={<ChartTooltipContent />} />
										<Bar dataKey="count" radius={4} fill="var(--color-18)" />
									</BarChart>
								</ChartContainer>
							</div>
						</div>
					</div>

					<div className="terminal-block-hover rounded border border-border bg-background">
						<div className="border-border border-b bg-muted/20 px-4 py-3">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-sm">
									CLI_VERSIONS.BAR
								</span>
							</div>
							<p className="mt-1 font-mono text-muted-foreground text-xs">
								# CLI version distribution across project creations
							</p>
						</div>
						<div className="p-4">
							<ChartContainer
								config={cliVersionConfig}
								className="h-[300px] w-full"
							>
								<BarChart data={getCLIVersionData()}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="version"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										className="font-mono text-xs"
									/>
									<YAxis hide />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="count" radius={4} fill="var(--color-latest)" />
								</BarChart>
							</ChartContainer>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
