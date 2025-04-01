"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Tweet } from "react-tweet";

const TWEET_IDS = [
	"1904144343125860404",
	"1904215768272654825",
	"1904233896851521980",
	"1904228496144269699",
	"1904301540422070671",
	"1904338606409531710",
	"1904241046898556970",
	"1904318186750652606",
	"1904179661086556412",
	"1906149740095705265",
	"1906001923456790710",
	"1906570888897777847",
];

export default function Testimonials() {
	const [startIndex, setStartIndex] = useState(0);
	const [tweetsPerPage, setTweetsPerPage] = useState(3);

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
		<section className="w-full max-w-7xl mx-auto space-y-16 mt-20 relative z-10 px-4 sm:px-6">
			<div className="text-center space-y-8 relative">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					<h2 className="text-3xl sm:text-4xl font-bold">
						<span className="text-blue-500 dark:text-blue-400 font-mono mr-1">
							{">"}
						</span>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
							Developer Feedback
						</span>
					</h2>
					<div className="absolute -inset-x-1/4 -inset-y-1/2 bg-gradient-to-r from-blue-300/0 via-blue-300/10 to-blue-300/0 dark:from-blue-800/0 dark:via-blue-800/10 dark:to-blue-800/0 blur-3xl -z-10" />
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-mono max-w-3xl mx-auto"
				>
					what devs are saying about Better-T-Stack
				</motion.p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-100px" }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="relative mt-8"
			>
				<div className="rounded-xl overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
					<div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
						<div className="flex space-x-2">
							<div className="w-3 h-3 rounded-full bg-red-500" />
							<div className="w-3 h-3 rounded-full bg-yellow-500" />
							<div className="w-3 h-3 rounded-full bg-green-500" />
						</div>
						<div className="font-mono text-xs text-gray-600 dark:text-gray-400">
							Developer Feedback Terminal
						</div>
						<div className="flex items-center gap-2">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handlePrev}
								className="h-6 w-6 flex items-center justify-center rounded bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
								title="Previous testimonials"
							>
								<ChevronLeft className="h-3 w-3" />
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleNext}
								className="h-6 w-6 flex items-center justify-center rounded bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
								title="Next testimonials"
							>
								<ChevronRight className="h-3 w-3" />
							</motion.button>
						</div>
					</div>

					<div className="p-2">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
							{visibleTweets.map((tweetIndex) => (
								<Tweet key={tweetIndex} id={TWEET_IDS[tweetIndex]} />
							))}
						</div>
					</div>

					<div className="bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 p-3 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-700 dark:text-gray-300">
								Page {currentPage} of {totalPages}
							</span>
						</div>

						<div className="flex items-center gap-3">
							<div className="hidden sm:flex items-center gap-1">
								{Array.from({ length: totalPages }).map((_, i) => {
									const isActive = i === currentPage - 1;
									return (
										<button
											type="button"
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={i}
											onClick={() => setStartIndex(i * tweetsPerPage)}
											className={`w-1.5 h-1.5 rounded-full transition-colors ${
												isActive
													? "bg-blue-500"
													: "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500"
											}`}
											aria-label={`Go to page ${i + 1}`}
										/>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 blur-3xl -z-10" />
			</motion.div>
		</section>
	);
}
