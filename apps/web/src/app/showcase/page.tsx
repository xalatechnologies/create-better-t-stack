"use client";

import { motion } from "motion/react";
import Navbar from "../(home)/_components/navbar";
import ShowcaseItem from "./_components/ShowcaseItem";

const showcaseProjects = [
	{
		title: "Project Alpha",
		description: "A cool project built with Better-T-Stack.",
		imageUrl: "https://via.placeholder.com/400x300?text=Project+Alpha",
		liveUrl: "#",
		sourceUrl: "#",
		tags: ["Next.js", "tRPC", "Drizzle"],
	},
	{
		title: "Beta App",
		description: "Another awesome application powered by Better-T-Stack.",
		imageUrl: "https://via.placeholder.com/400x300?text=Beta+App",
		liveUrl: "#",
		sourceUrl: "#",
		tags: ["Hono", "React Native", "SQLite"],
	},
	{
		title: "Gamma Platform",
		description: "Showcasing the versatility of Better-T-Stack.",
		imageUrl: "https://via.placeholder.com/400x300?text=Gamma+Platform",
		liveUrl: "#",
		tags: ["Convex", "TanStack Router"],
	},
];

export default function ShowcasePage() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	return (
		<>
			<Navbar />
			<main className="flex min-h-svh flex-col items-center bg-background px-4 pt-24 pb-10 sm:px-6 md:px-8 md:pt-28 lg:pt-32">
				<motion.div
					className="mx-auto w-full max-w-6xl"
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<motion.div className="mb-12 text-center" variants={itemVariants}>
						<h1 className="font-bold font-mono text-4xl tracking-tight sm:text-5xl md:text-6xl">
							<span className="text-foreground dark:text-primary">
								Showcase
							</span>
						</h1>
						<p className="mx-auto mt-4 max-w-2xl font-mono text-lg text-muted-foreground sm:text-xl">
							Discover amazing projects built with Better-T-Stack.
						</p>
					</motion.div>

					<motion.div
						className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
						variants={containerVariants}
					>
						{showcaseProjects.map((project) => (
							<ShowcaseItem key={project.title} {...project} />
						))}
					</motion.div>
				</motion.div>
			</main>
		</>
	);
}
