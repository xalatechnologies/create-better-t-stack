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
		<div className="w-full max-w-3xl mx-auto mt-4 sm:mt-8">
			<div className="rounded-xl overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-black text-gray-800 dark:text-white">
				<div className="bg-gray-200 dark:bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between">
					<div className="flex space-x-2">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
					</div>
					<div className="font-mono text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hidden xs:block">
						Quick Install Terminal
					</div>

					<div className="relative" ref={menuRef}>
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="flex items-center px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs bg-gray-300/50 dark:bg-gray-800/50 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-300/80 dark:hover:bg-gray-700/50"
						>
							<Terminal className="w-3 h-3 mr-1 text-gray-600 dark:text-gray-400">
								<title>Package Manager</title>
							</Terminal>
							<span className="text-gray-700 dark:text-gray-300 mr-1">
								{selectedPM}
							</span>
							<svg
								className="w-3 h-3 text-gray-700 dark:text-gray-400"
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
								className="absolute right-0 mt-1 w-32 sm:w-36 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-50"
							>
								<ul>
									{(Object.keys(commands) as Array<"npm" | "pnpm" | "bun">).map(
										(pm) => (
											<li key={pm}>
												<button
													type="button"
													className={`block w-full text-left px-3 py-1.5 text-[10px] sm:text-xs ${
														selectedPM === pm
															? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500"
															: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

				<div className="p-3 sm:p-4 font-mono text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 overflow-x-auto">
					<div className="flex items-center">
						<div className="flex-grow overflow-x-auto">
							<span className="text-green-600 dark:text-green-400 mr-2">$</span>
							<span className="text-gray-700 dark:text-gray-300">
								{commands[selectedPM]}
							</span>
							<span
								className={
									typingComplete
										? "hidden"
										: "text-blue-600 dark:text-blue-500 animate-pulse ml-1"
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
							className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
							title="Copy command"
						>
							{copied ? (
								<Check className="w-4 h-4">
									<title>Copied!</title>
								</Check>
							) : (
								<ClipboardCopy className="w-4 h-4">
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
							<div className="mt-3 pl-2 sm:pl-4 text-amber-600 dark:text-amber-400">
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
										className="text-blue-600 dark:text-blue-400 flex items-center"
									>
										<CircleCheck className="w-4 h-4 mr-1 flex-shrink-0">
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
										className="text-blue-600 dark:text-blue-400 flex items-center"
									>
										<CircleCheck className="w-4 h-4 mr-1 flex-shrink-0">
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
											className="text-blue-600 dark:text-blue-400 flex items-center"
										>
											<CircleCheck className="w-4 h-4 mr-1 flex-shrink-0">
												<title>Completed</title>
											</CircleCheck>
											<span>Setting up database schema</span>
										</motion.p>
										<motion.p
											initial={{ opacity: 0, x: -5 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.8 }}
											className="text-blue-600 dark:text-blue-400 flex items-center"
										>
											<CircleCheck className="w-4 h-4 mr-1 flex-shrink-0">
												<title>Completed</title>
											</CircleCheck>
											<span>Configuring authentication</span>
										</motion.p>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.9 }}
											className="mt-4 flex flex-col xs:flex-row xs:items-center px-2 py-2 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/30 text-[10px] sm:text-xs"
										>
											<svg
												className="w-4 h-4 mb-1 xs:mb-0 xs:mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0"
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
												<code className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800/50 rounded mb-1 xs:mb-0 mr-1">
													cd my-better-t-app
												</code>
												<span className="mr-1">and</span>
												<code className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800/50 rounded">
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
						className={`flex mt-4 ${
							currentStep >= 5 && typingComplete ? "" : "hidden"
						}`}
					>
						<span className="text-green-600 dark:text-green-400 mr-2">$</span>
						<span className="text-blue-600 dark:text-blue-500 animate-pulse">
							▌
						</span>
					</div>
				</div>

				<div className="bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 px-2 sm:px-4 py-2">
					<div className="flex items-center justify-center text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 text-center">
						<span className="inline-flex flex-wrap items-center justify-center gap-1">
							<span>For custom options, use</span>
							<code className="px-1 py-0.5 bg-gray-300 dark:bg-gray-700 rounded whitespace-nowrap">
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
