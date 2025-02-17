"use client";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
	const [activeLink, setActiveLink] = useState("about");
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
			className={`fixed top-0 left-0 z-50 w-screen px-8 py-5 flex items-center justify-between transition-all duration-300 ${
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
					scrolled ? "w-[480px]" : "w-[350px]"
				}`}
			>
				<div
					className="absolute transition-all duration-300 ease-in-out bg-white/5 border border-white/10 rounded-full py-2"
					style={bgStyles}
				/>
				{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
				<a
					href="#about"
					ref={(ref) => {
						linkRefs.current.about = ref;
					}}
					onClick={() => setActiveLink("about")}
					className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-full relative"
				>
					About
				</a>
				{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
				<a
					href="#careers"
					ref={(ref) => {
						linkRefs.current.careers = ref;
					}}
					onClick={() => setActiveLink("careers")}
					className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-full relative"
				>
					Careers
				</a>
				{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
				<a
					href="#blog"
					ref={(ref) => {
						linkRefs.current.blog = ref;
					}}
					onClick={() => setActiveLink("blog")}
					className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-full relative"
				>
					Blog
				</a>
				{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
				<a
					href="#changelog"
					ref={(ref) => {
						linkRefs.current.changelog = ref;
					}}
					onClick={() => setActiveLink("changelog")}
					className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-full relative"
				>
					Changelog
				</a>
				<span
					className="text-gray-500 transition-all duration-300"
					style={{
						opacity: scrolled ? 1 : 0,
						transform: scrolled ? "translateY(0)" : "translateY(-8px)",
					}}
				>
					|
				</span>
				{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
				<a
					href="#documentation"
					ref={(ref) => {
						linkRefs.current.documentation = ref;
					}}
					onClick={() => setActiveLink("documentation")}
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
				</a>
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
