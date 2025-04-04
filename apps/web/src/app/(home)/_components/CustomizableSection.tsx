import { motion } from "framer-motion";
import { Code, Sliders, Terminal, TerminalSquare } from "lucide-react";
import StackArchitect from "./StackArchitech";

export default function CustomizableSection() {
	return (
		<section className="relative z-10 mx-auto mt-20 w-full max-w-7xl space-y-16 px-4 sm:px-6">
			<div className="relative space-y-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					<h2 className="font-bold text-3xl sm:text-4xl">
						<span className="mr-1 font-mono text-blue-500 dark:text-blue-400">
							{">"}
						</span>
						<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500">
							Your Stack, Your Choice
						</span>
					</h2>
					<div className="-inset-x-1/4 -inset-y-1/2 -z-10 absolute bg-gradient-to-r from-blue-300/0 via-blue-300/10 to-blue-300/0 blur-3xl dark:from-blue-800/0 dark:via-blue-800/10 dark:to-blue-800/0" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mx-auto max-w-3xl space-y-6"
				>
					<p className="font-mono text-gray-700 text-lg leading-relaxed sm:text-xl dark:text-gray-300">
						Configure your ideal TypeScript environment with all the options you
						need
					</p>

					<div className="flex flex-wrap justify-center gap-2 text-gray-700 text-xs sm:gap-3 sm:text-sm dark:text-gray-300">
						<div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900/50">
							<Terminal className="h-3.5 w-3.5">
								<title>Runtime Options</title>
							</Terminal>
							<span>--runtime</span>
						</div>
						<div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900/50">
							<Code className="h-3.5 w-3.5">
								<title>Framework Options</title>
							</Code>
							<span>--framework</span>
						</div>
						<div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900/50">
							<TerminalSquare className="h-3.5 w-3.5">
								<title>Database Options</title>
							</TerminalSquare>
							<span>--database</span>
						</div>
						<div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900/50">
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
					className="flex flex-wrap justify-center gap-2 pt-2 sm:gap-3"
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
				<div className="-z-10 absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 blur-3xl" />
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
			className={`rounded-full border px-2.5 py-1 font-medium text-xs ${
				colorMap[color as keyof typeof colorMap]
			} shadow-sm`}
		>
			{children}
		</span>
	);
}
