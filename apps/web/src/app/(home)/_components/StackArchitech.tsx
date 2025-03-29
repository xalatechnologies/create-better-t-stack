"use client";

import { motion } from "framer-motion";
import {
	Check,
	Circle,
	CircleCheck,
	ClipboardCopy,
	Terminal,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const triggerConfetti = () => {
	const createConfettiElement = (color: string) => {
		const confetti = document.createElement("div");
		confetti.style.position = "fixed";
		confetti.style.width = `${Math.random() * 10 + 5}px`;
		confetti.style.height = `${Math.random() * 10 + 5}px`;
		confetti.style.backgroundColor = color;
		confetti.style.borderRadius = "50%";
		confetti.style.zIndex = "9999";

		const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
		const startY = window.innerHeight / 2;

		confetti.style.left = `${startX}px`;
		confetti.style.top = `${startY}px`;

		document.body.appendChild(confetti);

		const angle = Math.random() * Math.PI * 2;
		const velocity = Math.random() * 5 + 3;
		const vx = Math.cos(angle) * velocity;
		let vy = Math.sin(angle) * velocity - 2;

		let posX = startX;
		let posY = startY;
		let opacity = 1;
		let rotation = 0;

		const animate = () => {
			posX += vx;
			posY += vy;
			vy += 0.1; // Gravity
			opacity -= 0.01;
			rotation += 5;

			confetti.style.left = `${posX}px`;
			confetti.style.top = `${posY}px`;
			confetti.style.opacity = `${opacity}`;
			confetti.style.transform = `rotate(${rotation}deg)`;

			if (opacity > 0 && posY < window.innerHeight) {
				requestAnimationFrame(animate);
			} else {
				confetti.remove();
			}
		};

		requestAnimationFrame(animate);
	};

	const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#ffd166", "#f8a5c2"];
	for (let i = 0; i < 30; i++) {
		setTimeout(() => {
			createConfettiElement(colors[Math.floor(Math.random() * colors.length)]);
		}, Math.random() * 500);
	}
};

const TECH_OPTIONS = {
	frontend: [
		{
			id: "web",
			name: "React Web",
			description: "React with TanStack Router",
			icon: "🌐",
			color: "from-blue-400 to-blue-600",
			default: true,
		},
		{
			id: "native",
			name: "React Native",
			description: "Expo with NativeWind",
			icon: "📱",
			color: "from-purple-400 to-purple-600",
			default: false,
		},
		{
			id: "none",
			name: "No Frontend",
			description: "API-only backend",
			icon: "⚙️",
			color: "from-gray-400 to-gray-600",
			default: false,
		},
	],
	runtime: [
		{
			id: "bun",
			name: "Bun",
			description: "Fast JavaScript runtime & toolkit",
			icon: "🥟",
			color: "from-amber-400 to-amber-600",
			default: true,
		},
		{
			id: "node",
			name: "Node.js",
			description: "JavaScript runtime environment",
			icon: "🟩",
			color: "from-green-400 to-green-600",
		},
	],
	backendFramework: [
		{
			id: "hono",
			name: "Hono",
			description: "Ultrafast web framework",
			icon: "⚡",
			color: "from-blue-500 to-blue-700",
			default: true,
		},
		{
			id: "elysia",
			name: "Elysia",
			description: "TypeScript web framework",
			icon: "🦊",
			color: "from-purple-500 to-purple-700",
		},
	],
	database: [
		{
			id: "sqlite",
			name: "SQLite",
			description: "File-based SQL database",
			icon: "🗃️",
			color: "from-blue-400 to-cyan-500",
			default: true,
		},
		{
			id: "postgres",
			name: "PostgreSQL",
			description: "Advanced SQL database",
			icon: "🐘",
			color: "from-indigo-400 to-indigo-600",
		},
		{
			id: "none",
			name: "No Database",
			description: "Skip database integration",
			icon: "🚫",
			color: "from-gray-400 to-gray-600",
		},
	],
	orm: [
		{
			id: "drizzle",
			name: "Drizzle",
			description: "TypeScript ORM",
			icon: "💧",
			color: "from-cyan-400 to-cyan-600",
			default: true,
		},
		{
			id: "prisma",
			name: "Prisma",
			description: "Next-gen ORM",
			icon: "◮",
			color: "from-purple-400 to-purple-600",
		},
	],
	auth: [
		{
			id: "true",
			name: "Better Auth",
			description: "Simple authentication",
			icon: "🔐",
			color: "from-green-400 to-green-600",
			default: true,
		},
		{
			id: "false",
			name: "No Auth",
			description: "Skip authentication",
			icon: "🔓",
			color: "from-red-400 to-red-600",
		},
	],
	turso: [
		{
			id: "true",
			name: "Turso",
			description: "SQLite cloud database",
			icon: "☁️",
			color: "from-pink-400 to-pink-600",
			default: false,
		},
		{
			id: "false",
			name: "No Turso",
			description: "Skip Turso integration",
			icon: "🚫",
			color: "from-gray-400 to-gray-600",
			default: true,
		},
	],
	packageManager: [
		{
			id: "npm",
			name: "npm",
			description: "Default package manager",
			icon: "📦",
			color: "from-red-500 to-red-700",
		},
		{
			id: "pnpm",
			name: "pnpm",
			description: "Fast, disk space efficient",
			icon: "🚀",
			color: "from-orange-500 to-orange-700",
		},
		{
			id: "bun",
			name: "bun",
			description: "All-in-one toolkit",
			icon: "🥟",
			color: "from-amber-500 to-amber-700",
			default: true,
		},
	],
	addons: [
		{
			id: "pwa",
			name: "PWA",
			description: "Progressive Web App",
			icon: "📱",
			color: "from-blue-500 to-blue-700",
			default: false,
		},
		{
			id: "tauri",
			name: "Tauri",
			description: "Desktop app support",
			icon: "🖥️",
			color: "from-amber-500 to-amber-700",
			default: false,
		},
		{
			id: "biome",
			name: "Biome",
			description: "Linting & formatting",
			icon: "🌿",
			color: "from-green-500 to-green-700",
			default: false,
		},
		{
			id: "husky",
			name: "Husky",
			description: "Git hooks & lint-staged",
			icon: "🐶",
			color: "from-purple-500 to-purple-700",
			default: false,
		},
	],
	examples: [
		{
			id: "todo",
			name: "Todo Example",
			description: "Simple todo application",
			icon: "✅",
			color: "from-indigo-500 to-indigo-700",
			default: false,
		},
	],
	git: [
		{
			id: "true",
			name: "Git",
			description: "Initialize Git repository",
			icon: "📝",
			color: "from-gray-500 to-gray-700",
			default: true,
		},
		{
			id: "false",
			name: "No Git",
			description: "Skip Git initialization",
			icon: "🚫",
			color: "from-red-400 to-red-600",
		},
	],
	install: [
		{
			id: "true",
			name: "Install Dependencies",
			description: "Install packages automatically",
			icon: "📥",
			color: "from-green-400 to-green-600",
			default: true,
		},
		{
			id: "false",
			name: "Skip Install",
			description: "Skip dependency installation",
			icon: "⏭️",
			color: "from-yellow-400 to-yellow-600",
		},
	],
};

interface StackState {
	frontend: string[];
	runtime: string;
	backendFramework: string;
	database: string;
	orm: string | null;
	auth: string;
	turso: string;
	packageManager: string;
	addons: string[];
	examples: string[];
	git: string;
	install: string;
}

const DEFAULT_STACK: StackState = {
	frontend: ["web"],
	runtime: "bun",
	backendFramework: "hono",
	database: "sqlite",
	orm: "drizzle",
	auth: "true",
	turso: "false",
	packageManager: "bun",
	addons: [],
	examples: [],
	git: "true",
	install: "true",
};

const StackArchitect = () => {
	const [stack, setStack] = useState<StackState>(DEFAULT_STACK);
	const [command, setCommand] = useState("npx create-better-t-stack my-app -y");
	const [activeTab, setActiveTab] = useState("database");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const cmd = generateCommand(stack);
		setCommand(cmd);
	}, [stack]);

	const generateCommand = useCallback((stackState: StackState) => {
		let base: string;
		if (stackState.packageManager === "npm") {
			base = "npx create-better-t-stack@latest";
		} else if (stackState.packageManager === "pnpm") {
			base = "pnpm create better-t-stack@latest";
		} else {
			base = "bun create better-t-stack@latest";
		}

		const projectName = "my-better-t-app";
		const flags: string[] = [];

		const isAllDefault =
			stackState.frontend.length === 1 &&
			stackState.frontend[0] === "web" &&
			stackState.runtime === "bun" &&
			stackState.backendFramework === "hono" &&
			stackState.database === "sqlite" &&
			stackState.orm === "drizzle" &&
			stackState.auth === "true" &&
			stackState.turso === "false" &&
			stackState.packageManager === "bun" &&
			stackState.addons.length === 0 &&
			stackState.examples.length === 0 &&
			stackState.git === "true" &&
			stackState.install === "true";

		if (isAllDefault) {
			return `${base} ${projectName} --yes`;
		}

		flags.push("--yes");

		if (!stackState.frontend.includes("web")) {
			flags.push("--no-web");
		}

		if (stackState.frontend.includes("native")) {
			flags.push("--native");
		}

		if (stackState.runtime !== "bun") {
			flags.push(`--runtime ${stackState.runtime}`);
		}

		if (stackState.backendFramework !== "hono") {
			flags.push(`--${stackState.backendFramework}`);
		}

		if (stackState.database === "postgres") {
			flags.push("--postgres");
		} else if (stackState.database === "none") {
			flags.push("--no-database");
		}

		if (stackState.orm === "prisma" && stackState.database !== "none") {
			flags.push("--prisma");
		}

		if (stackState.auth === "false") {
			flags.push("--no-auth");
		}

		if (stackState.turso === "true" && stackState.database === "sqlite") {
			flags.push("--turso");
		}

		if (stackState.packageManager !== "bun") {
			flags.push(`--${stackState.packageManager}`);
		}

		if (stackState.addons.length > 0) {
			for (const addon of stackState.addons) {
				flags.push(`--${addon}`);
			}
		}

		if (stackState.examples.length > 0) {
			flags.push(`--examples ${stackState.examples.join(",")}`);
		}

		if (stackState.git === "false") {
			flags.push("--no-git");
		}

		if (stackState.install === "false") {
			flags.push("--no-install");
		}

		return `${base} ${projectName} ${flags.join(" ")}`;
	}, []);

	const handleTechSelect = useCallback(
		(category: keyof typeof TECH_OPTIONS, techId: string) => {
			setStack((prev) => {
				if (category === "frontend") {
					const currentSelection = [...prev.frontend];

					if (techId === "none") {
						return {
							...prev,
							frontend: [],
						};
					}

					if (currentSelection.includes(techId)) {
						return {
							...prev,
							frontend: currentSelection.filter((id) => id !== techId),
						};
					}

					return {
						...prev,
						frontend: [...currentSelection, techId],
					};
				}

				if (category === "addons" || category === "examples") {
					const currentArray = [...(prev[category] || [])];
					const index = currentArray.indexOf(techId);

					if (index >= 0) {
						currentArray.splice(index, 1);
					} else {
						currentArray.push(techId);
					}

					return {
						...prev,
						[category]: currentArray,
					};
				}

				if (category === "database") {
					if (techId === "none") {
						return {
							...prev,
							database: techId,
							orm: null,
						};
					}

					if (prev.database === "none") {
						return {
							...prev,
							database: techId,
							orm: "drizzle",
						};
					}
				}

				if (category === "database" && techId === "sqlite") {
					return {
						...prev,
						database: techId,
						turso: prev.turso,
					};
				}

				if (category === "database" && techId !== "sqlite") {
					return {
						...prev,
						database: techId,
						turso: "false",
					};
				}

				return {
					...prev,
					[category]: techId,
				};
			});

			triggerConfetti();
		},
		[],
	);

	const copyToClipboard = useCallback(() => {
		navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [command]);

	return (
		<div className="w-full mx-auto">
			<div className="rounded-xl overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-black text-gray-800 dark:text-white">
				<div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
					<div className="flex space-x-2">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
					</div>
					<div className="font-mono text-xs text-gray-600 dark:text-gray-400">
						Stack Architect Terminal
					</div>
					<div>
						<button
							type="button"
							onClick={copyToClipboard}
							className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
							title="Copy command"
						>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<ClipboardCopy className="h-4 w-4" />
							)}
						</button>
					</div>
				</div>

				<div className="p-4 font-mono">
					<div className="mb-4">
						<div className="flex">
							<span className="text-green-600 dark:text-green-400 mr-2">$</span>
							<code className="text-gray-700 dark:text-gray-300">
								{command}
							</code>
						</div>
					</div>

					<div className="border-t border-gray-300 dark:border-gray-700 pt-4 mt-4">
						<div className="mb-3 text-gray-600 dark:text-gray-400 flex items-center">
							<Terminal className="w-4 h-4 mr-2" />
							<span>
								Configure{" "}
								{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
							</span>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
							{TECH_OPTIONS[activeTab as keyof typeof TECH_OPTIONS].map(
								(tech) => {
									let isSelected = false;
									if (activeTab === "addons" || activeTab === "examples") {
										isSelected = stack[activeTab].includes(tech.id);
									} else if (activeTab === "frontend") {
										isSelected = stack.frontend.includes(tech.id);
									} else {
										isSelected =
											stack[activeTab as keyof StackState] === tech.id;
									}

									const isDisabled =
										(activeTab === "orm" && stack.database === "none") ||
										(activeTab === "turso" && stack.database !== "sqlite");

									return (
										<motion.div
											key={tech.id}
											className={`
												p-2 px-3 rounded
												${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
												${
													isSelected
														? "bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-500/50"
														: "hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700"
												}
											`}
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
												<div className="flex-shrink-0 mr-2">
													{isSelected ? (
														<CircleCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
													) : (
														<Circle className="h-4 w-4 text-gray-400 dark:text-gray-600" />
													)}
												</div>
												<div className="flex-grow">
													<div className="flex items-center">
														<span className="mr-2">{tech.icon}</span>
														<span
															className={
																isSelected
																	? "text-blue-700 dark:text-blue-300"
																	: "text-gray-700 dark:text-gray-300"
															}
														>
															{tech.name}
														</span>
													</div>
													<p className="text-xs text-gray-500">
														{tech.description}
													</p>
												</div>
												{tech.default && !isSelected && (
													<span className="text-xs text-gray-500 dark:text-gray-600 ml-2">
														Default
													</span>
												)}
											</div>
										</motion.div>
									);
								},
							)}
						</div>

						<div className="border-t border-gray-300 dark:border-gray-700 pt-3 mb-3">
							<div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
								Selected Stack
							</div>
							<div className="flex flex-wrap gap-1">
								{stack.frontend.map((frontendId) => {
									const frontend = TECH_OPTIONS.frontend.find(
										(f) => f.id === frontendId,
									);
									return frontend ? (
										<span
											key={frontendId}
											className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700/30"
										>
											{frontend.icon} {frontend.name}
										</span>
									) : null;
								})}
								<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/30">
									{
										TECH_OPTIONS.runtime.find((t) => t.id === stack.runtime)
											?.icon
									}{" "}
									{
										TECH_OPTIONS.runtime.find((t) => t.id === stack.runtime)
											?.name
									}
								</span>

								<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700/30">
									{
										TECH_OPTIONS.backendFramework.find(
											(t) => t.id === stack.backendFramework,
										)?.icon
									}{" "}
									{
										TECH_OPTIONS.backendFramework.find(
											(t) => t.id === stack.backendFramework,
										)?.name
									}
								</span>

								<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700/30">
									{
										TECH_OPTIONS.database.find((t) => t.id === stack.database)
											?.icon
									}{" "}
									{
										TECH_OPTIONS.database.find((t) => t.id === stack.database)
											?.name
									}
								</span>

								{stack.orm && (
									<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/30">
										{TECH_OPTIONS.orm.find((t) => t.id === stack.orm)?.icon}{" "}
										{TECH_OPTIONS.orm.find((t) => t.id === stack.orm)?.name}
									</span>
								)}

								<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700/30">
									{TECH_OPTIONS.auth.find((t) => t.id === stack.auth)?.icon}{" "}
									{TECH_OPTIONS.auth.find((t) => t.id === stack.auth)?.name}
								</span>

								{stack.turso === "true" && stack.database === "sqlite" && (
									<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border border-pink-300 dark:border-pink-700/30">
										{TECH_OPTIONS.turso.find((t) => t.id === stack.turso)?.icon}{" "}
										{TECH_OPTIONS.turso.find((t) => t.id === stack.turso)?.name}
									</span>
								)}

								{stack.addons.map((addonId) => {
									const addon = TECH_OPTIONS.addons.find(
										(a) => a.id === addonId,
									);
									return addon ? (
										<span
											key={addonId}
											className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 border border-violet-300 dark:border-violet-700/30"
										>
											{addon.icon} {addon.name}
										</span>
									) : null;
								})}
							</div>
						</div>
					</div>
				</div>

				<div className="bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 flex overflow-x-auto">
					{Object.keys(TECH_OPTIONS).map((category) => (
						<button
							type="button"
							key={category}
							className={`
									py-2 px-4 text-xs font-mono whitespace-nowrap transition-colors
									${
										activeTab === category
											? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-t-2 border-blue-500"
											: "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
									}
								`}
							onClick={() => setActiveTab(category)}
						>
							{category}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default StackArchitect;
