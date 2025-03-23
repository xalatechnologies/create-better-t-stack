import { motion } from "framer-motion";
import React, { useState } from "react";

interface TechItem {
	name: string;
	description: string;
	category: "frontend" | "backend" | "database" | "tooling" | "core";
}

const techStack: TechItem[] = [
	{
		name: "TypeScript",
		description: "Type safety across the entire stack",
		category: "core",
	},
	{
		name: "React",
		description: "JavaScript library for user interfaces",
		category: "frontend",
	},
	{
		name: "TanStack Router",
		description: "Type-safe routing with file-based routes",
		category: "frontend",
	},
	{
		name: "TanStack Query",
		description: "Powerful data synchronization",
		category: "frontend",
	},
	{
		name: "Tailwind CSS",
		description: "Utility-first CSS framework",
		category: "frontend",
	},
	{
		name: "shadcn/ui",
		description: "Re-usable UI components",
		category: "frontend",
	},
	{
		name: "Hono",
		description: "Ultrafast web framework",
		category: "backend",
	},
	{
		name: "tRPC",
		description: "End-to-end type-safe APIs",
		category: "backend",
	},
	{
		name: "Better-Auth",
		description: "Modern authentication solution",
		category: "backend",
	},
	{
		name: "Drizzle ORM",
		description: "TypeScript-first ORM",
		category: "database",
	},
	{
		name: "Prisma",
		description: "Next-generation ORM",
		category: "database",
	},
	{
		name: "SQLite + Turso",
		description: "Serverless SQLite with edge replication",
		category: "database",
	},
	{
		name: "PostgreSQL",
		description: "Advanced open-source relational database",
		category: "database",
	},
	{
		name: "Biome",
		description: "Fast formatter and linter",
		category: "tooling",
	},
	{
		name: "Husky",
		description: "Git hooks made easy",
		category: "tooling",
	},
	{
		name: "PWA",
		description: "Progressive Web App support",
		category: "tooling",
	},
	{
		name: "Tauri",
		description: "Build desktop and mobile apps with web tech",
		category: "tooling",
	},
	{
		name: "Docker",
		description: "Containerized deployments",
		category: "tooling",
	},
	{
		name: "Turborepo",
		description: "Optimized build system for monorepos",
		category: "core",
	},
];

const categoryIcons = {
	frontend: "🖥️",
	backend: "⚙️",
	database: "🗄️",
	tooling: "🔧",
	core: "⚡",
};

export default function TechShowcase() {
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const categories = Array.from(
		new Set(techStack.map((item) => item.category)),
	);

	const filteredTech = activeCategory
		? techStack.filter((tech) => tech.category === activeCategory)
		: techStack;

	const groupedTech = !activeCategory
		? categories.map((category) => ({
				category,
				items: techStack.filter((tech) => tech.category === category),
			}))
		: null;

	return (
		<section className="w-full max-w-6xl mx-auto py-16 px-4">
			<div className="mb-8 flex flex-wrap justify-center gap-3">
				<button
					type="button"
					className={`px-4 py-2 rounded-md font-mono text-sm transition-colors ${
						activeCategory === null
							? "bg-blue-500 text-white dark:text-white"
							: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
					}`}
					onClick={() => setActiveCategory(null)}
				>
					all technologies
				</button>

				{categories.map((category) => (
					<button
						key={category}
						type="button"
						className={`px-4 py-2 rounded-md font-mono text-sm transition-colors ${
							activeCategory === category
								? "bg-blue-500 text-white dark:text-white"
								: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
						}`}
						onClick={() => setActiveCategory(category)}
					>
						{categoryIcons[category as keyof typeof categoryIcons]} {category}
					</button>
				))}
			</div>

			{activeCategory && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredTech.map((tech) => (
						<motion.div
							key={tech.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-blue-500/30 transition-colors"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{tech.name}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								{tech.description}
							</p>
							<div className="mt-3 text-xs text-gray-500 dark:text-gray-500 font-mono">
								{tech.category === "tooling" || tech.category === "database" ? (
									<span>
										{tech.name === "Drizzle ORM" ||
										tech.name === "Prisma" ||
										tech.name === "SQLite + Turso" ||
										tech.name === "PostgreSQL" ? (
											<code>--{tech.name.toLowerCase().split(" ")[0]}</code>
										) : (
											<code>--{tech.name.toLowerCase()}</code>
										)}
									</span>
								) : (
									<span>Included by default</span>
								)}
							</div>
						</motion.div>
					))}
				</div>
			)}

			{!activeCategory && groupedTech && (
				<div className="space-y-12">
					{groupedTech.map((group) => (
						<div key={group.category} className="relative">
							<div className="flex items-center mb-4">
								<div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-300 mr-3">
									{categoryIcons[group.category as keyof typeof categoryIcons]}
								</div>
								<h2 className="text-xl font-semibold text-blue-500 dark:text-blue-300 font-mono">
									{group.category}/
								</h2>
							</div>

							<div className="border-l-2 border-gray-200 dark:border-gray-800 pl-6 ml-3 pb-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{group.items.map((tech) => (
										<motion.div
											key={tech.name}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-md p-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-colors"
										>
											<div className="flex justify-between items-start">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{tech.name}
												</h3>
												<div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
													{group.category === "tooling" ||
													tech.category === "database"
														? "optional"
														: "core"}
												</div>
											</div>
											<p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
												{tech.description}
											</p>
											<div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
												<span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
													{group.category === "tooling" ||
													tech.category === "database"
														? tech.name === "Drizzle ORM" ||
															tech.name === "Prisma" ||
															tech.name === "SQLite + Turso" ||
															tech.name === "PostgreSQL"
															? `--${tech.name.toLowerCase().split(" ")[0]}`
															: `--${tech.name.toLowerCase()}`
														: "included by default"}
												</span>
												<span
													className={`h-2 w-2 ${group.category === "tooling" || tech.category === "database" ? "bg-yellow-500" : "bg-green-500"} rounded-full`}
												/>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="mt-10 text-center">
				<div className="inline-block bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-md px-5 py-3 font-mono text-sm text-gray-600 dark:text-gray-400">
					<span className="text-green-500 dark:text-green-400">$</span> npx
					create-better-t-stack
					<span className="text-blue-500 dark:text-blue-400">
						{" "}
						—your-options
					</span>
				</div>
			</div>
		</section>
	);
}
