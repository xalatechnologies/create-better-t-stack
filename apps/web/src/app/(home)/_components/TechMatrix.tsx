import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TechItem {
	name: string;
	description: string;
	category: "frontend" | "backend" | "database" | "tooling" | "deployment";
	logo?: string;
	color?: string;
}

const techStack: TechItem[] = [
	{
		name: "Next.js",
		description: "React framework for production",
		category: "frontend",
		logo: "/tech/nextjs.svg",
		color: "#ffffff",
	},
	{
		name: "TypeScript",
		description: "Strongly typed programming language",
		category: "frontend",
		logo: "/tech/typescript.svg",
		color: "#3178c6",
	},
	{
		name: "tRPC",
		description: "End-to-end typesafe APIs",
		category: "backend",
		logo: "/tech/trpc.svg",
		color: "#398CCB",
	},
	{
		name: "Tailwind CSS",
		description: "Utility-first CSS framework",
		category: "frontend",
		logo: "/tech/tailwind.svg",
		color: "#38bdf8",
	},
	{
		name: "Prisma",
		description: "Next-generation ORM",
		category: "database",
		logo: "/tech/prisma.svg",
		color: "#5a67d8",
	},
	{
		name: "PostgreSQL",
		description: "Advanced open source database",
		category: "database",
		logo: "/tech/postgresql.svg",
		color: "#336791",
	},
	{
		name: "Zod",
		description: "TypeScript-first schema validation",
		category: "backend",
		logo: "/tech/zod.svg",
		color: "#3E67B1",
	},
	{
		name: "Auth.js",
		description: "Authentication for the web",
		category: "backend",
		logo: "/tech/authjs.svg",
		color: "#32383E",
	},
	{
		name: "Turborepo",
		description: "High-performance build system",
		category: "tooling",
		logo: "/tech/turborepo.svg",
		color: "#EF4444",
	},
	{
		name: "Docker",
		description: "Containerization platform",
		category: "deployment",
		logo: "/tech/docker.svg",
		color: "#2496ED",
	},
	{
		name: "ESLint",
		description: "Pluggable JavaScript linter",
		category: "tooling",
		logo: "/tech/eslint.svg",
		color: "#4B32C3",
	},
	{
		name: "Prettier",
		description: "Opinionated code formatter",
		category: "tooling",
		logo: "/tech/prettier.svg",
		color: "#F7B93E",
	},
];

export default function TechMatrix() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [typedCommand, setTypedCommand] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const fullCommand = "show tech-stack --category all";

	useEffect(() => {
		if (isTyping) return;

		setIsTyping(true);
		let index = 0;

		const typeInterval = setInterval(() => {
			if (index < fullCommand.length) {
				setTypedCommand(fullCommand.substring(0, index + 1));
				index++;
			} else {
				clearInterval(typeInterval);
			}
		}, 80);

		return () => clearInterval(typeInterval);
	}, [isTyping]);

	const categories = Array.from(
		new Set(techStack.map((item) => item.category)),
	);

	const filteredTech = selectedCategory
		? techStack.filter((tech) => tech.category === selectedCategory)
		: techStack;

	const handleMouseMove = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setCursorPosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return (
		<div
			className="w-full max-w-6xl mx-auto py-16 px-4 relative"
			onMouseMove={handleMouseMove}
		>
			{/* Floating particles effect */}
			<div className="absolute inset-0 overflow-hidden">
				{[...Array(6)].map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="absolute rounded-full bg-blue-500/10 blur-xl"
						style={{
							width: `${Math.random() * 200 + 50}px`,
							height: `${Math.random() * 200 + 50}px`,
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							animation: `float ${Math.random() * 10 + 10}s linear infinite`,
							opacity: Math.random() * 0.5,
						}}
					/>
				))}
			</div>

			{/* Main container */}
			<motion.div
				className="relative border border-gray-700/50 rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm shadow-lg"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				style={{
					boxShadow:
						"0 0 30px rgba(59, 130, 246, 0.15), 0 0 10px rgba(147, 51, 234, 0.1)",
				}}
			>
				{/* Gradient border effect */}
				<div className="absolute inset-0 rounded-lg p-[1px] pointer-events-none">
					<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 animate-gradient-x" />
				</div>

				{/* Terminal header */}
				<div className="flex items-center justify-between p-3 bg-gray-900/80 border-b border-gray-700/50">
					<div className="flex space-x-2">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
					</div>
					<div className="font-mono text-sm text-gray-400 flex items-center space-x-1">
						<span className="text-green-400">user@better-t-stack</span>
						<span>:</span>
						<span className="text-blue-400">~/tech-matrix</span>
						<span>$</span>
					</div>
					<div className="text-xs text-gray-500 font-mono">v1.0.0</div>
				</div>

				<div className="p-6 relative">
					{/* Command line interface effect */}
					<div className="font-mono text-sm text-gray-300 mb-6 flex items-center">
						<span className="text-green-400 mr-2">$</span>
						<span>{typedCommand}</span>
						<span className="h-4 w-2 bg-gray-400 animate-blink ml-1" />
					</div>

					{/* Category filters */}
					<motion.div
						className="flex flex-wrap gap-2 mb-6 relative"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<div className="absolute inset-0 -m-2 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 rounded-lg blur-md -z-10" />
						<button
							type="button"
							className={`px-3 py-1 text-xs font-mono rounded-md transition-all duration-300 ${
								!selectedCategory
									? "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
									: "bg-gray-800/60 border border-gray-700/50 text-gray-400 hover:bg-gray-700/30 hover:text-gray-300"
							}`}
							onClick={() => setSelectedCategory(null)}
						>
							all
						</button>

						{categories.map((category) => (
							<button
								type="button"
								key={category}
								className={`px-3 py-1 text-xs font-mono rounded-md transition-all duration-300 ${
									selectedCategory === category
										? "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
										: "bg-gray-800/60 border border-gray-700/50 text-gray-400 hover:bg-gray-700/30 hover:text-gray-300"
								}`}
								onClick={() => setSelectedCategory(category)}
							>
								{category}
							</button>
						))}
					</motion.div>

					{/* Tech stack display */}
					<div className="font-mono text-sm text-gray-300 relative">
						<div
							className="absolute inset-0 -z-10 opacity-30"
							style={{
								background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(59, 130, 246, 0.15), transparent 200px)`,
							}}
						/>

						<div className="text-blue-400 mb-4">
							{"// Better-T Stack Tech Matrix"}
						</div>
						<div className="text-purple-400">{"const techStack = {"}</div>

						<AnimatePresence mode="wait">
							<motion.div
								key={selectedCategory || "all"}
								className="ml-4 space-y-1"
								variants={{
									hidden: { opacity: 0 },
									show: {
										opacity: 1,
										transition: {
											staggerChildren: 0.07,
										},
									},
								}}
								initial="hidden"
								animate="show"
								exit={{ opacity: 0 }}
							>
								{filteredTech.map((tech, index) => (
									<motion.div
										key={tech.name}
										className="group relative"
										variants={{
											hidden: { y: 10, opacity: 0 },
											show: { y: 0, opacity: 1 },
										}}
									>
										<div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-2 py-3 px-2 rounded-md transition-colors duration-300 hover:bg-gray-800/30 border border-transparent hover:border-gray-700/40">
											<div className="flex items-center">
												<div className="w-5 h-5 mr-2 relative overflow-hidden flex-shrink-0">
													{tech.logo && (
														<div
															className="w-4 h-4 relative"
															style={{
																filter:
																	"drop-shadow(0 0 2px rgba(255,255,255,0.3))",
															}}
														>
															<div
																className="w-4 h-4 absolute"
																style={{
																	backgroundColor: tech.color || "transparent",
																	opacity: 0.2,
																	borderRadius: "50%",
																}}
															/>
														</div>
													)}
												</div>
												<div>
													<span className="text-yellow-400 font-semibold">
														{tech.name}
													</span>
													<span className="text-white">: </span>
													<span className="text-green-400 group-hover:text-green-300 transition-colors">
														&quot;{tech.description}&quot;
													</span>
													{index < filteredTech.length - 1 && (
														<span className="text-white">,</span>
													)}
												</div>
											</div>
											<div className="hidden md:flex items-center justify-between text-gray-500 group-hover:text-gray-400 transition-colors">
												<span>{`// ${tech.category}`}</span>
												<span className="text-gray-600 text-xs">
													[installed]
												</span>
											</div>

											<div className="absolute -right-2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
										</div>
									</motion.div>
								))}
							</motion.div>
						</AnimatePresence>

						<div className="text-purple-400">{"};"}</div>

						{/* Terminal footer */}
						<div className="mt-6 text-gray-400 border-t border-gray-800/50 pt-4 flex items-center justify-between">
							<div>
								<span className="text-green-400">$</span> run better-t-stack
								--with-typesafety
							</div>
							<div className="text-xs text-gray-600 animate-pulse">
								Ready for deployment...
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Add animated style tag for custom animations */}
			<style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 20px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes animate-gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: animate-gradient-x 15s linear infinite;
        }

        .animate-blink {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
		</div>
	);
}
