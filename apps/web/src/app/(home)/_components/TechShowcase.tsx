import { motion } from "framer-motion";
import React, { useState } from "react";

interface TechItem {
	name: string;
	description: string;
	category: "frontend" | "backend" | "database" | "tooling" | "deployment";
}

const techStack: TechItem[] = [
	{
		name: "Next.js",
		description: "React framework for production",
		category: "frontend",
	},
	{
		name: "TypeScript",
		description: "Strongly typed programming language",
		category: "frontend",
	},
	{
		name: "tRPC",
		description: "End-to-end typesafe APIs",
		category: "backend",
	},
	{
		name: "Tailwind CSS",
		description: "Utility-first CSS framework",
		category: "frontend",
	},
	{ name: "Prisma", description: "Next-generation ORM", category: "database" },
	{
		name: "PostgreSQL",
		description: "Advanced open source database",
		category: "database",
	},
	{
		name: "Zod",
		description: "TypeScript-first schema validation",
		category: "backend",
	},
	{
		name: "Auth.js",
		description: "Authentication for the web",
		category: "backend",
	},
	{
		name: "Turborepo",
		description: "High-performance build system",
		category: "tooling",
	},
	{
		name: "Docker",
		description: "Containerization platform",
		category: "deployment",
	},
	{
		name: "ESLint",
		description: "Pluggable JavaScript linter",
		category: "tooling",
	},
	{
		name: "Prettier",
		description: "Opinionated code formatter",
		category: "tooling",
	},
];

const categoryIcons = {
	frontend: "🖥️",
	backend: "⚙️",
	database: "🗄️",
	tooling: "🔧",
	deployment: "🚀",
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
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button
					className={`px-4 py-2 rounded-md font-mono text-sm transition-colors ${
						activeCategory === null
							? "bg-blue-500 text-white"
							: "bg-gray-800 text-gray-300 hover:bg-gray-700"
					}`}
					onClick={() => setActiveCategory(null)}
				>
					all technologies
				</button>

				{categories.map((category) => (
					// biome-ignore lint/a11y/useButtonType: <explanation>
					<button
						key={category}
						className={`px-4 py-2 rounded-md font-mono text-sm transition-colors ${
							activeCategory === category
								? "bg-blue-500 text-white"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
							className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 hover:border-blue-500/30 transition-colors"
						>
							<h3 className="text-lg font-semibold text-white mb-2">
								{tech.name}
							</h3>
							<p className="text-gray-400 text-sm">{tech.description}</p>
							<div className="mt-3 text-xs text-gray-500 font-mono">
								<code>--package={tech.name.toLowerCase()}</code>
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
								<div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 mr-3">
									{categoryIcons[group.category as keyof typeof categoryIcons]}
								</div>
								<h2 className="text-xl font-semibold text-blue-300 font-mono">
									{group.category}/
								</h2>
							</div>

							<div className="border-l-2 border-gray-800 pl-6 ml-3 pb-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{group.items.map((tech) => (
										<motion.div
											key={tech.name}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-md p-4 hover:bg-gray-800/30 transition-colors"
										>
											<div className="flex justify-between items-start">
												<h3 className="text-lg font-semibold text-white">
													{tech.name}
												</h3>
												<div className="bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-400">
													core
												</div>
											</div>
											<p className="text-gray-400 text-sm mt-2">
												{tech.description}
											</p>
											<div className="mt-3 pt-2 border-t border-gray-800 flex items-center justify-between">
												<span className="text-xs text-gray-500 font-mono">
													include: true
												</span>
												{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
												<span className="h-2 w-2 bg-green-500 rounded-full"></span>
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
				<div className="inline-block bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-md px-5 py-3 font-mono text-sm text-gray-400">
					<span className="text-green-400">$</span> The perfect tech stack,
					carefully selected for{" "}
					<span className="text-blue-400">maximum developer happiness</span>
				</div>
			</div>
		</section>
	);
}
