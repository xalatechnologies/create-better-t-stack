"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface TechOption {
	id: string;
	name: string;
	icon: string;
}

interface FeatureCardProps {
	title: string;
	description?: string;
	options: TechOption[];
	className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
	title,
	options,
	className,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			className={cn(
				"relative flex h-36 flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm",
				className,
			)}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			layout
		>
			<div>
				<h4 className="mb-1 font-mono font-semibold text-foreground text-lg">
					{title}
				</h4>
			</div>

			<AnimatePresence>
				{isHovered && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="absolute inset-0 bg-card/90 p-3 backdrop-blur-sm"
					>
						<ScrollArea className="h-full">
							<ul className="grid grid-cols-3 gap-2 p-1">
								{options.map((option) => (
									<li
										key={option.id}
										title={option.name}
										className="flex items-center justify-center"
									>
										{option.icon.startsWith("/") ? (
											<Image
												src={option.icon}
												alt={option.name}
												width={24}
												height={24}
												className="object-contain "
											/>
										) : (
											<span className="text-2xl">{option.icon}</span>
										)}
									</li>
								))}
							</ul>
						</ScrollArea>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default FeatureCard;
