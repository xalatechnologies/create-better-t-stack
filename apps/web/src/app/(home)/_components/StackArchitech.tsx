"use client";

import {
	DEFAULT_STACK,
	PRESET_TEMPLATES,
	type StackState,
	TECH_OPTIONS,
} from "@/lib/constant";
import {
	Check,
	Circle,
	CircleCheck,
	ClipboardCopy,
	HelpCircle,
	InfoIcon,
	Maximize2,
	RefreshCw,
	Settings,
	Star,
	Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const validateProjectName = (name: string): string | undefined => {
	const INVALID_CHARS = ["<", ">", ":", '"', "|", "?", "*"];
	const MAX_LENGTH = 255;

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
	if (
		name.toLowerCase() === "node_modules" ||
		name.toLowerCase() === "favicon.ico"
	) {
		return "Project name is reserved";
	}
	return undefined;
};

const StackArchitect = ({
	fullscreen = false,
}: {
	fullscreen?: boolean;
}) => {
	const [stack, setStack] = useState<StackState>(DEFAULT_STACK);
	const [command, setCommand] = useState(
		"npx create-better-t-stack@latest my-better-t-app --yes",
	);
	const [activeTab, setActiveTab] = useState("frontend");
	const [copied, setCopied] = useState(false);
	const [compatNotes, setCompatNotes] = useState<Record<string, string[]>>({});
	const [projectNameError, setProjectNameError] = useState<string | undefined>(
		undefined,
	);
	const [showPresets, setShowPresets] = useState(false);
	const [showHelp, setShowHelp] = useState(false);
	const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);

	const hasNativeFrontend = useMemo(
		() => stack.frontend.includes("native"),
		[stack.frontend],
	);
	const hasWebFrontend = useMemo(
		() =>
			stack.frontend.some((f) =>
				["tanstack-router", "react-router", "tanstack-start", "next"].includes(
					f,
				),
			),
		[stack.frontend],
	);
	const hasPWACompatibleFrontend = useMemo(
		() =>
			stack.frontend.some((f) =>
				["tanstack-router", "react-router"].includes(f),
			),
		[stack.frontend],
	);

	useEffect(() => {
		const savedStack = localStorage.getItem("betterTStackPreference");
		if (savedStack) {
			try {
				const parsedStack = JSON.parse(savedStack);
				setLastSavedStack(parsedStack);
			} catch (e) {
				console.error("Failed to parse saved stack", e);
			}
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally managing complex dependencies
	useEffect(() => {
		let changed = false;
		const nextStack = { ...stack };
		const originalAuth = stack.auth;

		if (nextStack.database === "none") {
			if (nextStack.orm !== "none") {
				nextStack.orm = "none";
				changed = true;
			}
			if (nextStack.auth === "true") {
				nextStack.auth = "false";
				changed = true;
			}
			if (nextStack.dbSetup !== "none") {
				nextStack.dbSetup = "none";
				changed = true;
			}
		} else {
			if (
				nextStack.auth === "false" &&
				(hasWebFrontend || hasNativeFrontend) &&
				originalAuth === "false"
			) {
			}
		}

		if (nextStack.database === "mongodb" && nextStack.orm === "drizzle") {
			nextStack.orm = "prisma";
			changed = true;
		}

		if (nextStack.dbSetup === "turso") {
			if (nextStack.database !== "sqlite") {
				nextStack.database = "sqlite";
				changed = true;
			}
			if (nextStack.orm === "prisma") {
				nextStack.orm = "drizzle";
				changed = true;
			}
		} else if (nextStack.dbSetup === "prisma-postgres") {
			if (nextStack.database !== "postgres") {
				nextStack.database = "postgres";
				changed = true;
			}
			if (nextStack.orm !== "prisma") {
				nextStack.orm = "prisma";
				changed = true;
			}
		} else if (nextStack.dbSetup === "mongodb-atlas") {
			if (nextStack.database !== "mongodb") {
				nextStack.database = "mongodb";
				changed = true;
			}
			if (nextStack.orm !== "prisma") {
				nextStack.orm = "prisma";
				changed = true;
			}
		} else if (nextStack.dbSetup === "neon") {
			if (nextStack.database !== "postgres") {
				nextStack.database = "postgres";
				changed = true;
			}
		}

		if (changed) {
			setStack((currentStack) => ({
				...currentStack,
				database: nextStack.database,
				orm: nextStack.orm,
				auth: nextStack.auth,
				dbSetup: nextStack.dbSetup,
			}));
		}
	}, [
		stack.database,
		stack.orm,
		stack.dbSetup,
		stack.auth,
		hasWebFrontend,
		hasNativeFrontend,
	]);

	useEffect(() => {
		let addonsChanged = false;
		let examplesChanged = false;
		let apiChanged = false;

		const currentAddons = stack.addons;
		const currentExamples = stack.examples;
		const currentApi = stack.api;
		const currentBackend = stack.backendFramework;

		let nextAddons = [...currentAddons];
		let nextExamples = [...currentExamples];
		let nextApi = currentApi;

		if (!hasPWACompatibleFrontend) {
			const incompatibleAddons = ["pwa", "tauri"];
			const originalLength = nextAddons.length;
			nextAddons = nextAddons.filter(
				(addon) => !incompatibleAddons.includes(addon),
			);
			if (nextAddons.length !== originalLength) {
				addonsChanged = true;
			}
		}

		if (!hasWebFrontend) {
			const incompatibleExamples = ["todo", "ai"];
			const originalLength = nextExamples.length;
			nextExamples = nextExamples.filter(
				(example) => !incompatibleExamples.includes(example),
			);
			if (nextExamples.length !== originalLength) {
				examplesChanged = true;
			}
		}

		if (currentBackend === "elysia") {
			const originalLength = nextExamples.length;
			nextExamples = nextExamples.filter((example) => example !== "ai");
			if (nextExamples.length !== originalLength) {
				examplesChanged = true;
			}
		}

		if (hasNativeFrontend && currentApi !== "trpc") {
			nextApi = "trpc";
			apiChanged = true;
		}

		if (addonsChanged || examplesChanged || apiChanged) {
			setStack((prev) => ({
				...prev,
				addons: addonsChanged ? nextAddons : prev.addons,
				examples: examplesChanged ? nextExamples : prev.examples,
				api: apiChanged ? nextApi : prev.api,
			}));
		}
	}, [
		stack.addons,
		stack.examples,
		stack.api,
		stack.backendFramework,
		hasPWACompatibleFrontend,
		hasWebFrontend,
		hasNativeFrontend,
	]);

	const generateCommand = useCallback((stackState: StackState) => {
		let base: string;
		if (stackState.packageManager === "npm") {
			base = "npx create-better-t-stack@latest";
		} else if (stackState.packageManager === "pnpm") {
			base = "pnpm create better-t-stack@latest";
		} else {
			base = "bun create better-t-stack@latest";
		}

		const projectName = stackState.projectName || "my-better-t-app";
		const flags: string[] = ["--yes"];

		if (
			stackState.frontend.length === 0 ||
			(stackState.frontend.length === 1 && stackState.frontend[0] === "none")
		) {
			flags.push("--frontend none");
		} else if (
			!(
				stackState.frontend.length === 1 &&
				stackState.frontend[0] === "tanstack-router"
			)
		) {
			flags.push(`--frontend ${stackState.frontend.join(" ")}`);
		}

		if (stackState.database !== "sqlite") {
			flags.push(`--database ${stackState.database}`);
		}

		if (stackState.database !== "none" && stackState.orm !== "drizzle") {
			flags.push(`--orm ${stackState.orm}`);
		}

		if (stackState.auth === "false") {
			flags.push("--no-auth");
		}

		if (stackState.dbSetup !== "none") {
			flags.push(`--db-setup ${stackState.dbSetup}`);
		}

		if (stackState.backendFramework !== "hono") {
			flags.push(`--backend ${stackState.backendFramework}`);
		}

		if (stackState.runtime !== "bun") {
			flags.push(`--runtime ${stackState.runtime}`);
		}

		if (stackState.packageManager !== "bun") {
			flags.push(`--package-manager ${stackState.packageManager}`);
		}

		if (stackState.git === "false") {
			flags.push("--no-git");
		}

		if (stackState.install === "false") {
			flags.push("--no-install");
		}

		if (stackState.addons.length > 0) {
			flags.push(`--addons ${stackState.addons.join(" ")}`);
		}

		if (stackState.examples.length > 0) {
			flags.push(`--examples ${stackState.examples.join(" ")}`);
		}

		if (stackState.api && stackState.api !== "trpc") {
			flags.push(`--api ${stackState.api}`);
		}

		return `${base} ${projectName} ${flags.join(" ")}`;
	}, []);

	useEffect(() => {
		const cmd = generateCommand(stack);
		setCommand(cmd);

		const notes: Record<string, string[]> = {};

		notes.frontend = [];
		if (stack.frontend.includes("native") && stack.frontend.length > 1) {
			notes.frontend.push(
				"When using React Native alongside a web frontend, only the tRPC API option is available.",
			);
		}

		notes.dbSetup = [];
		if (stack.database === "none") {
			notes.dbSetup.push("Database setup requires a database to be selected.");
		} else {
			if (stack.dbSetup === "turso") {
				if (stack.database !== "sqlite") {
					notes.dbSetup.push("Turso setup requires the SQLite database.");
				}
				if (stack.orm === "prisma") {
					notes.dbSetup.push("Turso is not compatible with the Prisma ORM.");
				}
			} else if (stack.dbSetup === "prisma-postgres") {
				if (stack.database !== "postgres") {
					notes.dbSetup.push(
						"Prisma PostgreSQL setup requires the PostgreSQL database.",
					);
				}
				if (stack.orm !== "prisma") {
					notes.dbSetup.push(
						"Prisma PostgreSQL setup requires the Prisma ORM.",
					);
				}
			} else if (stack.dbSetup === "mongodb-atlas") {
				if (stack.database !== "mongodb") {
					notes.dbSetup.push(
						"MongoDB Atlas setup requires the MongoDB database.",
					);
				}

				if (stack.orm !== "prisma") {
					notes.dbSetup.push(
						"MongoDB Atlas setup requires the Prisma ORM (implicitly selected).",
					);
				}
			} else if (stack.dbSetup === "neon") {
				if (stack.database !== "postgres") {
					notes.dbSetup.push("Neon setup requires the PostgreSQL database.");
				}
			}
		}

		notes.addons = [];
		if (!hasPWACompatibleFrontend) {
			notes.addons.push(
				"PWA and Tauri addons require TanStack Router or React Router.",
			);
		}
		if (stack.addons.includes("husky") && !stack.addons.includes("biome")) {
			notes.addons.push(
				"Husky addon automatically enables Biome for lint-staged.",
			);
		}

		notes.database = [];
		if (stack.database === "mongodb" && stack.orm === "drizzle") {
			notes.database.push("MongoDB is only compatible with the Prisma ORM.");
		}
		if (stack.dbSetup !== "none") {
			notes.database.push(
				`Changing the database might reset the '${TECH_OPTIONS.dbSetup.find((db) => db.id === stack.dbSetup)?.name}' setup if it becomes incompatible.`,
			);
		}

		notes.orm = [];
		if (stack.database === "none") {
			notes.orm.push("ORM options require a database to be selected.");
		} else if (stack.database === "mongodb" && stack.orm === "drizzle") {
			notes.orm.push("MongoDB is only compatible with the Prisma ORM.");
		} else if (
			stack.database === "sqlite" &&
			stack.orm === "prisma" &&
			stack.dbSetup === "turso"
		) {
			notes.orm.push("Prisma ORM is not compatible with the Turso DB setup.");
		}

		notes.auth = [];
		if (stack.database === "none") {
			notes.auth.push("Authentication requires a database.");
		}

		notes.examples = [];
		if (!hasWebFrontend) {
			notes.examples.push(
				"Todo and AI examples require a web frontend (TanStack Router, React Router, TanStack Start, or Next.js).",
			);
		}
		if (stack.backendFramework === "elysia" && stack.examples.includes("ai")) {
			notes.examples.push(
				"The AI example is currently only compatible with the Hono backend.",
			);
		}

		notes.api = [];
		if (hasNativeFrontend && stack.api !== "trpc") {
			notes.api.push("React Native frontend requires the tRPC API option.");
		}

		setCompatNotes(notes);
	}, [
		stack,
		hasWebFrontend,
		hasPWACompatibleFrontend,
		hasNativeFrontend,
		generateCommand,
	]);

	const handleTechSelect = useCallback(
		(category: keyof typeof TECH_OPTIONS, techId: string) => {
			setStack((prev) => {
				const currentStack = { ...prev };

				if (category === "frontend") {
					const currentSelection = [...currentStack.frontend];
					const webTypes = [
						"tanstack-router",
						"react-router",
						"tanstack-start",
						"next",
					];

					if (techId === "none") {
						return { ...currentStack, frontend: ["none"] };
					}

					if (
						currentSelection.includes(techId) &&
						currentSelection.length === 1
					) {
						return prev;
					}

					let newSelection = [...currentSelection];

					if (newSelection.includes("none")) {
						newSelection = newSelection.filter((id) => id !== "none");
					}

					if (newSelection.includes(techId)) {
						newSelection = newSelection.filter((id) => id !== techId);

						if (newSelection.length === 0) {
						}
					} else {
						if (webTypes.includes(techId)) {
							newSelection = newSelection.filter(
								(id) => !webTypes.includes(id),
							);
						}
						newSelection.push(techId);
					}

					return { ...currentStack, frontend: newSelection };
				}

				if (category === "addons" || category === "examples") {
					const currentArray = [...(currentStack[category] || [])];
					const index = currentArray.indexOf(techId);
					const nextArray = [...currentArray];

					if (index >= 0) {
						nextArray.splice(index, 1);
						if (techId === "biome" && nextArray.includes("husky")) {
						}
					} else {
						if (category === "examples") {
							if (!hasWebFrontend && (techId === "todo" || techId === "ai"))
								return prev;
							if (techId === "ai" && currentStack.backendFramework === "elysia")
								return prev;
						}
						if (category === "addons") {
							if (
								!hasPWACompatibleFrontend &&
								(techId === "pwa" || techId === "tauri")
							)
								return prev;
							if (techId === "husky" && !nextArray.includes("biome")) {
								nextArray.push("biome");
							}
						}
						nextArray.push(techId);
					}
					return { ...currentStack, [category]: nextArray };
				}

				if (category === "database") {
					if (currentStack.database === techId) return prev;

					const updatedState: Partial<StackState> = { database: techId };
					const currentDbSetup = currentStack.dbSetup;

					let resetDbSetup = false;
					if (currentDbSetup === "turso" && techId !== "sqlite")
						resetDbSetup = true;
					if (currentDbSetup === "prisma-postgres" && techId !== "postgres")
						resetDbSetup = true;
					if (currentDbSetup === "mongodb-atlas" && techId !== "mongodb")
						resetDbSetup = true;
					if (currentDbSetup === "neon" && techId !== "postgres")
						resetDbSetup = true;
					if (techId === "none") resetDbSetup = true;

					if (resetDbSetup && currentDbSetup !== "none") {
						updatedState.dbSetup = "none";
					}

					if (techId === "none") {
						updatedState.orm = "none";
						updatedState.auth = "false";
					} else {
						if (prev.database === "none") {
							updatedState.orm = techId === "mongodb" ? "prisma" : "drizzle";
						} else {
							if (techId === "mongodb" && currentStack.orm === "drizzle") {
								updatedState.orm = "prisma";
							} else if (
								techId !== "mongodb" &&
								currentStack.orm === "prisma" &&
								currentDbSetup === "turso" &&
								techId === "sqlite"
							) {
							}
						}
					}

					return { ...currentStack, ...updatedState };
				}

				if (category === "orm") {
					if (currentStack.database === "none") return prev;
					if (currentStack.database === "mongodb" && techId === "drizzle")
						return prev;
					if (
						currentStack.database === "sqlite" &&
						techId === "prisma" &&
						currentStack.dbSetup === "turso"
					)
						return prev;

					if (currentStack.orm === techId) return prev;
					return { ...currentStack, orm: techId };
				}

				if (category === "dbSetup") {
					if (currentStack.database === "none" && techId !== "none")
						return prev;

					if (techId === "turso") {
						if (currentStack.database !== "sqlite") return prev;
						if (currentStack.orm === "prisma") return prev;
					} else if (techId === "prisma-postgres") {
						if (currentStack.database !== "postgres") return prev;
						if (currentStack.orm !== "prisma") return prev;
					} else if (techId === "mongodb-atlas") {
						if (currentStack.database !== "mongodb") return prev;
					} else if (techId === "neon") {
						if (currentStack.database !== "postgres") return prev;
					}

					if (currentStack.dbSetup === techId) return prev;
					return { ...currentStack, dbSetup: techId };
				}

				if (category === "auth") {
					if (currentStack.database === "none" && techId === "true")
						return prev;
					if (currentStack.auth === techId) return prev;
					return { ...currentStack, auth: techId };
				}

				if (category === "api") {
					if (hasNativeFrontend && techId !== "trpc") return prev;
					if (currentStack.api === techId) return prev;
					return { ...currentStack, api: techId };
				}

				if (
					category === "runtime" ||
					category === "backendFramework" ||
					category === "packageManager" ||
					category === "git" ||
					category === "install"
				) {
					if (currentStack[category] === techId) return prev;

					const updatedState: Partial<StackState> = { [category]: techId };
					if (category === "backendFramework" && techId === "elysia") {
						const currentExamples = currentStack.examples || [];
						if (currentExamples.includes("ai")) {
							updatedState.examples = currentExamples.filter(
								(ex) => ex !== "ai",
							);
						}
					} else if (category === "backendFramework" && techId === "hono") {
					}

					return { ...currentStack, ...updatedState };
				}

				return prev;
			});
		},
		[hasWebFrontend, hasPWACompatibleFrontend, hasNativeFrontend],
	);

	const copyToClipboard = useCallback(() => {
		navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [command]);

	const resetStack = useCallback(() => {
		setStack(DEFAULT_STACK);
		setActiveTab("frontend");
		setProjectNameError(undefined);
	}, []);

	const saveCurrentStack = useCallback(() => {
		localStorage.setItem("betterTStackPreference", JSON.stringify(stack));
		setLastSavedStack(stack);
		setCopied(false);
		const saveButton = document.getElementById("save-stack-button");
		const saveTextSpan = saveButton?.querySelector("span");

		if (saveButton && saveTextSpan) {
			const originalText = saveTextSpan.textContent;
			saveTextSpan.textContent = "Saved!";
			saveButton.classList.add("bg-green-200", "dark:bg-green-800/70");
			saveButton.classList.remove("bg-green-100", "dark:bg-green-900/50");

			setTimeout(() => {
				if (saveTextSpan.textContent === "Saved!") {
					saveTextSpan.textContent = originalText;
					saveButton.classList.remove("bg-green-200", "dark:bg-green-800/70");
					saveButton.classList.add("bg-green-100", "dark:bg-green-900/50");
				}
			}, 2000);
		}
	}, [stack]);

	const loadSavedStack = useCallback(() => {
		if (lastSavedStack) {
			setStack(lastSavedStack);
			setProjectNameError(
				validateProjectName(lastSavedStack.projectName || ""),
			);
			setActiveTab("frontend");
		}
	}, [lastSavedStack]);

	const applyPreset = useCallback((presetId: string) => {
		const preset = PRESET_TEMPLATES.find(
			(template) => template.id === presetId,
		);
		if (preset) {
			setStack(preset.stack);
			setProjectNameError(validateProjectName(preset.stack.projectName || ""));
			setShowPresets(false);
			setActiveTab("frontend");
		}
	}, []);

	const getDisabledReason = useCallback(
		(category: keyof typeof TECH_OPTIONS, techId: string): string | null => {
			if (category === "api" && techId !== "trpc" && hasNativeFrontend) {
				return "Only tRPC API is supported when React Native is selected.";
			}
			if (category === "orm") {
				if (stack.database === "none")
					return "Select a database to enable ORM options.";
				if (stack.database === "mongodb" && techId === "drizzle")
					return "MongoDB requires the Prisma ORM.";
				if (
					stack.database === "sqlite" &&
					techId === "prisma" &&
					stack.dbSetup === "turso"
				)
					return "Prisma ORM is not compatible with Turso DB setup (requires Drizzle).";
			}
			if (category === "dbSetup" && techId !== "none") {
				if (stack.database === "none")
					return "Select a database before choosing a cloud setup.";

				if (techId === "turso") {
					if (stack.database !== "sqlite")
						return "Turso requires SQLite database.";
					if (stack.orm === "prisma") return "Turso requires Drizzle ORM.";
				} else if (techId === "prisma-postgres") {
					if (stack.database !== "postgres")
						return "Requires PostgreSQL database.";
					if (stack.orm !== "prisma") return "Requires Prisma ORM.";
				} else if (techId === "mongodb-atlas") {
					if (stack.database !== "mongodb") return "Requires MongoDB database.";
				} else if (techId === "neon") {
					if (stack.database !== "postgres")
						return "Requires PostgreSQL database.";
				}
			}
			if (
				category === "auth" &&
				techId === "true" &&
				stack.database === "none"
			) {
				return "Authentication requires a database.";
			}
			if (category === "addons") {
				if (
					(techId === "pwa" || techId === "tauri") &&
					!hasPWACompatibleFrontend
				) {
					return "Requires TanStack Router or React Router frontend.";
				}
			}
			if (category === "examples") {
				if ((techId === "todo" || techId === "ai") && !hasWebFrontend) {
					return "Requires a web frontend (TanStack Router, React Router, etc.).";
				}
				if (techId === "ai" && stack.backendFramework === "elysia") {
					return "AI example is not compatible with Elysia backend.";
				}
			}

			return null;
		},
		[
			stack.database,
			stack.orm,
			stack.dbSetup,
			stack.backendFramework,
			hasNativeFrontend,
			hasPWACompatibleFrontend,
			hasWebFrontend,
		],
	);

	return (
		<div className={`mx-auto w-full ${fullscreen ? "h-full max-w-none" : ""}`}>
			<div
				className={`flex h-full flex-col overflow-hidden border-gray-300 bg-gray-100 text-gray-800 shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-white ${
					fullscreen ? "rounded-none border-0" : "rounded-xl border"
				}`}
			>
				<div
					className={`flex-shrink-0 items-center justify-between bg-gray-200 px-2 py-2 sm:px-4 dark:bg-gray-800 ${
						fullscreen ? "border-gray-300 border-b dark:border-gray-700" : ""
					}`}
				>
					<div className="flex items-center justify-between">
						<div className="flex space-x-2">
							<div className="h-3 w-3 rounded-full bg-red-500" />
							<div className="h-3 w-3 rounded-full bg-yellow-500" />
							<div className="h-3 w-3 rounded-full bg-green-500" />
						</div>

						<div className="hidden font-mono text-gray-600 text-xs sm:block dark:text-gray-400">
							Stack Architect Terminal
						</div>

						<div className="flex space-x-2">
							<button
								type="button"
								onClick={() => setShowHelp(!showHelp)}
								className="text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
								title="Help"
							>
								<HelpCircle className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => setShowPresets(!showPresets)}
								className="text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
								title="Presets"
							>
								<Star className="h-4 w-4" />
							</button>
							{!fullscreen && (
								<Link
									href="/new"
									className="text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
									title="Open Fullscreen"
								>
									<Maximize2 className="h-4 w-4" />
								</Link>
							)}
							<button
								type="button"
								onClick={copyToClipboard}
								className="text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
								title="Copy command"
							>
								{copied ? (
									<Check className="h-4 w-4 text-green-500" />
								) : (
									<ClipboardCopy className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>
				</div>

				{showHelp && (
					<div className="flex-shrink-0 border-gray-300 border-b bg-blue-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-blue-900/20">
						<h3 className="mb-2 font-medium text-blue-800 text-sm dark:text-blue-300">
							How to Use Stack Architect
						</h3>
						<ul className="list-disc space-y-1 pl-5 text-blue-700 text-xs dark:text-blue-400">
							<li>
								Select your preferred technologies from each category using the
								tabs below.
							</li>
							<li>
								Some selections may disable or automatically change other
								options based on compatibility (check notes!).
							</li>
							<li>
								The command will automatically update based on your selections.
							</li>
							<li>
								Click the copy button (
								<ClipboardCopy className="inline h-3 w-3 align-text-bottom" />)
								to copy the command.
							</li>
							<li>
								Use presets (
								<Star className="inline h-3 w-3 align-text-bottom" />) for quick
								setup or reset (
								<RefreshCw className="inline h-3 w-3 align-text-bottom" />) to
								defaults.
							</li>
							<li>
								Save (<Star className="inline h-3 w-3 align-text-bottom" />)
								your preferences to load (
								<Settings className="inline h-3 w-3 align-text-bottom" />) them
								later.
							</li>
						</ul>
					</div>
				)}

				{showPresets && (
					<div className="flex-shrink-0 border-gray-300 border-b bg-amber-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-amber-900/20">
						<h3 className="mb-2 font-medium text-amber-800 text-sm dark:text-amber-300">
							Quick Start Presets
						</h3>
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							{PRESET_TEMPLATES.map((preset) => (
								<button
									type="button"
									key={preset.id}
									onClick={() => applyPreset(preset.id)}
									className="rounded border border-amber-200 p-2 text-left transition-colors hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-800/30"
								>
									<div className="font-medium text-amber-700 text-sm dark:text-amber-300">
										{preset.name}
									</div>
									<div className="text-amber-600 text-xs dark:text-amber-400">
										{preset.description}
									</div>
								</button>
							))}
						</div>
					</div>
				)}

				<div className="flex-grow overflow-y-auto p-3 font-mono sm:p-4">
					<div className="mb-4 flex flex-col justify-between gap-y-3 sm:flex-row sm:items-start">
						<label className="flex flex-col">
							<span className="mb-1 text-gray-600 text-xs dark:text-gray-400">
								Project Name:
							</span>
							<div className="flex items-center">
								<input
									type="text"
									value={stack.projectName || ""}
									onChange={(e) => {
										const newValue = e.target.value;
										setStack((prev) => ({ ...prev, projectName: newValue }));
										setProjectNameError(validateProjectName(newValue));
									}}
									className={`w-full rounded border px-2 py-1 font-mono text-sm focus:outline-none sm:w-auto ${
										projectNameError
											? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
											: "border-gray-300 bg-gray-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-400"
									}`}
									placeholder="my-better-t-app"
								/>
							</div>
							{projectNameError && (
								<p className="mt-1 text-red-500 text-xs">{projectNameError}</p>
							)}
						</label>
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={resetStack}
								className="flex items-center gap-1 rounded border border-gray-300 bg-gray-200 px-2 py-1 text-gray-700 text-xs transition-colors hover:bg-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
								title="Reset to defaults"
							>
								<RefreshCw className="h-3 w-3" />
								Reset
							</button>

							{lastSavedStack && (
								<button
									type="button"
									onClick={loadSavedStack}
									className="flex items-center gap-1 rounded border border-blue-300 bg-blue-100 px-2 py-1 text-blue-700 text-xs transition-colors hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/50"
									title="Load saved preferences"
								>
									<Settings className="h-3 w-3" />
									Load Saved
								</button>
							)}

							<button
								id="save-stack-button"
								type="button"
								onClick={saveCurrentStack}
								className="flex items-center gap-1 rounded border border-green-300 bg-green-100 px-2 py-1 text-green-700 text-xs transition-colors hover:bg-green-200 dark:border-green-700 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/50"
								title="Save current preferences"
							>
								<Star className="h-3 w-3" />
								<span>Save</span>{" "}
							</button>
						</div>
					</div>

					<div className="mb-4 overflow-x-auto rounded border border-gray-300 bg-gray-200 p-2 dark:border-gray-700 dark:bg-gray-800">
						<div className="flex">
							<span className="mr-2 select-none text-green-600 dark:text-green-400">
								$
							</span>
							<code className="whitespace-pre-wrap break-all text-gray-700 text-xs sm:text-sm dark:text-gray-300">
								{command}
							</code>
						</div>
					</div>

					{compatNotes[activeTab] && compatNotes[activeTab].length > 0 && (
						<div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
							<div className="mb-2 flex items-center gap-2 font-medium text-blue-800 text-xs sm:text-sm dark:text-blue-300">
								<InfoIcon className="h-4 w-4 flex-shrink-0" />
								<span>
									Compatibility Notes for{" "}
									{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
								</span>
							</div>
							<ul className="list-inside list-disc space-y-1 text-blue-700 text-xs dark:text-blue-400">
								{compatNotes[activeTab].map((note) => (
									<li key={note}>{note}</li>
								))}
							</ul>
						</div>
					)}

					<div className="border-gray-300 border-t pt-4 dark:border-gray-700">
						<div className="mb-3 flex items-center text-gray-600 text-sm dark:text-gray-400">
							<Terminal className="mr-2 h-4 w-4" />
							<span>
								Configure{" "}
								{activeTab.charAt(0).toUpperCase() +
									activeTab.slice(1).replace(/([A-Z])/g, " $1")}
							</span>
						</div>
						<div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
							{(TECH_OPTIONS[activeTab as keyof typeof TECH_OPTIONS] || []).map(
								(tech) => {
									let isSelected = false;
									if (activeTab === "addons" || activeTab === "examples") {
										isSelected = (
											stack[activeTab as "addons" | "examples"] || []
										).includes(tech.id);
									} else if (activeTab === "frontend") {
										isSelected = (stack.frontend || []).includes(tech.id);
									} else {
										isSelected =
											stack[activeTab as keyof StackState] === tech.id;
									}

									const disabledReason = getDisabledReason(
										activeTab as keyof typeof TECH_OPTIONS,
										tech.id,
									);
									const isDisabled = !!disabledReason;

									return (
										<motion.div
											key={tech.id}
											className={`rounded p-2 px-3 transition-opacity ${
												isDisabled
													? " cursor-not-allowed opacity-50"
													: " cursor-pointer"
											} ${
												isSelected
													? "border border-blue-300 bg-blue-100 dark:border-blue-500/50 dark:bg-blue-900/40"
													: `border border-gray-300 dark:border-gray-700 ${!isDisabled ? "hover:bg-gray-200 dark:hover:bg-gray-800" : ""}`
											}`}
											title={
												isDisabled
													? (disabledReason ?? "Option disabled")
													: tech.description
											}
											whileHover={!isDisabled ? { scale: 1.02 } : undefined}
											whileTap={!isDisabled ? { scale: 0.98 } : undefined}
											onClick={() =>
												!isDisabled &&
												handleTechSelect(
													activeTab as keyof typeof TECH_OPTIONS,
													tech.id,
												)
											}
										>
											<div className="flex items-center">
												<div className="mr-2 flex-shrink-0">
													{isSelected ? (
														<CircleCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
													) : (
														<Circle className="h-4 w-4 text-gray-400 dark:text-gray-600" />
													)}
												</div>
												<div className="flex-grow">
													<div className="flex items-center">
														<span className="mr-2 text-base sm:text-lg">
															{tech.icon}
														</span>
														<span
															className={`${
																isSelected
																	? "font-medium text-blue-700 dark:text-blue-300"
																	: "text-gray-700 dark:text-gray-300"
															} text-xs sm:text-sm`}
														>
															{tech.name}
														</span>
													</div>
													<p className="hidden text-gray-500 text-xs sm:block">
														{tech.description}
													</p>
												</div>
												{tech.default && !isSelected && !isDisabled && (
													<span className="ml-2 hidden flex-shrink-0 text-gray-500 text-xs sm:block dark:text-gray-600">
														Default
													</span>
												)}
											</div>
										</motion.div>
									);
								},
							)}
						</div>

						<div className="mb-3 border-gray-300 border-t pt-3 dark:border-gray-700">
							<div className="mb-2 flex items-center justify-between">
								<div className="text-gray-600 text-xs dark:text-gray-400">
									Selected Stack
								</div>
							</div>
							<div className="flex flex-wrap gap-1">
								{Object.entries(TECH_OPTIONS).flatMap(([category, options]) => {
									const categoryKey = category as keyof StackState;
									const selectedValue = stack[categoryKey];

									if (Array.isArray(selectedValue)) {
										return selectedValue
											.map((id) => options.find((opt) => opt.id === id))
											.filter(Boolean)
											.map((tech) => (
												<span
													key={`${category}-${tech?.id}`}
													className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs ${getBadgeColors(category)}`}
												>
													{tech?.icon} {tech?.name}
												</span>
											));
									}
									const tech = options.find((opt) => opt.id === selectedValue);

									if (tech && tech.id !== "none" && tech.id !== "false") {
										return (
											<span
												key={`${category}-${tech.id}`}
												className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs ${getBadgeColors(category)}`}
											>
												{tech.icon} {tech.name}
											</span>
										);
									}

									return [];
								})}
							</div>
						</div>
					</div>
				</div>

				<div
					className={`flex flex-shrink-0 overflow-x-auto border-gray-300 bg-gray-200 dark:border-gray-700 dark:bg-gray-900 ${
						fullscreen ? "border-t" : "border-t"
					}`}
				>
					{[
						"frontend",
						"runtime",
						"backendFramework",
						"api",
						"database",
						"orm",
						"dbSetup",
						"auth",
						"packageManager",
						"addons",
						"examples",
						"git",
						"install",
					].map((category) => (
						<button
							type="button"
							key={category}
							className={`whitespace-nowrap px-2 py-2 font-mono text-[10px] transition-colors sm:px-4 sm:text-xs ${
								activeTab === category
									? " border-blue-500 border-t-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
									: " border-transparent border-t-2 text-gray-600 hover:bg-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
							}
														`}
							onClick={() => setActiveTab(category)}
						>
							{category.charAt(0).toUpperCase() +
								category.slice(1).replace(/([A-Z])/g, " $1")}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

const getBadgeColors = (category: string): string => {
	switch (category) {
		case "frontend":
			return "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700/30 dark:bg-blue-900/30 dark:text-blue-300";
		case "runtime":
			return "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700/30 dark:bg-amber-900/30 dark:text-amber-300";
		case "backendFramework":
			return "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700/30 dark:bg-blue-900/30 dark:text-blue-300";
		case "api":
			return "border-indigo-300 bg-indigo-100 text-indigo-800 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300";
		case "database":
			return "border-indigo-300 bg-indigo-100 text-indigo-800 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300";
		case "orm":
			return "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-700/30 dark:bg-cyan-900/30 dark:text-cyan-300";
		case "auth":
			return "border-green-300 bg-green-100 text-green-800 dark:border-green-700/30 dark:bg-green-900/30 dark:text-green-300";
		case "dbSetup":
			return "border-pink-300 bg-pink-100 text-pink-800 dark:border-pink-700/30 dark:bg-pink-900/30 dark:text-pink-300";
		case "addons":
			return "border-violet-300 bg-violet-100 text-violet-800 dark:border-violet-700/30 dark:bg-violet-900/30 dark:text-violet-300";
		case "examples":
			return "border-teal-300 bg-teal-100 text-teal-800 dark:border-teal-700/30 dark:bg-teal-900/30 dark:text-teal-300";
		case "packageManager":
			return "border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-700/30 dark:bg-orange-900/30 dark:text-orange-300";
		case "git":
			return "border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-700/30 dark:bg-gray-900/30 dark:text-gray-300";
		case "install":
			return "border-lime-300 bg-lime-100 text-lime-800 dark:border-lime-700/30 dark:bg-lime-900/30 dark:text-lime-300";
		default:
			return "border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-700/30 dark:bg-gray-900/30 dark:text-gray-300";
	}
};

export default StackArchitect;
