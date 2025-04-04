"use client";
import ShinyText from "@/app/(home)/_components/ShinyText";
import React from "react";
import BackgroundGradients from "./_components/BackgroundGradients";
import CodeContainer from "./_components/CodeContainer";
import CustomizableSection from "./_components/CustomizableSection";
import NpmPackage from "./_components/NpmPackage";
import Testimonials from "./_components/Testimonials";

export default function HomePage() {
	return (
		<main className="flex flex-col items-center justify-start px-2 pt-24 pb-10 sm:px-4 sm:pb-16 md:px-8 md:pt-28">
			<BackgroundGradients />
			<div className="relative z-10 mx-auto mb-10 max-w-5xl text-center sm:mb-16">
				<div className="px-1 sm:px-6 lg:px-8">
					<div className="flex flex-col items-center justify-center space-y-3 text-center sm:space-y-4">
						<h1 className="font-bold text-4xl text-gray-900 xs:text-5xl tracking-tight sm:text-6xl md:text-7xl dark:text-white">
							<span className="block bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text pb-1 text-transparent">
								Better-T Stack
							</span>
						</h1>

						<div className="mb-1 sm:mb-2">
							<NpmPackage />
						</div>

						<p className="max-w-2xl px-1 font-medium text-gray-600 text-lg sm:text-xl dark:text-gray-300">
							A modern CLI tool for scaffolding end-to-end type-safe TypeScript
							projects with best practices and customizable configurations
						</p>

						<div className="mx-auto mt-1 w-full max-w-3xl sm:mt-2">
							<CodeContainer />
						</div>

						<ShinyText
							text="Type-safe. Modern. Minimal. Fast."
							speed={3}
							className="text-gray-600 text-xs xs:text-sm sm:text-base dark:text-gray-400"
						/>
					</div>
				</div>

				<div className="-z-10 absolute inset-0">
					<div className="-skew-y-12 absolute inset-0 transform bg-gradient-to-r from-blue-300/20 to-indigo-300/20 blur-2xl dark:from-purple-500/20 dark:to-indigo-500/20 dark:blur-3xl" />
				</div>
			</div>

			<CustomizableSection />

			<div className="relative w-full pt-8 sm:pt-12">
				<div className="relative mx-auto max-w-5xl">
					<div className="flex items-center justify-center">
						<div className="hidden w-1/3 items-center sm:flex">
							<div className="h-px flex-grow bg-gradient-to-r from-transparent to-blue-500/40" />
							<div className="h-2 w-2 rounded-full bg-blue-500/50" />
						</div>

						<div className="px-4 sm:px-6">
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md sm:h-8 sm:w-8">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<title>Code Icon</title>
									<path
										fillRule="evenodd"
										d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>

						<div className="hidden w-1/3 items-center sm:flex">
							<div className="h-2 w-2 rounded-full bg-indigo-500/50" />
							<div className="h-px flex-grow bg-gradient-to-l from-transparent to-indigo-500/40" />
						</div>
					</div>

					<div className="mt-6 h-px w-full bg-gradient-to-r from-blue-500/20 via-indigo-500/40 to-blue-500/20 sm:hidden" />
				</div>
			</div>

			<Testimonials />
		</main>
	);
}
