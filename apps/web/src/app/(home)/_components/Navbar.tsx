"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PackageIcon from "./Icons";

const Navbar = () => {
	const [activeLink, setActiveLink] = useState("home");
	const [bgStyles, setBgStyles] = useState({});
	const [scrolled, setScrolled] = useState(false);
	const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

	const updateBackground = (linkId: string) => {
		const linkElement = linkRefs.current[linkId];
		if (linkElement) {
			setBgStyles({
				padding: "1rem 0rem",
				width: `${linkElement.clientWidth - 12}px`,
				transform: `translateX(${linkElement.offsetLeft}px)`,
				opacity: 1,
			});
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
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

	return (
		<nav
			className={`fixed top-0 left-0 z-[100] w-screen px-8 py-5 flex items-center justify-between transition-all duration-300 ${
				scrolled
					? "bg-transparent border-transparent"
					: "bg-black/10 backdrop-blur-xl border-b border-white/10"
			}`}
		>
			<div
				className={`flex items-center space-x-2 transition-opacity duration-300 ${scrolled ? "opacity-0" : "opacity-100"}`}
			>
				<div className="bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-200 w-8 h-8 rounded-lg flex items-center justify-center">
					<div className="bg-white w-4 h-4 rounded-sm" />
				</div>
				<span className="text-white font-semibold text-lg">Better T Stack</span>
			</div>

			<div
				className={`flex items-center backdrop-blur-md bg-white/5 rounded-full border border-white/10 py-1 px-1.5 text-sm relative transition-all duration-500 ease-out ${
					scrolled ? "w-[420px]" : "w-[280px]"
				}`}
			>
				<div
					className="absolute transition-all duration-300 ease-in-out bg-white/5 border border-white/10 rounded-full py-2"
					style={bgStyles}
				/>
				<Link
					href="/"
					ref={(ref) => {
						linkRefs.current.home = ref;
					}}
					onMouseOver={() => setActiveLink("home")}
					className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-full relative"
				>
					Home
				</Link>
				<Link
					href="https://www.github.com/better-t-stack/create-better-t-stack"
					target="_blank"
					ref={(ref) => {
						linkRefs.current.github = ref;
					}}
					onMouseOver={() => setActiveLink("github")}
					onMouseLeave={() => setActiveLink("home")}
					className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-full relative flex gap-2 items-center"
				>
					<PackageIcon pm="github" className="w-4 h-4" /> Github
				</Link>
				<Link
					href="https://www.npmjs.com/package/create-better-t-stack"
					target="_blank"
					ref={(ref) => {
						linkRefs.current.npm = ref;
					}}
					onMouseOver={() => setActiveLink("npm")}
					onMouseLeave={() => setActiveLink("home")}
					className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-full relative flex gap-2 items-center"
				>
					<PackageIcon pm="npm" className="w-4 h-4 rounded-full" /> Npm
				</Link>
				<span
					className="text-gray-500 transition-all duration-300"
					style={{
						opacity: scrolled ? 1 : 0,
						transform: scrolled ? "translateY(0)" : "translateY(-8px)",
					}}
				>
					|
				</span>
				<Link
					href="/docs"
					ref={(ref) => {
						linkRefs.current.documentation = ref;
					}}
					onMouseOver={() => setActiveLink("documentation")}
					onMouseLeave={() => setActiveLink("home")}
					style={{
						transform: scrolled ? "translateY(0)" : "translateY(-8px)",
					}}
					className={` hover:text-white transition-all duration-300 py-2 px-4 rounded-full ${
						scrolled
							? "opacity-100 translate-y-0"
							: "opacity-0 pointer-events-none"
					}`}
				>
					Documentation
				</Link>
			</div>

			<div
				className={`transition-opacity duration-300 ${
					scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
				}`}
			>
				<button
					type="button"
					className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
				>
					<span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
					<span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-px text-sm font-medium text-white backdrop-blur-3xl">
						Documentation
					</span>
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
