"use client";

import { technologies } from "@/lib/constant";
import { type JSX, useEffect, useRef, useState } from "react";

type TechConstellationProp = {
	fromRef: React.RefObject<HTMLElement>;
	toRef: React.RefObject<HTMLElement>;
	containerRef: React.RefObject<HTMLElement>;
	delay?: number;
	curveDirection?: number;
};

const AnimatedBeam = ({
	fromRef,
	toRef,
	containerRef,
	delay = 0,
	curveDirection = 50,
}: TechConstellationProp) => {
	const [path, setPath] = useState("");

	useEffect(() => {
		const updatePath = () => {
			if (!fromRef.current || !toRef.current || !containerRef.current) return;

			const containerRect = containerRef.current.getBoundingClientRect();
			const fromRect = fromRef.current.getBoundingClientRect();
			const toRect = toRef.current.getBoundingClientRect();

			const fromX = fromRect.left - containerRect.left + fromRect.width / 2;
			const fromY = fromRect.top - containerRect.top + fromRect.height / 2;
			const toX = toRect.left - containerRect.left + toRect.width / 2;
			const toY = toRect.top - containerRect.top + toRect.height / 2;

			setPath(
				`M ${fromX},${fromY} Q ${(fromX + toX) / 2},${(fromY + toY) / 2 - curveDirection} ${toX},${toY}`,
			);
		};

		updatePath();
		window.addEventListener("resize", updatePath);
		return () => window.removeEventListener("resize", updatePath);
	}, [fromRef, toRef, containerRef, curveDirection]);

	return (
		<svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
			<title>Tech Stack</title>
			<path
				d={path}
				fill="none"
				stroke="url(#gradient)"
				strokeWidth="2"
				className="opacity-30"
			>
				<animate
					attributeName="stroke-dasharray"
					values="0,1000;1000,0"
					dur="3s"
					begin={`${delay}s`}
					repeatCount="indefinite"
				/>
			</path>
			<defs>
				<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
					<stop offset="50%" stopColor="#3B82F6" />
					<stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
};

const TechConstellation = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const centerRef = useRef<HTMLDivElement>(null);
	const techRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const [isVisible, setIsVisible] = useState(false);

	const calculateRadius = (category: string) => {
		switch (category) {
			case "core":
				return 160;
			case "frontend":
			case "backend":
				return 240;
			default:
				return 200;
		}
	};

	const renderCategoryBeams = (category: string) => {
		const categoryTechs = technologies.filter(
			(tech) => tech.category === category,
		);
		const beams: JSX.Element[] = [];

		if (category !== "core") {
			categoryTechs.forEach((tech, index) => {
				const curveDirection = tech.category === "frontend" ? 50 : -50;
				beams.push(
					<AnimatedBeam
						key={`beam-center-${tech.name}`}
						fromRef={centerRef as React.RefObject<HTMLElement>}
						toRef={{ current: techRefs.current[tech.name] as HTMLElement }}
						containerRef={containerRef as React.RefObject<HTMLElement>}
						delay={index * 0.2}
						curveDirection={curveDirection}
					/>,
				);
			});
		}

		for (let i = 0; i < categoryTechs.length - 1; i++) {
			const curveDirection = category === "frontend" ? 30 : -30;
			beams.push(
				<AnimatedBeam
					key={`beam-${categoryTechs[i].name}-${categoryTechs[i + 1].name}`}
					fromRef={{
						current: techRefs.current[categoryTechs[i].name] as HTMLElement,
					}}
					toRef={{
						current: techRefs.current[categoryTechs[i + 1].name] as HTMLElement,
					}}
					containerRef={containerRef as React.RefObject<HTMLElement>}
					delay={(i + categoryTechs.length) * 0.2}
					curveDirection={curveDirection}
				/>,
			);
		}

		if (category === "core") {
			beams.push(
				<AnimatedBeam
					key="beam-core-connection"
					fromRef={{ current: techRefs.current.Bun as HTMLElement }}
					toRef={{ current: techRefs.current.tRPC as HTMLElement }}
					containerRef={containerRef as React.RefObject<HTMLElement>}
					delay={0}
					curveDirection={0}
				/>,
			);
		}

		return beams;
	};

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative w-full h-[90vh] bg-gradient-to-b from-transparent mt-8 via-gray-950 to-transparent overflow-hidden flex items-center justify-center"
		>
			<div
				ref={centerRef}
				className={`absolute z-10 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center transform transition-all duration-1000 ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
			>
				<span className="text-3xl font-bold text-white">TS</span>
			</div>

			{technologies.map((tech, index) => {
				const radius = calculateRadius(tech.category);
				const x = Math.cos((tech.angle * Math.PI) / 180) * radius;
				const y = Math.sin((tech.angle * Math.PI) / 180) * radius;

				return (
					<div
						key={tech.name}
						ref={(el) => {
							techRefs.current[tech.name] = el;
						}}
						className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000
																							${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
						style={{
							left: `calc(50% + ${x}px)`,
							top: `calc(50% + ${y}px)`,
							transitionDelay: `${index * 100}ms`,
						}}
					>
						<div
							className={`w-12 h-12 ${tech.color} rounded-full flex items-center justify-center
																											transform hover:scale-125 transition-all duration-300 cursor-pointer
																											shadow-lg hover:shadow-xl hover:rotate-12`}
						>
							<tech.icon className={`w-6 h-6 ${tech.textColor}`} />
						</div>

						<div
							className={`opacity-100 absolute ${tech.top ? tech.top : "-top-[48px]"} ${tech.left ? tech.left : "left-1/2"} transform -translate-x-1/2
																										bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-xl transition-all duration-300
																										whitespace-nowrap text-xs hover:scale-105`}
						>
							<strong>{tech.name}</strong>
							<p className="text-gray-300 text-[10px]">{tech.description}</p>
						</div>
					</div>
				);
			})}

			{isVisible && (
				<>
					{renderCategoryBeams("core")}
					{renderCategoryBeams("frontend")}
					{renderCategoryBeams("backend")}
				</>
			)}

			<div className="absolute inset-0 overflow-hidden">
				{[...Array(20)].map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={`star-${i}`}
						className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-20"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default TechConstellation;
