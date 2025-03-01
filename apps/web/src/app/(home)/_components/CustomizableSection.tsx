import { motion } from "motion/react";
import CustomizableStack from "./CustomizableStack";

export default function CustomizableSection() {
	return (
		<section className="w-full max-w-6xl mx-auto space-y-12 mt-24 relative z-50">
			<div className="text-center space-y-6 relative z-10 border border-gray-700/30 p-6 rounded-md bg-gray-950/30 backdrop-blur-sm">
				<div className="relative">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="relative sm:text-4xl text-3xl md:text-5xl font-bold pb-3 group"
					>
						<span className="text-blue-400 font-mono mr-1 animate-pulse">
							{">"}
						</span>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-purple-400 hover:to-blue-500 transition-all duration-300">
							Your Stack, Your Choice
						</span>
					</motion.h2>
					<div className="absolute -inset-1 bg-gradient-to-r from-gray-800/0 via-gray-700/10 to-gray-800/0 blur-xl -z-10" />
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="space-y-4 max-w-3xl mx-auto"
				>
					<p className="sm:text-xl text-gray-300 leading-relaxed font-mono">
						<span className="text-yellow-400">$</span> Better-T Stack with
						defaults,
						<span className="text-blue-400 font-semibold">
							{" "}
							customizable options
						</span>{" "}
						for your perfect development environment
					</p>

					<div className="flex flex-wrap justify-center sm:gap-4 gap-2 sm:text-sm text-xs text-gray-400">
						<span className="px-3 py-1 bg-black border border-gray-700 rounded-sm hover:bg-gray-900/50 transition-colors">
							--multiple-database-options
						</span>
						<span className="px-3 py-1 bg-black border border-gray-700 rounded-sm hover:bg-gray-900/50 transition-colors">
							--flexible-authentication
						</span>
						<span className="px-3 py-1 bg-black border border-gray-700 rounded-sm hover:bg-gray-900/50 transition-colors">
							--alternative-orms
						</span>
						<span className="px-3 py-1 bg-black border border-gray-700 rounded-sm hover:bg-gray-900/50 transition-colors">
							--framework-choices
						</span>
					</div>
				</motion.div>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 -z-10" />
			</div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="relative"
			>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
				<CustomizableStack />
			</motion.div>
		</section>
	);
}
