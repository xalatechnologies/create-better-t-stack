"use client";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PackageIcon from "./Icons";

const Navbar = () => {
	const [activeLink, setActiveLink] = useState("home");
	const [bgStyles, setBgStyles] = useState({});
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

	useEffect(() => {
		const updateBackground = (linkId: string) => {
			const linkElement = linkRefs.current[linkId];
			if (linkElement) {
				setBgStyles({
					padding: "0.75rem 0rem",
					width: `${linkElement.clientWidth - 12}px`,
					transform: `translateX(${linkElement.offsetLeft}px)`,
					opacity: 1,
				});
			}
		};

		updateBackground(activeLink);

		const handleScroll = () => {
			const isScrolled = window.scrollY > 50;
			setScrolled(isScrolled);
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", () => updateBackground(activeLink));

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", () => updateBackground(activeLink));
		};
	}, [activeLink]);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<>
			<nav
				className={`fixed top-0 right-0 z-[100] w-screen px-4 sm:px-8 py-4 flex justify-between items-center transition-all duration-300 ${
					scrolled
						? "bg-transparent border-transparent"
						: "dark:bg-gray-950/80 bg-gray-50/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/50"
				}`}
			>
				<div
					className={`flex flex-row items-center space-x-3 transition-opacity duration-300 ${
						scrolled ? "opacity-0" : "opacity-100"
					}`}
				>
					<div className="w-4 h-4 rounded-sm flex items-center justify-center">
						<span className="dark:text-blue-500 text-blue-600 text-md">$_</span>
					</div>
					<span className="text-gray-600 dark:text-gray-100 font-semibold text-md">
						Better-T Stack
					</span>
				</div>

				<div className="hidden md:flex justify-center">
					<div
						className={`flex items-center backdrop-blur-sm bg-gray-100/90 dark:bg-gray-900/90 rounded-lg border border-gray-200 dark:border-gray-800 py-1 px-1.5 text-sm relative transition-all duration-500 ease-out ${
							scrolled ? "w-[350px]" : "w-[240px]"
						}`}
					>
						<div
							className="absolute transition-all duration-200 ease-in-out bg-white dark:bg-gray-800 rounded-md shadow-sm"
							style={bgStyles}
						/>
						<Link
							href="/"
							ref={(ref) => {
								linkRefs.current.home = ref;
							}}
							onMouseOver={() => setActiveLink("home")}
							className="text-gray-700 dark:text-gray-300 dark:hover:text-blue-300 hover:text-blue-600 transition-colors py-2 px-4 rounded-md relative font-mono"
						>
							<span className="text-blue-600 dark:text-blue-400">~/</span>
							home
						</Link>

						<Link
							href="https://my-better-t-app-client.pages.dev/"
							target="_blank"
							ref={(ref) => {
								linkRefs.current.demo = ref;
							}}
							onMouseOver={() => setActiveLink("demo")}
							onMouseLeave={() => setActiveLink("home")}
							className="text-gray-700 dark:text-gray-300 dark:hover:text-blue-300 hover:text-blue-600 transition-colors py-2 px-4 rounded-md relative flex gap-2 items-center font-mono"
						>
							<span>demo</span>
						</Link>

						<Link
							href="https://www.npmjs.com/package/create-better-t-stack"
							target="_blank"
							ref={(ref) => {
								linkRefs.current.npm = ref;
							}}
							onMouseOver={() => setActiveLink("npm")}
							onMouseLeave={() => setActiveLink("home")}
							className="text-gray-700 dark:text-gray-300 dark:hover:text-blue-300 hover:text-blue-600 transition-colors py-2 px-4 rounded-md relative flex gap-2 items-center font-mono"
						>
							<PackageIcon pm="npm" className="w-4 h-4 rounded-full" />{" "}
							<span>npm</span>
						</Link>

						<Link
							href="https://www.github.com/better-t-stack/create-better-t-stack"
							target="_blank"
							ref={(ref) => {
								linkRefs.current.github = ref;
							}}
							onMouseOver={() => setActiveLink("github")}
							onMouseLeave={() => setActiveLink("home")}
							className={`text-gray-700 dark:text-gray-300 dark:hover:text-blue-300 hover:text-blue-600 transition-colors py-2 px-4 rounded-md relative flex gap-2 items-center font-mono ${
								scrolled
									? "opacity-100 translate-y-0"
									: "opacity-0 pointer-events-none"
							}`}
						>
							<Github className="size-4 mr-1">
								<title>GitHub</title>
							</Github>{" "}
							Github
						</Link>
					</div>
				</div>

				<div
					className={`hidden md:flex justify-end transition-opacity duration-300 ${
						scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
					}`}
				>
					<Link
						href="https://www.github.com/better-t-stack/create-better-t-stack"
						target="_blank"
						className="inline-flex items-center backdrop-blur-sm bg-gray-100/90 dark:bg-gray-900/90 rounded-lg border border-gray-200 dark:border-gray-800 py-1 px-4 text-sm font-mono text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
					>
						<Github className="size-4 mr-2">
							<title>GitHub</title>
						</Github>
						Star on GitHub
					</Link>
				</div>

				<button
					type="button"
					onClick={toggleMobileMenu}
					className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 focus:outline-none"
					aria-expanded={mobileMenuOpen}
				>
					{mobileMenuOpen ? (
						<X className="size-5" aria-hidden="true" />
					) : (
						<Menu className="size-5" aria-hidden="true" />
					)}
					<span className="sr-only">Toggle menu</span>
				</button>
			</nav>

			{/* Mobile Menu - Terminal Style */}
			<div
				className={`md:hidden fixed inset-0 z-[99] pt-16 backdrop-blur-md transition-all duration-300 ease-in-out ${
					mobileMenuOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			>
				<div className="mx-4 mt-4 bg-gray-100/95 dark:bg-gray-900/95 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
					{/* Terminal Header */}
					<div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center">
						<div className="flex space-x-2 mr-4">
							<div className="w-3 h-3 bg-red-500 rounded-full" />
							<div className="w-3 h-3 bg-yellow-500 rounded-full" />
							<div className="w-3 h-3 bg-green-500 rounded-full" />
						</div>
						<div className="text-sm font-mono text-gray-600 dark:text-gray-300">
							better-t-stack:~
						</div>
					</div>

					{/* Terminal Body */}
					<div className="p-4 font-mono text-sm">
						<div className="pb-3">
							<span className="text-green-600 dark:text-green-500">
								user@better-t-stack
							</span>
							<span className="text-gray-600 dark:text-gray-400">:~$</span>
							<span className="ml-2 text-gray-800 dark:text-gray-200">
								ls -la
							</span>
						</div>

						<div className="space-y-2 pl-4 border-l-2 border-gray-300 dark:border-gray-700">
							<Link
								href="/"
								className="block text-blue-600 dark:text-blue-400 hover:underline"
								onClick={() => setMobileMenuOpen(false)}
							>
								~/home
							</Link>

							<Link
								href="https://my-better-t-app-client.pages.dev/"
								target="_blank"
								className="block text-blue-600 dark:text-blue-400 hover:underline"
								onClick={() => setMobileMenuOpen(false)}
							>
								~/demo
							</Link>

							<div className="flex items-center">
								<PackageIcon pm="npm" className="w-4 h-4 mr-2" />
								<Link
									href="https://www.npmjs.com/package/create-better-t-stack"
									target="_blank"
									className="block text-blue-600 dark:text-blue-400 hover:underline"
									onClick={() => setMobileMenuOpen(false)}
								>
									~/npm
								</Link>
							</div>

							<div className="flex items-center">
								<Github className="size-4 mr-2 text-gray-700 dark:text-gray-300" />
								<Link
									href="https://www.github.com/better-t-stack/create-better-t-stack"
									target="_blank"
									className="block text-blue-600 dark:text-blue-400 hover:underline"
									onClick={() => setMobileMenuOpen(false)}
								>
									~/github
								</Link>
							</div>
						</div>

						<div className="mt-6 pb-3">
							<span className="text-green-600 dark:text-green-500">
								user@better-t-stack
							</span>
							<span className="text-gray-600 dark:text-gray-400">:~$</span>
							<span className="ml-2 text-gray-800 dark:text-gray-200">
								star-repo
							</span>
						</div>

						<div className="pl-4 border-l-2 border-gray-300 dark:border-gray-700 pb-2">
							<Link
								href="https://www.github.com/better-t-stack/create-better-t-stack"
								target="_blank"
								className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Github className="size-5 mr-2" />
								Star on GitHub
							</Link>
						</div>

						<div className="mt-4">
							<span className="text-green-600 dark:text-green-500">
								user@better-t-stack
							</span>
							<span className="text-gray-600 dark:text-gray-400">:~$</span>
							<span className="animate-pulse ml-2">█</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
