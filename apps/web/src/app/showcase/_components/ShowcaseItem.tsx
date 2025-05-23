"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export interface ShowcaseItemProps {
	title: string;
	description: string;
	imageUrl: string;
	liveUrl?: string;
	sourceUrl?: string;
	tags: string[];
}

export default function ShowcaseItem({
	title,
	description,
	imageUrl,
	liveUrl,
	sourceUrl,
	tags,
}: ShowcaseItemProps) {
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
		<motion.div
			variants={itemVariants}
			className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm"
		>
			<div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-md">
				<Image
					src={imageUrl}
					alt={title}
					fill
					className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
					unoptimized
				/>
			</div>
			<h3 className="mb-2 font-mono font-semibold text-primary text-xl">
				{title}
			</h3>
			<p className="mb-4 flex-grow text-muted-foreground text-sm">
				{description}
			</p>
			<div className="mb-4">
				{tags.map((tag) => (
					<span
						key={tag}
						className="mr-2 mb-2 inline-block rounded-full bg-muted px-2 py-1 font-mono text-muted-foreground text-xs"
					>
						{tag}
					</span>
				))}
			</div>
			<div className="mt-auto flex space-x-3">
				{liveUrl && (
					<Link
						href={liveUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="font-mono text-primary text-sm hover:underline"
					>
						Live Demo
					</Link>
				)}
				{sourceUrl && (
					<Link
						href={sourceUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="font-mono text-muted-foreground text-sm hover:underline"
					>
						Source Code
					</Link>
				)}
			</div>
		</motion.div>
	);
}
