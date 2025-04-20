"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Tweet } from "react-tweet";

const TWEET_IDS = [
	"1907728148294447538",
	"1907831059275735353",
	"1912836377365905496",
	"1907817662215757853",
	"1904228496144269699",
	"1912924558522524039",
	"1911490975173607495",
	"1913773945523953713",
	"1904241046898556970",
	"1913834145471672652",
	"1904144343125860404",
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

export default function Testimonials() {
	const [startIndex, setStartIndex] = useState(0);
	const [tweetsPerPage, setTweetsPerPage] = useState(1);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1280) {
				setTweetsPerPage(6);
			} else if (window.innerWidth >= 768) {
				setTweetsPerPage(4);
			} else if (window.innerWidth >= 640) {
				setTweetsPerPage(2);
			} else {
				setTweetsPerPage(1);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getVisibleTweets = () => {
		const visible = [];
		for (let i = 0; i < tweetsPerPage; i++) {
			const index = (startIndex + i) % TWEET_IDS.length;
			visible.push(index);
		}
		return visible;
	};

	const handleNext = () => {
		setStartIndex((prev) => (prev + tweetsPerPage) % TWEET_IDS.length);
	};

	const handlePrev = () => {
		setStartIndex((prev) => {
			const newIndex = prev - tweetsPerPage;
			return newIndex < 0 ? TWEET_IDS.length + newIndex : newIndex;
		});
	};

	const visibleTweets = getVisibleTweets();
	const totalPages = Math.ceil(TWEET_IDS.length / tweetsPerPage);
	const currentPage = Math.floor(startIndex / tweetsPerPage) + 1;

	return (
		<section className="relative z-10 mx-auto mt-12 w-full max-w-7xl space-y-8 px-4 sm:mt-20 sm:space-y-16 sm:px-6">
			<div className="relative space-y-4 text-center sm:space-y-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					<h2 className="font-bold font-mono text-xl tracking-tight sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
						<span className="border-primary border-b-2 pb-1 text-foreground dark:text-primary">
							Developer Feedback
						</span>
					</h2>
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mx-auto max-w-3xl font-mono text-base text-muted-foreground leading-relaxed sm:text-lg md:text-xl"
				>
					what devs are saying about Better-T-Stack
				</motion.p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-100px" }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="relative mt-4 sm:mt-8"
			>
				<div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
					<div className="flex items-center justify-between bg-muted px-2 py-2 sm:px-4">
						<div className="flex space-x-1 sm:space-x-2">
							<div className="h-2 w-2 rounded-full bg-red-500 sm:h-3 sm:w-3" />
							<div className="h-2 w-2 rounded-full bg-yellow-500 sm:h-3 sm:w-3" />
							<div className="h-2 w-2 rounded-full bg-green-500 sm:h-3 sm:w-3" />
						</div>
						<div className="font-mono text-[10px] text-muted-foreground sm:text-xs">
							Developer Feedback
						</div>
						<div className="flex items-center gap-1 sm:gap-2">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handlePrev}
								className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-secondary-foreground transition-colors hover:bg-muted sm:h-6 sm:w-6"
								title="Previous testimonials"
								aria-label="Previous testimonials"
							>
								<ChevronLeft className="h-3 w-3" />
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleNext}
								className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-secondary-foreground transition-colors hover:bg-muted sm:h-6 sm:w-6"
								title="Next testimonials"
								aria-label="Next testimonials"
							>
								<ChevronRight className="h-3 w-3" />
							</motion.button>
						</div>
					</div>

					<div className="p-2">
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
							{visibleTweets.map((tweetIndex) => (
								<Tweet key={tweetIndex} id={TWEET_IDS[tweetIndex]} />
							))}
						</div>
					</div>

					<div className="flex items-center justify-between border-border border-t bg-muted px-2 py-2 sm:p-3">
						<div className="flex items-center">
							<span className="text-[10px] text-muted-foreground sm:text-xs">
								{currentPage}/{totalPages}
							</span>
						</div>

						<div className="flex items-center gap-2 sm:gap-3">
							<div className="flex items-center gap-1">
								{Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
									const pageNum =
										totalPages <= 5
											? i
											: currentPage <= 3
												? i
												: currentPage >= totalPages - 1
													? totalPages - 5 + i
													: currentPage - 3 + i;
									const isActive = pageNum === currentPage - 1;
									return (
										<button
											type="button"
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={i}
											onClick={() => setStartIndex(pageNum * tweetsPerPage)}
											className={cn(
												"h-1 w-1 rounded-full transition-colors sm:h-1.5 sm:w-1.5",
												isActive
													? "bg-primary"
													: "bg-muted-foreground/50 hover:bg-muted-foreground/70",
											)}
											aria-label={`Go to page ${pageNum + 1}`}
										/>
									);
								})}
								{totalPages > 5 && (
									<span className="text-[8px] text-muted-foreground sm:text-[10px]">
										...
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
