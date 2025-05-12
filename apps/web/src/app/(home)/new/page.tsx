"use client";

import { motion } from "motion/react";
import StackBuilder from "../_components/stack-builder";

export default function FullScreenStackBuilder() {
	return (
		<div className="flex h-svh flex-col bg-background">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="w-full flex-1"
			>
				<StackBuilder />
			</motion.div>
		</div>
	);
}
