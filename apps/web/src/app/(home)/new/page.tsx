"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import StackArchitect from "../_components/StackArchitech";

export default function FullScreenStackArchitect() {
	useEffect(() => {
		const setVh = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		};

		setVh();
		window.addEventListener("resize", setVh);
		return () => window.removeEventListener("resize", setVh);
	}, []);

	return (
		<div className="flex min-h-[calc(var(--vh,1vh)*100)] flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="flex-1 px-4 py-8"
			>
				<div className="mx-auto max-w-6xl">
					<div className="mb-8 max-w-3xl">
						<h1 className="mb-3 font-bold font-mono text-2xl sm:text-3xl md:text-4xl">
							Design Your Ideal Full Stack
						</h1>
						<p className="text-gray-700 text-lg dark:text-gray-300">
							Configure every aspect of your TypeScript application with the
							interactive stack architect. Choose your technologies, add
							features, and generate your startup command.
						</p>
					</div>

					<StackArchitect fullscreen={true} />

					<div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
						<h3 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
							Need help getting started?
						</h3>
						<p className="text-blue-700 dark:text-blue-400">
							Select a preset template for common configurations, or customize
							each component of your stack. When you are ready, copy the
							generated command and run it in your terminal to create your
							project.
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
