"use client";
import { cn } from "@/lib/utils";
import { Check, ClipboardCopy, Terminal } from "lucide-react";
import { motion } from "motion/react";
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
			<div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
				<div className="flex items-center justify-between bg-muted px-3 py-2">
					<div className="flex gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-red-500" />
						<div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
						<div className="h-2.5 w-2.5 rounded-full bg-green-500" />
					</div>

					<div className="text-muted-foreground text-xs">Terminal</div>

					<div className="relative" ref={menuRef}>
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-foreground text-xs hover:bg-muted"
						>
							<Terminal className="h-3 w-3 text-muted-foreground" />
							<span>{selectedPM}</span>
							<svg
								className="h-3 w-3 text-muted-foreground"
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
								className="absolute right-0 z-50 mt-1 w-28 rounded-md border border-border bg-card shadow-lg"
							>
								{(["npm", "pnpm", "bun"] as const).map((pm) => (
									<button
										type="button"
										key={pm}
										className={cn(
											"block w-full px-3 py-1.5 text-left text-foreground text-xs",
											selectedPM === pm ? "bg-muted" : "hover:bg-muted/50",
										)}
										onClick={() => copyToClipboard(pm)}
									>
										{pm === "bun" ? "🥟 bun" : pm}
									</button>
								))}
							</motion.div>
						)}
					</div>
				</div>

				<div className="bg-card p-4 text-left font-mono text-sm">
					<div className="flex items-center">
						<span className="mr-2 text-muted-foreground">$</span>
						<div className="flex-grow">
							<span className="text-foreground">{commands[selectedPM]}</span>
							{step === 0 && (
								<span
									className={cn(
										"ml-0.5 inline-block h-4 w-2 bg-foreground",
										showCursor ? "opacity-100" : "opacity-0",
									)}
								/>
							)}
						</div>
						<button
							type="button"
							onClick={() => copyToClipboard(selectedPM)}
							className="text-muted-foreground hover:text-foreground"
						>
							{copied ? (
								<Check className="h-4 w-4 text-[--color-chart-4]" />
							) : (
								<ClipboardCopy className="h-4 w-4" />
							)}
						</button>
					</div>

					{step > 0 && (
						<div className="mt-3 space-y-1.5 text-sm">
							{step > 0 && (
								<div className="text-muted-foreground">
									Creating a new Better-T-Stack project
								</div>
							)}

							{step > 1 && (
								<div className="ml-2 grid grid-cols-[80px_1fr] gap-x-2 text-muted-foreground text-xs">
									<span>Project:</span>
									<span className="text-foreground">my-app</span>
									<span>Frontend:</span>
									<span className="text-foreground">React Web</span>
									<span>Backend:</span>
									<span className="text-foreground">Hono</span>
									<span>Database:</span>
									<span className="text-foreground">SQLite + Drizzle</span>
								</div>
							)}

							{step > 2 && (
								<div className="text-muted-foreground">
									✓ Creating project structure
								</div>
							)}

							{step > 3 && (
								<div className="text-muted-foreground">
									✓ Installing dependencies
								</div>
							)}

							{step > 4 && (
								<div className="mt-2 border-border border-l-2 bg-muted py-2 pl-3 text-xs">
									<span className="font-semibold text-foreground">
										Project created successfully! Run:
									</span>
									<div className="mt-1 flex flex-wrap gap-1">
										<code className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground">
											cd my-app
										</code>
										<span className="text-muted-foreground">and</span>
										<code className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground">
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
							<span className="mr-2 text-muted-foreground">$</span>
							<span
								className={cn(
									"inline-block h-4 w-2 bg-foreground",
									showCursor ? "opacity-100" : "opacity-0",
								)}
							/>
						</div>
					)}
				</div>

				<div className="border-border border-t bg-muted px-4 py-1.5 text-left text-muted-foreground text-xs">
					For customization options:{" "}
					<code className="rounded bg-secondary px-1 py-0.5 text-secondary-foreground">
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
