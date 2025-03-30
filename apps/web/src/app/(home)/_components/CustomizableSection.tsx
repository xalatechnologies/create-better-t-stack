import { motion } from "framer-motion";
import { Code, Sliders, Terminal, TerminalSquare } from "lucide-react";
import StackArchitect from "./StackArchitech";

export default function CustomizableSection() {
	return (
		<section className="w-full max-w-6xl mx-auto space-y-16 mt-20 relative z-10 px-4 sm:px-6">
			<div className="text-center space-y-8 relative">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					<h2 className="text-3xl sm:text-4xl font-bold">
						<span className="text-blue-500 dark:text-blue-400 font-mono mr-1">
							{">"}
						</span>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
							Your Stack, Your Choice
						</span>
					</h2>
					<div className="absolute -inset-x-1/4 -inset-y-1/2 bg-gradient-to-r from-blue-300/0 via-blue-300/10 to-blue-300/0 dark:from-blue-800/0 dark:via-blue-800/10 dark:to-blue-800/0 blur-3xl -z-10" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="space-y-6 max-w-3xl mx-auto"
				>
					<p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-mono">
						Configure your ideal TypeScript environment with all the options you
						need
					</p>

					<div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
						<div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-md flex items-center gap-1.5 transition-colors shadow-sm">
							<Terminal className="h-3.5 w-3.5">
								<title>Runtime Options</title>
							</Terminal>
							<span>--runtime</span>
						</div>
						<div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-md flex items-center gap-1.5 transition-colors shadow-sm">
							<Code className="h-3.5 w-3.5">
								<title>Framework Options</title>
							</Code>
							<span>--framework</span>
						</div>
						<div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-md flex items-center gap-1.5 transition-colors shadow-sm">
							<TerminalSquare className="h-3.5 w-3.5">
								<title>Database Options</title>
							</TerminalSquare>
							<span>--database</span>
						</div>
						<div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-md flex items-center gap-1.5 transition-colors shadow-sm">
							<Sliders className="h-3.5 w-3.5">
								<title>Addon Options</title>
							</Sliders>
							<span>--addons</span>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.4, delay: 0.3 }}
					className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2"
				>
					<Badge color="amber">Bun or Node</Badge>
					<Badge color="blue">Hono or Elysia</Badge>
					<Badge color="indigo">SQLite or PostgreSQL</Badge>
					<Badge color="cyan">Drizzle or Prisma</Badge>
					<Badge color="green">Authentication</Badge>
					<Badge color="violet">Optional Addons</Badge>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-50px" }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="relative"
			>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 blur-3xl -z-10" />
				<StackArchitect />
			</motion.div>
		</section>
	);
}

function Badge({
	children,
	color,
}: { children: React.ReactNode; color: string }) {
	const colorMap = {
		amber:
			"bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30",
		blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30",
		indigo:
			"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30",
		cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/30",
		green:
			"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30",
		violet:
			"bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800/30",
	};

	return (
		<span
			className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
				colorMap[color as keyof typeof colorMap]
			} shadow-sm`}
		>
			{children}
		</span>
	);
}
