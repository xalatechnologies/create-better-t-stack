import { motion } from "framer-motion";
import { Code, Sliders, Terminal, TerminalSquare } from "lucide-react";
import StackArchitect from "./StackArchitech";

export default function CustomizableSection() {
	return (
		<section className="w-full max-w-7xl mx-auto space-y-12 mt-24 relative z-50 px-4">
			<div className="text-center space-y-6 relative z-10 border dark:border-gray-700/30 border-gray-500/30 p-6 rounded-md bg-white/80 dark:bg-gray-950/30 backdrop-blur-sm">
				<div className="relative">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="relative sm:text-4xl text-3xl md:text-5xl font-bold pb-3 group"
					>
						<span className="text-blue-500 dark:text-blue-400 font-mono mr-1 animate-pulse">
							{">"}
						</span>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 transition-all duration-300">
							Your Stack, Your Choice
						</span>
					</motion.h2>
					<div className="absolute -inset-1 bg-gradient-to-r from-gray-300/0 via-gray-300/10 to-gray-300/0 dark:from-gray-800/0 dark:via-gray-700/10 dark:to-gray-800/0 blur-xl -z-10" />
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="space-y-4 max-w-3xl mx-auto"
				>
					<p className="sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-mono">
						<span className="text-yellow-600 dark:text-yellow-400">$</span>{" "}
						Better-T Stack with defaults,
						<span className="text-blue-600 dark:text-blue-400 font-semibold">
							{" "}
							customizable options
						</span>{" "}
						for your perfect development environment
					</p>

					<div className="flex flex-wrap justify-center sm:gap-4 gap-2 sm:text-sm text-xs text-gray-600 dark:text-gray-400">
						<div className="px-3 py-1 bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900/50 transition-colors flex items-center gap-1.5">
							<Terminal className="h-3.5 w-3.5" />
							<span>--multiple-runtimes</span>
						</div>
						<div className="px-3 py-1 bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900/50 transition-colors flex items-center gap-1.5">
							<Code className="h-3.5 w-3.5" />
							<span>--framework-choices</span>
						</div>
						<div className="px-3 py-1 bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900/50 transition-colors flex items-center gap-1.5">
							<TerminalSquare className="h-3.5 w-3.5" />
							<span>--database-options</span>
						</div>
						<div className="px-3 py-1 bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900/50 transition-colors flex items-center gap-1.5">
							<Sliders className="h-3.5 w-3.5" />
							<span>--customizable-addons</span>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.3 }}
					className="flex flex-wrap justify-center gap-3 pt-2"
				>
					<Badge color="amber">Bun or Node</Badge>
					<Badge color="blue">Hono or Elysia</Badge>
					<Badge color="indigo">SQLite or PostgreSQL</Badge>
					<Badge color="cyan">Drizzle or Prisma</Badge>
					<Badge color="green">Authentication Options</Badge>
					<Badge color="violet">Optional Addons</Badge>
				</motion.div>

				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 -z-10" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="relative"
			>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
				<StackArchitect />
			</motion.div>
		</section>
	);
}

// Helper component for colored badge pills
function Badge({
	children,
	color,
}: { children: React.ReactNode; color: string }) {
	const colorMap = {
		amber:
			"bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
		blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
		indigo:
			"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
		cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
		green:
			"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
		violet:
			"bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
	};

	return (
		<span
			className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[color as keyof typeof colorMap]}`}
		>
			{children}
		</span>
	);
}
