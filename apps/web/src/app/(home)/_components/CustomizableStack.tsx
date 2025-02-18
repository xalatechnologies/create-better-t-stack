"use client";

import {
	Background,
	type Connection,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { TechSelector } from "./TechSelector";
import "@xyflow/react/dist/style.css";
import { initialNodes } from "@/lib/constant";
import { CommandDisplay } from "./CommandDisplay";
import { TechNodeComponent } from "./TechNodeComponent";

const initialEdges = [
	{ id: "bun-hono", source: "bun", target: "hono", animated: true },
	{ id: "bun-tanstack", source: "bun", target: "tanstack", animated: true },
	{ id: "hono-libsql", source: "hono", target: "sqlite", animated: true },
	{ id: "libsql-drizzle", source: "sqlite", target: "drizzle", animated: true },
	{
		id: "hono-better-auth",
		source: "hono",
		target: "better-auth",
		animated: true,
	},
	{ id: "bun-tailwind", source: "bun", target: "tailwind", animated: true },
	{
		id: "tailwind-shadcn",
		source: "tailwind",
		target: "shadcn",
		animated: true,
	},
];

const nodeTypes = {
	techNode: TechNodeComponent,
};

const CustomizableStack = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [activeNodes, setActiveNodes] = useState({
		backend: "hono",
		database: "sqlite",
		orm: "drizzle",
		auth: "better-auth",
	});
	const [windowSize, setWindowSize] = useState("lg");

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 1024 && window.innerWidth > 768) {
				setWindowSize("md");
			} else if (window.innerWidth < 768) {
				setWindowSize("sm");
			} else {
				setWindowSize("lg");
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const cleanupConnectionsByCategory = useCallback((category: string) => {
		setEdges((eds) =>
			eds.filter((edge) => {
				if (category === "database") {
					return !(
						["postgres", "sqlite"].includes(edge.target) ||
						["postgres", "sqlite"].includes(edge.source) ||
						edge.target === "drizzle" ||
						edge.target === "prisma"
					);
				}
				if (category === "orm") {
					return !(edge.target === "drizzle" || edge.target === "prisma");
				}
				if (category === "auth") {
					return !["better-auth", "no-auth"].includes(edge.target);
				}
				return true;
			}),
		);
	}, []);

	const handleTechSelect = useCallback(
		(category: string, techId: string) => {
			setActiveNodes((prev) => ({ ...prev, [category]: techId }));

			setNodes((nds) =>
				nds.map((node) => ({
					...node,
					data: {
						...node.data,
						isActive: node.data.isStatic
							? true
							: node.data.category === category
								? node.id === techId
								: node.data.isActive,
					},
				})),
			);

			cleanupConnectionsByCategory(category);

			if (category === "database") {
				const honoNode = nodes.find((n) => n.id === "hono");
				const ormNode = nodes.find(
					(n) => n.data.category === "orm" && n.data.isActive,
				);

				if (honoNode && ormNode) {
					setEdges((eds) => [
						...eds,
						{
							id: `hono-${techId}`,
							source: "hono",
							target: techId,
							animated: true,
						},
						{
							id: `${techId}-${ormNode.id}`,
							source: techId,
							target: ormNode.id,
							animated: true,
						},
					]);
				}
			} else if (category === "auth") {
				setEdges((eds) => [
					...eds,
					{
						id: `hono-${techId}`,
						source: "hono",
						target: techId,
						animated: true,
					},
				]);
			} else if (category === "orm") {
				const dbNode = nodes.find(
					(n) => n.data.category === "database" && n.data.isActive,
				);
				if (dbNode) {
					setEdges((eds) => [
						...eds,
						{
							id: `${dbNode.id}-${techId}`,
							source: dbNode.id,
							target: techId,
							animated: true,
						},
					]);
				}
			}
		},
		[nodes, setNodes, setEdges, cleanupConnectionsByCategory],
	);

	const isValidConnection = useCallback(
		(connection: Connection) => {
			const sourceNode = nodes.find((n) => n.id === connection.source);
			const targetNode = nodes.find((n) => n.id === connection.target);

			if (!sourceNode || !targetNode) return false;

			if (sourceNode.id === "hono" && targetNode.data.category === "database") {
				return ["postgres", "sqlite"].includes(targetNode.id);
			}

			if (sourceNode.id === "hono" && targetNode.data.category === "auth") {
				return ["better-auth", "no-auth"].includes(targetNode.id);
			}

			if (
				["postgres", "sqlite"].includes(sourceNode.id) &&
				targetNode.data.category === "orm"
			) {
				return true;
			}

			return false;
		},
		[nodes],
	);

	const cleanupPreviousConnections = useCallback(
		(connection: Connection) => {
			const sourceNode = nodes.find((n) => n.id === connection.source);
			const targetNode = nodes.find((n) => n.id === connection.target);
			if (!targetNode || !sourceNode) return;

			cleanupConnectionsByCategory(targetNode.data.category);
		},
		[nodes, cleanupConnectionsByCategory],
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			if (!isValidConnection(connection)) return;
			cleanupPreviousConnections(connection);
			const targetNode = nodes.find((n) => n.id === connection.target);
			if (!targetNode) return;

			setEdges((eds) => {
				const newEdges = [
					...eds,
					{
						id: `${connection.source}-${connection.target}`,
						source: connection.source,
						target: connection.target,
						animated: true,
					},
				];

				if (targetNode.data.category === "database") {
					const activeOrm = nodes.find(
						(n) => n.data.category === "orm" && n.data.isActive,
					);
					if (activeOrm) {
						newEdges.push({
							id: `${connection.target}-${activeOrm.id}`,
							source: connection.target,
							target: activeOrm.id,
							animated: true,
						});
					}
				}

				return newEdges;
			});

			if (targetNode.data.category) {
				setActiveNodes((prev) => ({
					...prev,
					[targetNode.data.category]: connection.target,
				}));

				setNodes((nds) =>
					nds.map((node) => ({
						...node,
						data: {
							...node.data,
							isActive: node.data.isStatic
								? true
								: node.data.category === targetNode.data.category
									? node.id === connection.target
									: node.data.isActive,
						},
					})),
				);
			}
		},
		[nodes, setEdges, setNodes, cleanupPreviousConnections, isValidConnection],
	);

	const generateCommand = useCallback(() => {
		const flags: string[] = ["-y"];

		if (activeNodes.database !== "sqlite") {
			flags.splice(flags.indexOf("-y"), 1);
			flags.push(`--${activeNodes.database}`);
		}

		if (activeNodes.auth !== "better-auth") {
			if (flags.includes("-y")) {
				flags.splice(flags.indexOf("-y"), 1);
			}
			flags.push("--no-auth");
		}

		return `npx create-better-t-stack my-app ${flags.join(" ")}`;
	}, [activeNodes]);

	return (
		<div className="relative w-full max-w-5xl mx-auto z-50 mt-24">
			<TechSelector onSelect={handleTechSelect} activeNodes={activeNodes} />
			<div className="absolute -top-16 left-1/2 max-sm:left-[60%] -translate-x-1/2 z-50 w-96">
				<CommandDisplay command={generateCommand()} />
			</div>
			<div className="max-sm:hidden bg-gray-950/10 lg:p-4 p-1 absolute lg:top-4 top-2 lg:right-4 right-2 z-50 w-80 rounded-xl border border-gray-800 backdrop-blur-3xl">
				<div className="lg:text-sm text-xs text-gray-300 text-center">
					Select technologies from the left panel to customize your stack. The
					graph will automatically update connections.
				</div>
			</div>
			<div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl" />
			<div className="h-[600px] lg:pl-28 max-sm:pt-36  relative backdrop-blur-sm bg-gray-950/50 rounded-xl overflow-hidden border border-gray-800">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					fitView
					// minZoom={1}
					maxZoom={windowSize === "sm" ? 0.6 : windowSize === "md" ? 0.6 : 1}
					zoomOnScroll={false}
					zoomOnPinch={false}
					preventScrolling={false}
					nodesConnectable={true}
					nodesDraggable={false}
					connectOnClick={true}
					deleteKeyCode="Delete"
					selectionKeyCode="Shift"
				>
					<Background
						className="bg-gray-950/5"
						color="#1e293b"
						gap={12}
						size={1}
					/>
				</ReactFlow>
			</div>
		</div>
	);
};

export default CustomizableStack;
