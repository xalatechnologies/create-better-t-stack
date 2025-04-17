"use client";

import { motion } from "motion/react";
import Link from "next/link";
import StackArchitect from "../_components/StackArchitech";

export default function FullScreenStackArchitect() {
	return (
		<div className="flex h-svh flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="w-full flex-1"
			>
				<StackArchitect fullscreen={true} />
			</motion.div>

			<div className="flex-shrink-0 border-gray-200 border-t bg-blue-50/80 p-2 px-4 text-xs sm:p-3 dark:border-gray-800 dark:bg-blue-950/50">
				<p className="text-center text-blue-700 dark:text-blue-400">
					Tip: Use presets (⭐), save (💾), reset (🔄), or copy (📋) the
					command.{" "}
					<Link href="/" className="underline hover:text-blue-500">
						Exit Fullscreen
					</Link>
				</p>
			</div>
		</div>
	);
}
