"use client";
import { Button } from "@/components/ui/button";
import { TECH_OPTIONS } from "@/lib/constant";
import { motion } from "motion/react";
import Link from "next/link";
import FeatureCard from "./_components/FeatureCard";
import CodeContainer from "./_components/code-container";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import SponsorsSection from "./_components/sponsors-section";
import Testimonials from "./_components/testimonials";

export default function HomePage() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
			},
		},
	};

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

	const sectionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const frontendOptions = TECH_OPTIONS.webFrontend.filter(
		(option) => option.id !== "none",
	);
	const backendOptions = TECH_OPTIONS.backend.filter(
		(option) => option.id !== "none",
	);
	const runtimeOptions = TECH_OPTIONS.runtime.filter(
		(option) => option.id !== "none",
	);
	const apiLayerOptions = TECH_OPTIONS.api.filter(
		(option) => option.id !== "none",
	);
	const databaseOptions = TECH_OPTIONS.database.filter(
		(option) => option.id !== "none",
	);
	const ormOptions = TECH_OPTIONS.orm.filter((option) => option.id !== "none");
	const dbSetupOptions = TECH_OPTIONS.dbSetup.filter(
		(option) => option.id !== "none",
	);
	const addonsOptions = TECH_OPTIONS.addons.filter(
		(option) => option.id !== "none",
	);
	const examplesOptions = TECH_OPTIONS.examples.filter(
		(option) => option.id !== "none",
	);

	return (
		<>
			<Navbar />
			<main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-background px-4 pt-24 pb-10 sm:px-6 md:px-8 md:pt-28 lg:pt-32">
				<motion.div
					className="relative z-10 mx-auto mb-12 w-full max-w-6xl sm:mb-16"
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
						<motion.div
							className="mt-10 text-center lg:text-left"
							variants={itemVariants}
						>
							<motion.h1
								className="font-bold font-mono text-5xl xs:text-6xl tracking-tight sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl"
								variants={itemVariants}
							>
								<span className="text-foreground dark:text-primary">
									Roll Your Own Stack
								</span>
							</motion.h1>

							<motion.p
								className="mx-auto mt-6 max-w-xl font-mono text-lg text-muted-foreground sm:text-xl lg:mx-0"
								variants={itemVariants}
							>
								A modern CLI tool for scaffolding end-to-end type-safe
								TypeScript projects with best practices and customizable
								configurations.
							</motion.p>

							<motion.div
								variants={itemVariants}
								className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
							>
								<Link href="/new">
									<Button
										size="lg"
										variant="default"
										className="w-full font-mono sm:w-auto"
									>
										Go to Stack Builder
									</Button>
								</Link>
								{/* <ShinyText
									text="Type-safe. Modern. Minimal. Fast."
									speed={3}
									className="font-mono text-muted-foreground text-xs xs:text-sm sm:text-base"
								/> */}
							</motion.div>
						</motion.div>

						<motion.div className="mx-auto w-full" variants={itemVariants}>
							<CodeContainer />
							<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
								<FeatureCard title="Frontend" options={frontendOptions} />
								<FeatureCard title="Backend" options={backendOptions} />
								<FeatureCard title="Runtime" options={runtimeOptions} />
								<FeatureCard title="API Layer" options={apiLayerOptions} />
								<FeatureCard title="Database" options={databaseOptions} />
								<FeatureCard title="ORM" options={ormOptions} />
								<FeatureCard title="Database Setup" options={dbSetupOptions} />
								<FeatureCard title="Addons" options={addonsOptions} />
								<FeatureCard title="Examples" options={examplesOptions} />
							</div>
						</motion.div>
					</div>
				</motion.div>

				<motion.div
					className="w-full"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
					variants={sectionVariants}
				>
					<Testimonials />
				</motion.div>

				<motion.div
					className="w-full"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
					variants={sectionVariants}
				>
					<SponsorsSection />
				</motion.div>
			</main>
			<Footer />
		</>
	);
}
