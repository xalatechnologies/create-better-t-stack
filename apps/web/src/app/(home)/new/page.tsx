"use client";

import { motion } from "motion/react";
import StackArchitect from "../_components/StackArchitech";

export default function FullScreenStackArchitect() {
	return (
		<div className="flex h-svh flex-col overflow-y-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="w-full flex-1"
			>
				<StackArchitect />
			</motion.div>
		</div>
	);
}
