"use client";
import { Button } from "@/components/ui/button";
import { TECH_OPTIONS } from "@/lib/constant";
import { Github, Star, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CodeContainer from "./_components/code-container";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import NpmPackage from "./_components/npm-package";
import SponsorsSection from "./_components/sponsors-section";
import Testimonials from "./_components/testimonials";

export default function HomePage() {
	const [stars, setStars] = useState<number | null>(null);
	const [isLoadingStars, setIsLoadingStars] = useState(true);

	useEffect(() => {
		async function fetchStars() {
			try {
				const response = await fetch(
					"https://api.github.com/repos/amanvarshney01/create-better-t-stack",
				);
				if (response.ok) {
					const data = await response.json();
					setStars(data.stargazers_count);
				} else {
					console.error("Failed to fetch GitHub stars");
				}
			} catch (error) {
				console.error("Error fetching GitHub stars:", error);
			} finally {
				setIsLoadingStars(false);
			}
		}
		fetchStars();
	}, []);

	const frontendOptions = [
		...TECH_OPTIONS.webFrontend.filter((option) => option.id !== "none"),
		...TECH_OPTIONS.nativeFrontend.filter((option) => option.id !== "none"),
	];

	const backendOptions = TECH_OPTIONS.backend.filter(
		(option) => option.id !== "none",
	);
	const databaseOptions = TECH_OPTIONS.database.filter(
		(option) => option.id !== "none",
	);
	const runtimeOptions = TECH_OPTIONS.runtime;
	const packageManagerOptions = TECH_OPTIONS.packageManager;
	const apiOptions = TECH_OPTIONS.api.filter((option) => option.id !== "none");
	const ormOptions = TECH_OPTIONS.orm.filter((option) => option.id !== "none");
	const dbSetupOptions = TECH_OPTIONS.dbSetup.filter(
		(option) => option.id !== "none",
	);
	const authOptions = TECH_OPTIONS.auth.filter(
		(option) => option.id !== "false",
	);
	const addonsOptions = TECH_OPTIONS.addons;
	const examplesOptions = TECH_OPTIONS.examples;

	const techStackCategories = [
		{
			category: "Frontend Frameworks",
			options: frontendOptions,
		},
		{
			category: "Backend Frameworks",
			options: backendOptions,
		},
		{
			category: "Database Systems",
			options: databaseOptions,
		},
		{
			category: "Runtime Environments",
			options: runtimeOptions,
		},
		{
			category: "API Layers",
			options: apiOptions,
		},
		{
			category: "ORM Solutions",
			options: ormOptions,
		},
		{
			category: "Database Setup",
			options: dbSetupOptions,
		},
		{
			category: "Authentication",
			options: authOptions,
		},
		{
			category: "Package Managers",
			description: "Dependency management tools",
			options: packageManagerOptions,
		},
		{
			category: "Development Tools",
			options: addonsOptions,
		},
		{
			category: "Example Projects",
			options: examplesOptions,
		},
	];

	return (
		<>
			<Navbar />
			<main className="min-h-svh bg-background">
				<div className="relative h-svh overflow-hidden">
					<div className="relative px-4 pt-32 pb-16 sm:px-6 md:px-8">
						<div className="mx-auto max-w-4xl text-center">
							<div>
								<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3 py-1">
									<Terminal className="h-4 w-4 text-primary" />
									<span className="font-medium text-sm">
										CLI Tool for Developers
									</span>
								</div>
							</div>

							<h1 className="font-bold text-4xl tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
								<span className="text-foreground">Roll Your Own</span>
								<br />
								<span className="text-primary">Stack</span>
							</h1>

							<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
								A modern CLI tool for scaffolding end-to-end type-safe
								TypeScript projects with best practices and customizable
								configurations.
							</p>

							<NpmPackage />

							<div className="mt-8 flex flex-col items-center justify-center gap-4">
								<div className="flex flex-col items-center gap-3 sm:flex-row">
									<Link href="/new">
										<Button size="lg" className="w-full sm:w-auto">
											Stack Builder
										</Button>
									</Link>
									<Link
										href="https://github.com/amanvarshney01/create-better-t-stack"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button
											size="lg"
											variant="outline"
											className="w-full hover:text-primary sm:w-auto"
											disabled={isLoadingStars}
										>
											<Github className="mr-2 h-4 w-4" />
											Star on GitHub
											{stars !== null && !isLoadingStars && (
												<span className="ml-2 flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs">
													<Star className="h-3 w-3 text-yellow-400" />
													{stars}
												</span>
											)}
										</Button>
									</Link>
								</div>
								<CodeContainer />
							</div>
						</div>
					</div>
				</div>

				<div className="px-4 py-16 sm:px-6 md:px-8">
					<div className="mx-auto max-w-6xl">
						<div className="mb-12 text-center">
							<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
								Tech Stack Options
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								Choose from modern, production-ready technologies
							</p>
						</div>

						<div className="overflow-hidden rounded-lg border">
							<table className="w-full">
								<thead className="bg-muted/50">
									<tr>
										<th className="px-6 py-3 text-left font-medium text-muted-foreground text-sm">
											Category
										</th>
										<th className="px-6 py-3 text-left font-medium text-muted-foreground text-sm">
											Options
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{techStackCategories.map((category) => (
										<tr key={category.category} className="hover:bg-muted/30">
											<td className="px-6 py-4">
												<div className="font-medium">{category.category}</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex flex-wrap gap-2">
													{category.options.map((option) => (
														<div
															key={option.id}
															className="flex items-center gap-2 rounded border bg-background px-2 py-1"
														>
															{option.icon && (
																<img
																	src={option.icon}
																	alt={option.name}
																	className="h-4 w-4"
																/>
															)}
															<span className="text-sm">{option.name}</span>
														</div>
													))}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<Testimonials />
				<SponsorsSection />
			</main>
			<Footer />
		</>
	);
}
