"use client";

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
	"1904241046898556970",
	"1904144343125860404",
	"1904215768272654825",
	"1907723601731530820",
	"1904233896851521980",
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
						<span className="border-blue-500 border-b-2 pb-1 text-gray-900 dark:text-blue-100">
							Developer Feedback
						</span>
					</h2>
					<div className="-inset-x-1/4 -inset-y-1/2 -z-10 absolute bg-gradient-to-r from-blue-300/0 via-blue-300/10 to-blue-300/0 blur-3xl dark:from-blue-800/0 dark:via-blue-800/10 dark:to-blue-800/0" />
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mx-auto max-w-3xl font-mono text-base text-gray-700 leading-relaxed sm:text-lg md:text-xl dark:text-gray-300"
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
				<div className="overflow-hidden rounded-xl border border-gray-300 bg-gray-100 shadow-xl dark:border-gray-700 dark:bg-gray-900">
					<div className="flex items-center justify-between bg-gray-200 px-2 py-2 sm:px-4 dark:bg-gray-800">
						<div className="flex space-x-1 sm:space-x-2">
							<div className="h-2 w-2 rounded-full bg-red-500 sm:h-3 sm:w-3" />
							<div className="h-2 w-2 rounded-full bg-yellow-500 sm:h-3 sm:w-3" />
							<div className="h-2 w-2 rounded-full bg-green-500 sm:h-3 sm:w-3" />
						</div>
						<div className="font-mono text-[10px] text-gray-600 sm:text-xs dark:text-gray-400">
							Developer Feedback
						</div>
						<div className="flex items-center gap-1 sm:gap-2">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handlePrev}
								className="flex h-5 w-5 items-center justify-center rounded bg-gray-300 text-gray-700 transition-colors hover:bg-gray-400 sm:h-6 sm:w-6 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
								title="Previous testimonials"
								aria-label="Previous testimonials"
							>
								<ChevronLeft className="h-3 w-3" />
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleNext}
								className="flex h-5 w-5 items-center justify-center rounded bg-gray-300 text-gray-700 transition-colors hover:bg-gray-400 sm:h-6 sm:w-6 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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

					<div className="flex items-center justify-between border-gray-300 border-t bg-gray-200 px-2 py-2 sm:p-3 dark:border-gray-700 dark:bg-gray-800">
						<div className="flex items-center">
							<span className="text-[10px] text-gray-700 sm:text-xs dark:text-gray-300">
								{currentPage}/{totalPages}
							</span>
						</div>

						<div className="flex items-center gap-2 sm:gap-3">
							<div className="flex items-center gap-1">
								{Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
									const isActive = i === Math.min(currentPage - 1, 4);
									return (
										<button
											type="button"
											// biome-ignore lint/suspicious/noArrayIndexKey: pagination indicator
											key={i}
											onClick={() => setStartIndex(i * tweetsPerPage)}
											className={`h-1 w-1 rounded-full transition-colors sm:h-1.5 sm:w-1.5 ${
												isActive
													? "bg-blue-500"
													: "bg-gray-400 hover:bg-gray-500 dark:bg-gray-600"
											}`}
											aria-label={`Go to page ${i + 1}`}
										/>
									);
								})}
								{totalPages > 5 && (
									<span className="text-[8px] text-gray-500 sm:text-[10px] dark:text-gray-400">
										...
									</span>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="-z-10 absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 blur-3xl" />
			</motion.div>
		</section>
	);
}
