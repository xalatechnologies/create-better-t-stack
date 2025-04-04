"use client";
import { motion } from "framer-motion";
import { Check, CircleCheck, ClipboardCopy, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CodeContainer = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");
	const [copied, setCopied] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const [typingComplete, setTypingComplete] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const commands = {
		npm: "npx create-better-t-stack@latest my-better-t-app --yes",
		pnpm: "pnpm create better-t-stack@latest my-better-t-app --yes",
		bun: "bun create better-t-stack@latest my-better-t-app --yes",
	};

	const copyToClipboard = async (pm: "npm" | "pnpm" | "bun") => {
		await navigator.clipboard.writeText(commands[pm]);
		setSelectedPM(pm);
		setCopied(true);
		setIsOpen(false);
		setTimeout(() => setCopied(false), 2000);
	};

	useEffect(() => {
		if (!typingComplete) {
			const timer = setTimeout(() => {
				setTypingComplete(true);
			}, 1000);
			return () => clearTimeout(timer);
		}

		if (typingComplete && currentStep < 5) {
			const timer = setTimeout(() => {
				setCurrentStep((prev) => prev + 1);
			}, 800);
			return () => clearTimeout(timer);
		}
	}, [typingComplete, currentStep]);

	return (
		<div className="mx-auto mt-4 w-full max-w-3xl sm:mt-8">
			<div className="overflow-hidden rounded-xl border border-gray-300 bg-gray-100 text-gray-800 shadow-xl dark:border-gray-700 dark:bg-black dark:text-white">
				<div className="flex items-center justify-between bg-gray-200 px-3 py-2 sm:px-4 dark:bg-gray-800">
					<div className="flex space-x-2">
						<div className="h-3 w-3 rounded-full bg-red-500" />
						<div className="h-3 w-3 rounded-full bg-yellow-500" />
						<div className="h-3 w-3 rounded-full bg-green-500" />
					</div>
					<div className="xs:block hidden font-mono text-[10px] text-gray-600 sm:text-xs dark:text-gray-400">
						Quick Install Terminal
					</div>

					<div className="relative" ref={menuRef}>
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="flex items-center rounded border border-gray-300 bg-gray-300/50 px-1.5 py-1 text-[10px] hover:bg-gray-300/80 sm:px-2 sm:text-xs dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
						>
							<Terminal className="mr-1 h-3 w-3 text-gray-600 dark:text-gray-400">
								<title>Package Manager</title>
							</Terminal>
							<span className="mr-1 text-gray-700 dark:text-gray-300">
								{selectedPM}
							</span>
							<svg
								className="h-3 w-3 text-gray-700 dark:text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Toggle Dropdown</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
								/>
							</svg>
						</button>

						{isOpen && (
							<motion.div
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								className="absolute right-0 z-50 mt-1 w-32 rounded-md border border-gray-300 bg-white shadow-lg sm:w-36 dark:border-gray-700 dark:bg-gray-900"
							>
								<ul>
									{(Object.keys(commands) as Array<"npm" | "pnpm" | "bun">).map(
										(pm) => (
											<li key={pm}>
												<button
													type="button"
													className={`block w-full px-3 py-1.5 text-left text-[10px] sm:text-xs ${
														selectedPM === pm
															? "border-blue-500 border-l-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
															: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
													}`}
													onClick={() => copyToClipboard(pm)}
												>
													{pm === "npm" && "npm"}
													{pm === "pnpm" && "pnpm"}
													{pm === "bun" && (
														<span className="flex items-center">
															<span className="mr-1">🥟</span> bun
														</span>
													)}
												</button>
											</li>
										),
									)}
								</ul>
							</motion.div>
						)}
					</div>
				</div>

				<div className="overflow-x-auto bg-gray-50 p-3 font-mono text-xs sm:p-4 sm:text-sm dark:bg-gray-900">
					<div className="flex items-center">
						<div className="flex-grow overflow-x-auto">
							<span className="mr-2 text-green-600 dark:text-green-400">$</span>
							<span className="text-gray-700 dark:text-gray-300">
								{commands[selectedPM]}
							</span>
							<span
								className={
									typingComplete
										? "hidden"
										: "ml-1 animate-pulse text-blue-600 dark:text-blue-500"
								}
							>
								▌
							</span>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={() => copyToClipboard(selectedPM)}
							className="ml-2 flex-shrink-0 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
							title="Copy command"
						>
							{copied ? (
								<Check className="h-4 w-4">
									<title>Copied!</title>
								</Check>
							) : (
								<ClipboardCopy className="h-4 w-4">
									<title>Copy to clipboard</title>
								</ClipboardCopy>
							)}
						</motion.button>
					</div>

					{typingComplete && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="overflow-x-auto"
						>
							<div className="mt-3 pl-2 text-amber-600 sm:pl-4 dark:text-amber-400">
								{currentStep >= 1 && (
									<motion.p
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 }}
									>
										Creating a new Better-T-Stack project
									</motion.p>
								)}
								{currentStep >= 2 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}
										className="mt-2"
									>
										<p className="text-gray-700 dark:text-gray-300">
											Project name:{" "}
											<span className="text-amber-600 dark:text-amber-400">
												my-better-t-app
											</span>
										</p>
										<p className="text-gray-700 dark:text-gray-300">
											Frontend:{" "}
											<span className="text-amber-600 dark:text-amber-400">
												React Web
											</span>
										</p>
										<p className="text-gray-700 dark:text-gray-300">
											Runtime:{" "}
											<span className="text-amber-600 dark:text-amber-400">
												Bun
											</span>
										</p>
										<p className="text-gray-700 dark:text-gray-300">
											Backend:{" "}
											<span className="text-amber-600 dark:text-amber-400">
												Hono
											</span>
										</p>
										<p className="text-gray-700 dark:text-gray-300">
											Database:{" "}
											<span className="text-amber-600 dark:text-amber-400">
												SQLite + Drizzle
											</span>
										</p>
									</motion.div>
								)}
							</div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="mt-3 pl-2 sm:pl-4"
							>
								{currentStep >= 3 && (
									<motion.p
										initial={{ opacity: 0, x: -5 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.4 }}
										className="flex items-center text-blue-600 dark:text-blue-400"
									>
										<CircleCheck className="mr-1 h-4 w-4 flex-shrink-0">
											<title>Completed</title>
										</CircleCheck>
										<span>Creating project structure</span>
									</motion.p>
								)}
								{currentStep >= 4 && (
									<motion.p
										initial={{ opacity: 0, x: -5 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 }}
										className="flex items-center text-blue-600 dark:text-blue-400"
									>
										<CircleCheck className="mr-1 h-4 w-4 flex-shrink-0">
											<title>Completed</title>
										</CircleCheck>
										<span>Installing dependencies</span>
									</motion.p>
								)}
								{currentStep >= 5 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.6 }}
									>
										<motion.p
											initial={{ opacity: 0, x: -5 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.7 }}
											className="flex items-center text-blue-600 dark:text-blue-400"
										>
											<CircleCheck className="mr-1 h-4 w-4 flex-shrink-0">
												<title>Completed</title>
											</CircleCheck>
											<span>Setting up database schema</span>
										</motion.p>
										<motion.p
											initial={{ opacity: 0, x: -5 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.8 }}
											className="flex items-center text-blue-600 dark:text-blue-400"
										>
											<CircleCheck className="mr-1 h-4 w-4 flex-shrink-0">
												<title>Completed</title>
											</CircleCheck>
											<span>Configuring authentication</span>
										</motion.p>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.9 }}
											className="mt-4 flex xs:flex-row flex-col xs:items-center rounded border border-blue-300 bg-blue-100 px-2 py-2 text-[10px] text-blue-800 sm:text-xs dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-300"
										>
											<svg
												className="xs:mr-2 mb-1 xs:mb-0 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<title>Success</title>
												<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
												<polyline points="22 4 12 14.01 9 11.01" />
											</svg>
											<div className="flex flex-wrap">
												<span className="mr-1">Project ready! Run</span>
												<code className="mr-1 mb-1 xs:mb-0 rounded bg-blue-200 px-1 py-0.5 dark:bg-blue-800/50">
													cd my-better-t-app
												</code>
												<span className="mr-1">and</span>
												<code className="rounded bg-blue-200 px-1 py-0.5 dark:bg-blue-800/50">
													{selectedPM === "npm" && "npm run dev"}
													{selectedPM === "pnpm" && "pnpm dev"}
													{selectedPM === "bun" && "bun dev"}
												</code>
											</div>
										</motion.div>
									</motion.div>
								)}
							</motion.div>
						</motion.div>
					)}

					<div
						className={`mt-4 flex ${
							currentStep >= 5 && typingComplete ? "" : "hidden"
						}`}
					>
						<span className="mr-2 text-green-600 dark:text-green-400">$</span>
						<span className="animate-pulse text-blue-600 dark:text-blue-500">
							▌
						</span>
					</div>
				</div>

				<div className="border-gray-300 border-t bg-gray-200 px-2 py-2 sm:px-4 dark:border-gray-700 dark:bg-gray-900">
					<div className="flex items-center justify-center text-center text-[10px] text-gray-600 sm:text-xs dark:text-gray-400">
						<span className="inline-flex flex-wrap items-center justify-center gap-1">
							<span>For custom options, use</span>
							<code className="whitespace-nowrap rounded bg-gray-300 px-1 py-0.5 dark:bg-gray-700">
								{selectedPM === "npm" && "npx"}
								{selectedPM === "pnpm" && "pnpm dlx"}
								{selectedPM === "bun" && "bunx"} create-better-t-stack
							</code>
							<span>without flags</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CodeContainer;
