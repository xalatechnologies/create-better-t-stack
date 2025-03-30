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
		<main className="flex flex-col items-center justify-start px-2 sm:px-4 md:px-8 pt-24 md:pt-28 pb-10 sm:pb-16">
			<BackgroundGradients />
			<div className="max-w-5xl mx-auto text-center mb-10 sm:mb-16 relative z-10">
				<div className="px-1 sm:px-6 lg:px-8">
					<div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center">
						<h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
							<span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 pb-1">
								Better-T Stack
							</span>
						</h1>

						<div className="mb-1 sm:mb-2">
							<NpmPackage />
						</div>

						<p className="text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-300 max-w-2xl px-1">
							A modern CLI tool for scaffolding end-to-end type-safe TypeScript
							projects with best practices and customizable configurations
						</p>

						<div className="w-full max-w-3xl mx-auto mt-1 sm:mt-2">
							<CodeContainer />
						</div>

						<ShinyText
							text="Type-safe. Modern. Minimal. Fast."
							speed={3}
							className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400"
						/>
					</div>
				</div>

				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-gradient-to-r dark:from-purple-500/20 dark:to-indigo-500/20 from-blue-300/20 to-indigo-300/20 dark:blur-3xl blur-2xl transform -skew-y-12" />
				</div>
			</div>

			<CustomizableSection />

			<div className="w-full pt-8 sm:pt-12 relative">
				<div className="max-w-5xl mx-auto relative">
					<div className="flex items-center justify-center">
						<div className="hidden sm:flex items-center w-1/3">
							<div className="h-px flex-grow bg-gradient-to-r from-transparent to-blue-500/40" />
							<div className="h-2 w-2 rounded-full bg-blue-500/50" />
						</div>

						<div className="px-4 sm:px-6">
							<div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white"
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

						<div className="hidden sm:flex items-center w-1/3">
							<div className="h-2 w-2 rounded-full bg-indigo-500/50" />
							<div className="h-px flex-grow bg-gradient-to-l from-transparent to-indigo-500/40" />
						</div>
					</div>

					<div className="sm:hidden h-px w-full mt-6 bg-gradient-to-r from-blue-500/20 via-indigo-500/40 to-blue-500/20" />
				</div>
			</div>

			<Testimonials />
		</main>
	);
}
