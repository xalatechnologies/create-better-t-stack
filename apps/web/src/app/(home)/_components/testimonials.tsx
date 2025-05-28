"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Tweet } from "react-tweet";

const TWEET_IDS = [
	"1907728148294447538",
	"1907831059275735353",
	"1912836377365905496",
	"1907817662215757853",
	"1904228496144269699",
	"1917815700980391964",
	"1917640304758514093",
	"1912924558522524039",
	"1911490975173607495",
	"1913773945523953713",
	"1904241046898556970",
	"1913834145471672652",
	"1904144343125860404",
	"1917610656477348229",
	"1904215768272654825",
	"1913833079342522779",
	"1907723601731530820",
	"1904233896851521980",
	"1913801258789491021",
	"1907841646513005038",
	"1904301540422070671",
	"1912837026925195652",
	"1904338606409531710",
	"1904318186750652606",
	"1908568583799484519",
	"1913018977321693448",
	"1904179661086556412",
	"1908558365128876311",
	"1907772878139072851",
	"1906149740095705265",
	"1906001923456790710",
	"1906570888897777847",
];

const MAX_VISIBLE_PAGES = 5;

export default function Testimonials() {
	const [startIndex, setStartIndex] = useState(0);
	const [tweetsPerPage] = useState(6);

	const totalPages = useMemo(
		() => Math.ceil(TWEET_IDS.length / tweetsPerPage),
		[tweetsPerPage],
	);
	const currentPage = useMemo(
		() => Math.floor(startIndex / tweetsPerPage) + 1,
		[startIndex, tweetsPerPage],
	);

	const handleNext = () => {
		setStartIndex((prev) =>
			Math.min(prev + tweetsPerPage, (totalPages - 1) * tweetsPerPage),
		);
	};

	const handlePrev = () => {
		setStartIndex((prev) => Math.max(0, prev - tweetsPerPage));
	};

	const goToPage = (pageNumber: number) => {
		setStartIndex((pageNumber - 1) * tweetsPerPage);
	};

	const visibleTweetIndices = useMemo(() => {
		const end = Math.min(startIndex + tweetsPerPage, TWEET_IDS.length);
		return Array.from({ length: end - startIndex }, (_, i) => startIndex + i);
	}, [startIndex, tweetsPerPage]);

	const paginationDots = useMemo(() => {
		if (totalPages <= MAX_VISIBLE_PAGES) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const startPage = Math.max(
			1,
			Math.min(
				currentPage - Math.floor(MAX_VISIBLE_PAGES / 2),
				totalPages - MAX_VISIBLE_PAGES + 1,
			),
		);
		const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

		const pages: (number | string)[] = [];
		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) pages.push("...");
		}
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) pages.push("...");
			pages.push(totalPages);
		}
		return pages;
	}, [totalPages, currentPage]);

	const gridVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.2 },
		},
	};

	return (
		<div className="mb-12">
			<div className="mb-6 flex items-center gap-2">
				<Terminal className="terminal-glow h-4 w-4 text-primary" />
				<span className="terminal-glow font-bold font-mono text-lg">
					DEVELOPER_TESTIMONIALS.LOG
				</span>
				<div className="h-px flex-1 bg-border" />
				<span className="font-mono text-muted-foreground text-xs">
					[{TWEET_IDS.length} ENTRIES]
				</span>
			</div>

			<div className="terminal-block-hover mb-8 rounded border border-border bg-muted/20 p-4">
				<div className="flex items-center gap-2 text-sm">
					<span className="terminal-glow text-primary">$</span>
					<span className="font-mono text-foreground">
						# Community feedback from X (Twitter)
					</span>
				</div>
				<div className="mt-2 flex items-center gap-2 text-sm">
					<span className="terminal-glow text-primary">$</span>
					<span className="font-mono text-muted-foreground">
						# Real developers sharing their experience
					</span>
				</div>
			</div>

			<motion.div
				className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3")}
				variants={gridVariants}
				initial="hidden"
				animate="visible"
			>
				{visibleTweetIndices.map((index, i) => (
					<motion.div
						key={TWEET_IDS[index]}
						className="terminal-block-hover overflow-hidden rounded border border-border bg-background"
						style={{ animationDelay: `${i * 50}ms` }}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.1 }}
					>
						<div className="border-border border-b bg-muted/20 px-3 py-2">
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">▶</span>
								<span className="font-mono font-semibold text-xs">
									[TWEET_{String(index + 1).padStart(3, "0")}]
								</span>
							</div>
						</div>
						<div className="p-0">
							<Tweet id={TWEET_IDS[index]} />
						</div>
					</motion.div>
				))}
			</motion.div>

			{totalPages > 1 && (
				<div className="terminal-block-hover mt-8 rounded border border-border bg-muted/20 p-4">
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={handlePrev}
							disabled={currentPage === 1}
							className={cn(
								"terminal-block-hover hidden items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 font-mono text-xs transition-colors sm:flex",
								currentPage === 1
									? "cursor-not-allowed opacity-50"
									: "hover:bg-muted/50",
							)}
						>
							<ChevronLeft className="h-3 w-3" />
							PREV
						</button>

						<div className="flex items-center gap-1">
							<span className="font-mono text-muted-foreground text-xs">
								PAGE:
							</span>
							{paginationDots.map((page, index) =>
								typeof page === "number" ? (
									<button
										type="button"
										key={`page-${page}`}
										onClick={() => goToPage(page)}
										className={cn(
											"terminal-block-hover flex h-6 w-6 items-center justify-center rounded border border-border font-mono text-xs transition-colors",
											currentPage === page
												? "terminal-glow bg-primary/20 text-primary"
												: "bg-background text-muted-foreground hover:text-foreground",
										)}
									>
										{page}
									</button>
								) : (
									<span
										key={`ellipsis-${
											index < paginationDots.length / 2 ? "start" : "end"
										}`}
										className="flex h-6 w-6 items-center justify-center font-mono text-muted-foreground text-xs"
									>
										...
									</span>
								),
							)}
						</div>

						<button
							type="button"
							onClick={handleNext}
							disabled={currentPage === totalPages}
							className={cn(
								"terminal-block-hover hidden items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 font-mono text-xs transition-colors sm:flex",
								currentPage === totalPages
									? "cursor-not-allowed opacity-50"
									: "hover:bg-muted/50",
							)}
						>
							NEXT
							<ChevronRight className="h-3 w-3" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
