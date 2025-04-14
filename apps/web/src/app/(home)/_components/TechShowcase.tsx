import { motion } from "motion/react";
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
		<section className="mx-auto w-full max-w-6xl px-4 py-16">
			<div className="mb-8 flex flex-wrap justify-center gap-3">
				<button
					type="button"
					className={`rounded-md px-4 py-2 font-mono text-sm transition-colors ${
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
						className={`rounded-md px-4 py-2 font-mono text-sm transition-colors ${
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
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredTech.map((tech) => (
						<motion.div
							key={tech.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className="rounded-lg border border-gray-200 bg-white/50 p-4 backdrop-blur-sm transition-colors hover:border-blue-500/30 dark:border-gray-800 dark:bg-gray-900/50"
						>
							<h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-white">
								{tech.name}
							</h3>
							<p className="text-gray-600 text-sm dark:text-gray-400">
								{tech.description}
							</p>
							<div className="mt-3 font-mono text-gray-500 text-xs dark:text-gray-500">
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
							<div className="mb-4 flex items-center">
								<div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-500/20 dark:text-blue-300">
									{categoryIcons[group.category as keyof typeof categoryIcons]}
								</div>
								<h2 className="font-mono font-semibold text-blue-500 text-xl dark:text-blue-300">
									{group.category}/
								</h2>
							</div>

							<div className="ml-3 border-gray-200 border-l-2 pb-4 pl-6 dark:border-gray-800">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{group.items.map((tech) => (
										<motion.div
											key={tech.name}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="rounded-md border border-gray-200 bg-white/30 p-4 backdrop-blur-sm transition-colors hover:bg-gray-100/50 dark:border-gray-800 dark:bg-gray-900/30 dark:hover:bg-gray-800/30"
										>
											<div className="flex items-start justify-between">
												<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
													{tech.name}
												</h3>
												<div className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-600 text-xs dark:bg-gray-800 dark:text-gray-400">
													{group.category === "tooling" ||
													tech.category === "database"
														? "optional"
														: "core"}
												</div>
											</div>
											<p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
												{tech.description}
											</p>
											<div className="mt-3 flex items-center justify-between border-gray-200 border-t pt-2 dark:border-gray-800">
												<span className="font-mono text-gray-500 text-xs dark:text-gray-500">
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
				<div className="inline-block rounded-md border border-gray-200 bg-white/50 px-5 py-3 font-mono text-gray-600 text-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
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
