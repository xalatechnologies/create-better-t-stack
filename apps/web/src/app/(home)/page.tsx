"use client";
import ShinyText from "@/app/(home)/_components/ShinyText";
import React from "react";
import CodeContainer from "./_components/CodeContainer";
import CustomizableSection from "./_components/CustomizableSection";
import NpmPackage from "./_components/NpmPackage";
import TechConstellation from "./_components/TechConstellation";
// import TerminalDisplay from "./_components/Terminal";
import Testimonials from "./_components/Testimonials";

export default function HomePage() {
	return (
		<main className="flex flex-col items-center justify-start sm:p-8 p-4 !pt-40">
			<div className="max-w-6xl mx-auto text-center mb-16 relative z-50 ">
				<div className="relative z-10">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<h1 className="text-6xl font-extrabold text-white">
							<span className="block sm:text-7xl text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
								Better-T Stack
							</span>
							<span className="relative">
								<span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
							</span>
						</h1>
						<NpmPackage />

						<p className="sm:text-2xl text-xl font-medium text-gray-300 max-w-2xl">
							<span className="inline-block transform hover:scale-105 transition-transform duration-200">
								Scaffold
							</span>{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
								production-ready
							</span>{" "}
							<span className="inline-block transition-transform duration-200">
								Better-T projects in seconds
							</span>
						</p>
						<CodeContainer />
						<ShinyText
							text="Be the safest developer with typesafe Typescript"
							speed={3}
							className="sm:text-lg text-md"
						/>
					</div>
				</div>
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl transform -skew-y-12" />
				</div>
			</div>
			{/* <TerminalDisplay /> */}

			<div className="w-full max-w-6xl mx-auto space-y-12 mt-12 relative z-50">
				<div className="text-center space-y-6 relative z-10 border border-gray-700/30 p-6 rounded-md bg-gray-950/30 backdrop-blur-3xl">
					<div className="relative">
						<h2 className="relative sm:text-4xl text-3xl md:text-5xl font-bold pb-3 group">
							<span className="text-blue-400 font-mono mr-1 animate-pulse">
								{">"}
							</span>
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-indigo-500 hover:from-indigo-400 hover:to-blue-500 transition-all duration-300">
								A Symphony of Modern Tech
							</span>
						</h2>
						<div className="absolute -inset-1 bg-gradient-to-r from-gray-800/0 via-gray-700/10 to-gray-800/0 blur-xl -z-10" />
					</div>
					<div className="space-y-4 max-w-3xl mx-auto">
						<p className="sm:text-xl text-gray-300 leading-relaxed font-mono">
							<span className="text-yellow-400">$</span> carefully orchestrated
							stack of{" "}
							<span className="text-blue-500 font-semibold">
								cutting-edge technologies
							</span>
							, working in perfect harmony
						</p>{" "}
						<div className="flex flex-wrap justify-center sm:gap-4 gap-2 sm:text-sm text-xs text-gray-400">
							<span className="px-3 py-1 bg-black border border-gray-700 rounded-sm hover:bg-gray-900/50 transition-colors">
								--end-to-end-type-safety
							</span>
							<span className="px-3 py-1 bg-black border border-gray-700 rounded-sm hover:bg-gray-900/50 transition-colors">
								--lightning-fast
							</span>
							<span className="px-3 py-1 bg-black border border-gray-700 rounded-sm hover:bg-gray-900/50 transition-colors">
								--modern-tools
							</span>
						</div>
					</div>
					{/* <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/10 to-transparent -z-10" /> */}
				</div>
			</div>
			<TechConstellation />
			<CustomizableSection />
			<Testimonials />
		</main>
	);
}
