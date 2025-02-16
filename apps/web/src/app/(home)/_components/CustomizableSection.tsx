import { motion } from "framer-motion";
import CustomizableStack from "./CustomizableStack";

export default function CustomizableSection() {
	return (
		<section className="w-full max-w-6xl mx-auto space-y-12 mt-24 relative">
			<div className="text-center space-y-6 relative z-10">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pb-2"
				>
					Your Stack, Your Choice
				</motion.h2>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="space-y-4 max-w-3xl mx-auto"
				>
					<p className="text-xl text-gray-300 leading-relaxed">
						Better-T Stack comes with carefully selected defaults, but we
						understand one size doesn&apos;t fit all.
						<span className="text-purple-400 font-semibold">
							{" "}
							Customize your stack{" "}
						</span>
						while maintaining full type safety and integration.
					</p>

					<div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
						<span className="px-3 py-1 bg-gray-800/50 rounded-full hover:bg-gray-800 transition-colors">
							Multiple Database Options
						</span>
						<span className="px-3 py-1 bg-gray-800/50 rounded-full hover:bg-gray-800 transition-colors">
							Flexible Authentication
						</span>
						<span className="px-3 py-1 bg-gray-800/50 rounded-full hover:bg-gray-800 transition-colors">
							Alternative ORMs
						</span>
						<span className="px-3 py-1 bg-gray-800/50 rounded-full hover:bg-gray-800 transition-colors">
							Framework Choices
						</span>
					</div>
				</motion.div>
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
