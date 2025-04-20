"use client";

import { motion } from "motion/react";
import StackArchitect from "../_components/StackArchitech";

export default function FullScreenStackArchitect() {
	return (
		<div className="flex h-svh flex-col bg-background">
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
