"use client";
import { motion } from "framer-motion";
import { Check, ClipboardCopy, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CodeContainer = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("bun");
	const [copied, setCopied] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const [showCursor, setShowCursor] = useState(true);
	const [step, setStep] = useState(0);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node))
				setIsOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => setShowCursor((p) => !p), 500);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (step < 5) {
			const timer = setTimeout(
				() => setStep((s) => s + 1),
				step === 0 ? 1000 : 400,
			);
			return () => clearTimeout(timer);
		}
	}, [step]);

	const commands = {
		npm: "npx create-better-t-stack@latest",
		pnpm: "pnpm create better-t-stack@latest",
		bun: "bun create better-t-stack@latest",
	};

	const copyToClipboard = async (pm: "npm" | "pnpm" | "bun") => {
		await navigator.clipboard.writeText(commands[pm]);
		setSelectedPM(pm);
		setCopied(true);
		setIsOpen(false);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="mx-auto mt-4 w-full max-w-3xl">
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-950">
				<div className="flex items-center justify-between bg-gray-100 px-3 py-2 dark:bg-gray-900">
					<div className="flex gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-red-500" />
						<div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
						<div className="h-2.5 w-2.5 rounded-full bg-green-500" />
					</div>

					<div className="text-gray-600 text-xs dark:text-gray-400">
						Terminal
					</div>

					<div className="relative" ref={menuRef}>
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-gray-700 text-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							<Terminal className="h-3 w-3 text-gray-600 dark:text-gray-400" />
							<span>{selectedPM}</span>
							<svg
								className="h-3 w-3 text-gray-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>arrow</title>
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
								className="absolute right-0 z-50 mt-1 w-28 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
							>
								{(["npm", "pnpm", "bun"] as const).map((pm) => (
									<button
										type="button"
										key={pm}
										className={`block w-full px-3 py-1.5 text-left text-xs ${
											selectedPM === pm
												? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
												: "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
										}`}
										onClick={() => copyToClipboard(pm)}
									>
										{pm === "bun" ? "🥟 bun" : pm}
									</button>
								))}
							</motion.div>
						)}
					</div>
				</div>

				<div className="bg-gray-50 p-4 text-left font-mono text-sm dark:bg-gray-900">
					<div className="flex items-center">
						<span className="mr-2 text-gray-600 dark:text-gray-400">$</span>
						<div className="flex-grow">
							<span className="text-gray-800 dark:text-gray-200">
								{commands[selectedPM]}
							</span>
							{step === 0 && (
								<span
									className={`ml-0.5 inline-block h-4 w-2 bg-gray-800 dark:bg-white ${showCursor ? "opacity-100" : "opacity-0"}`}
								/>
							)}
						</div>
						<button
							type="button"
							onClick={() => copyToClipboard(selectedPM)}
							className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						>
							{copied ? (
								<Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
							) : (
								<ClipboardCopy className="h-4 w-4" />
							)}
						</button>
					</div>

					{step > 0 && (
						<div className="mt-3 space-y-1.5 text-sm">
							{step > 0 && (
								<div className="text-gray-600 dark:text-gray-400">
									Creating a new Better-T-Stack project
								</div>
							)}

							{step > 1 && (
								<div className="ml-2 grid grid-cols-[80px_1fr] gap-x-2 text-gray-700 text-xs dark:text-gray-300">
									<span>Project:</span>
									<span className="text-gray-800 dark:text-gray-200">
										my-app
									</span>
									<span>Frontend:</span>
									<span className="text-gray-800 dark:text-gray-200">
										React Web
									</span>
									<span>Backend:</span>
									<span className="text-gray-800 dark:text-gray-200">Hono</span>
									<span>Database:</span>
									<span className="text-gray-800 dark:text-gray-200">
										SQLite + Drizzle
									</span>
								</div>
							)}

							{step > 2 && (
								<div className="text-gray-600 dark:text-gray-400">
									✓ Creating project structure
								</div>
							)}

							{step > 3 && (
								<div className="text-gray-600 dark:text-gray-400">
									✓ Installing dependencies
								</div>
							)}

							{step > 4 && (
								<div className="mt-2 border-gray-400 border-l-2 bg-gray-100 py-2 pl-3 text-xs dark:border-gray-600 dark:bg-gray-800">
									<span className="font-semibold text-gray-800 dark:text-gray-200">
										Project created successfully! Run:
									</span>
									<div className="mt-1 flex flex-wrap gap-1">
										<code className="rounded bg-gray-200 px-1 py-0.5 text-gray-800 dark:bg-gray-700 dark:text-white">
											cd my-app
										</code>
										<span className="text-gray-700 dark:text-gray-300">
											and
										</span>
										<code className="rounded bg-gray-200 px-1 py-0.5 text-gray-800 dark:bg-gray-700 dark:text-white">
											{selectedPM === "npm"
												? "npm run dev"
												: selectedPM === "pnpm"
													? "pnpm dev"
													: "bun dev"}
										</code>
									</div>
								</div>
							)}
						</div>
					)}

					{step > 4 && (
						<div className="mt-3 flex items-center">
							<span className="mr-2 text-gray-600 dark:text-gray-400">$</span>
							<span
								className={`inline-block h-4 w-2 bg-gray-800 dark:bg-white ${showCursor ? "opacity-100" : "opacity-0"}`}
							/>
						</div>
					)}
				</div>

				<div className="border-gray-200 border-t bg-gray-50 px-4 py-1.5 text-left text-gray-600 text-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
					For customization options:{" "}
					<code className="rounded bg-gray-200 px-1 py-0.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
						{selectedPM === "npm"
							? "npx"
							: selectedPM === "pnpm"
								? "pnpm dlx"
								: "bunx"}{" "}
						create-better-t-stack
					</code>
				</div>
			</div>
		</div>
	);
};

export default CodeContainer;
