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

// Define initial edges with proper connections
const initialEdges = [
	{ id: "bun-hono", source: "bun", target: "hono", animated: true },
	{ id: "bun-tanstack", source: "bun", target: "tanstack", animated: true },
	{ id: "hono-sqlite", source: "hono", target: "sqlite", animated: true },
	{ id: "sqlite-drizzle", source: "sqlite", target: "drizzle", animated: true },
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

interface ActiveNodes {
	backend: string;
	database: string;
	orm: string;
	auth: string;
	packageManager: string;
	features: {
		docker: boolean;
		githubActions: boolean;
		seo: boolean;
		git: boolean;
	};
}

const CustomizableStack = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [activeNodes, setActiveNodes] = useState<ActiveNodes>({
		backend: "hono",
		database: "sqlite",
		orm: "drizzle",
		auth: "better-auth",
		packageManager: "npm",
		features: {
			docker: false,
			githubActions: false,
			seo: false,
			git: true,
		},
	});
	const [windowSize, setWindowSize] = useState("lg");
	const [command, setCommand] = useState("npx create-better-t-stack my-app -y");

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
	useEffect(() => {
		// Generate command whenever activeNodes changes and update the command state
		setCommand(generateCommand());
	}, [activeNodes]);

	// Function to remove connections related to specific category
	const removeConnectionsByCategory = useCallback(
		(category: string) => {
			setEdges((eds) => {
				return eds.filter((edge) => {
					// Find source and target nodes
					const sourceNode = nodes.find((n) => n.id === edge.source);
					const targetNode = nodes.find((n) => n.id === edge.target);

					if (!sourceNode || !targetNode) return true;

					// Remove edges connected to the category being changed
					if (targetNode.data.category === category) return false;

					// Remove edges that connect from the category being changed
					if (sourceNode.data.category === category) return false;

					// For database changes, also remove ORM connections
					if (category === "database" && targetNode.data.category === "orm")
						return false;

					return true;
				});
			});
		},
		[nodes, setEdges],
	);

	const handleTechSelect = useCallback(
		(category: string, techId: string) => {
			// Update active nodes state
			setActiveNodes((prev) => ({
				...prev,
				[category]: techId,
				...(category === "features" && {
					features: {
						...prev.features,
						[techId]: !prev.features[techId as keyof typeof prev.features],
					},
				}),
			}));

			// Update node active states
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

			// Remove old connections for this category
			removeConnectionsByCategory(category);

			// Create new connections based on the selected tech
			if (category === "backend") {
				// Connect backend to database, auth, and other core components
				const database = activeNodes.database;
				const auth = activeNodes.auth;

				setEdges((eds) => [
					...eds,
					{
						id: `bun-${techId}`,
						source: "bun",
						target: techId,
						animated: true,
					},
					{
						id: `${techId}-${database}`,
						source: techId,
						target: database,
						animated: true,
					},
					{
						id: `${techId}-${auth}`,
						source: techId,
						target: auth,
						animated: true,
					},
					{
						id: `${techId}-tanstack`,
						source: techId,
						target: "tanstack",
						animated: true,
					},
				]);
			} else if (category === "database") {
				// Connect backend to database and database to ORM
				const orm = activeNodes.orm;

				setEdges((eds) => [
					...eds,
					{
						id: `hono-${techId}`,
						source: "hono",
						target: techId,
						animated: true,
					},
					// Only add ORM connection if database is not "no-database"
					...(techId !== "no-database"
						? [
								{
									id: `${techId}-${orm}`,
									source: techId,
									target: orm,
									animated: true,
								},
							]
						: []),
				]);
			} else if (category === "orm") {
				// Connect database to ORM
				const database = activeNodes.database;

				// Only add connection if database is not "no-database"
				if (database !== "no-database") {
					setEdges((eds) => [
						...eds,
						{
							id: `${database}-${techId}`,
							source: database,
							target: techId,
							animated: true,
						},
					]);
				}
			} else if (category === "auth") {
				// Connect backend to auth
				setEdges((eds) => [
					...eds,
					{
						id: `hono-${techId}`,
						source: "hono",
						target: techId,
						animated: true,
					},
				]);
			}
		},
		[activeNodes, setNodes, setEdges, removeConnectionsByCategory],
	);

	const isValidConnection = useCallback(
		(connection: Connection) => {
			const sourceNode = nodes.find((n) => n.id === connection.source);
			const targetNode = nodes.find((n) => n.id === connection.target);

			if (!sourceNode || !targetNode) return false;

			// Define valid connection patterns
			if (sourceNode.id === "hono" && targetNode.data.category === "database") {
				return ["postgres", "sqlite", "no-database"].includes(targetNode.id);
			}

			if (sourceNode.id === "hono" && targetNode.data.category === "auth") {
				return ["better-auth", "no-auth"].includes(targetNode.id);
			}

			if (
				["postgres", "sqlite"].includes(sourceNode.id) &&
				targetNode.data.category === "orm"
			) {
				return ["drizzle", "prisma"].includes(targetNode.id);
			}

			return false;
		},
		[nodes],
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			if (!isValidConnection(connection)) return;

			const targetNode = nodes.find((n) => n.id === connection.target);
			if (!targetNode || !targetNode.data.category) return;

			// Remove existing connections for the category we're connecting to
			removeConnectionsByCategory(targetNode.data.category);

			// Update active nodes state
			setActiveNodes((prev) => ({
				...prev,
				[targetNode.data.category]: connection.target,
			}));

			// Update node active states
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

			// Add the new connection
			setEdges((eds) => [
				...eds,
				{
					id: `${connection.source}-${connection.target}`,
					source: connection.source,
					target: connection.target,
					animated: true,
				},
			]);

			// If connecting to database, also connect to the active ORM
			if (
				targetNode.data.category === "database" &&
				targetNode.id !== "no-database"
			) {
				const activeOrm = nodes.find(
					(n) => n.data.category === "orm" && n.data.isActive,
				);
				if (activeOrm) {
					setEdges((eds) => [
						...eds,
						{
							id: `${connection.target}-${activeOrm.id}`,
							source: connection.target,
							target: activeOrm.id,
							animated: true,
						},
					]);
				}
			}
		},
		[nodes, setEdges, setNodes, removeConnectionsByCategory, isValidConnection],
	);

	const generateCommand = useCallback(() => {
		// Start with the base command
		const command = "npx create-better-t-stack my-app";
		const flags: string[] = [];

		// Check if all defaults are being used
		const isAllDefaults =
			activeNodes.database === "sqlite" &&
			activeNodes.auth === "better-auth" &&
			activeNodes.orm === "drizzle" &&
			activeNodes.packageManager === "npm" &&
			activeNodes.features.git === true &&
			!activeNodes.features.docker &&
			!activeNodes.features.githubActions &&
			!activeNodes.features.seo;

		// If using all defaults, just use -y flag
		if (isAllDefaults) {
			return `${command} -y`;
		}

		// Database options
		if (activeNodes.database === "postgres") {
			flags.push("--postgres");
		} else if (activeNodes.database === "sqlite") {
			flags.push("--sqlite");
		} else if (activeNodes.database === "no-database") {
			flags.push("--no-database");
		}

		// Authentication options
		if (activeNodes.auth === "better-auth") {
			flags.push("--auth");
		} else if (activeNodes.auth === "no-auth") {
			flags.push("--no-auth");
		}

		// ORM options
		if (activeNodes.orm === "drizzle") {
			flags.push("--drizzle");
		} else if (activeNodes.orm === "prisma") {
			flags.push("--prisma");
		}

		// Package manager options
		if (activeNodes.packageManager !== "npm") {
			flags.push(`--${activeNodes.packageManager}`);
		}

		// Feature flags
		if (activeNodes.features.docker) {
			flags.push("--docker");
		}

		if (activeNodes.features.githubActions) {
			flags.push("--github-actions");
		}

		if (activeNodes.features.seo) {
			flags.push("--seo");
		}

		if (!activeNodes.features.git) {
			flags.push("--no-git");
		}

		return flags.length > 0 ? `${command} ${flags.join(" ")}` : command;
	}, [activeNodes]);

	return (
		<div className="relative w-full max-w-5xl mx-auto z-50 mt-24">
			{/* Command Display - Fixed at top with proper centering */}
			<div className="absolute -top-16 left-0 right-0 mx-auto flex justify-center z-50">
				<CommandDisplay command={command} />
			</div>

			{/* Main container with proper layout */}
			<div className="relative rounded-xl border border-gray-800 overflow-hidden">
				<div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />

				{/* Tech selector fixed to the left side */}
				<div className="absolute left-0 top-0 bottom-0 lg:w-52 md:w-44 w-36 z-50 bg-gray-950/30 border-r border-gray-800/50">
					<TechSelector onSelect={handleTechSelect} activeNodes={activeNodes} />
				</div>

				{/* Help text */}
				<div className="max-sm:hidden bg-gray-950/30 lg:p-4 p-1 absolute lg:top-4 top-2 lg:right-4 right-2 z-50 w-80 rounded-xl border border-gray-800 backdrop-blur-3xl">
					<div className="lg:text-sm text-xs text-gray-300 text-center">
						Select technologies from the left panel to customize your stack. The
						graph will automatically update connections.
					</div>
				</div>

				{/* Flow container with proper spacing from the selector */}
				<div className="h-[600px] lg:pl-52 md:pl-44 pl-36 relative backdrop-blur-sm bg-gray-950/50">
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						nodeTypes={nodeTypes}
						fitView
						maxZoom={windowSize === "sm" ? 0.6 : windowSize === "md" ? 0.6 : 1}
						zoomOnScroll={false}
						zoomOnPinch={false}
						preventScrolling={false}
						nodesConnectable={true}
						nodesDraggable={true}
						connectOnClick={true}
						deleteKeyCode="Delete"
						selectionKeyCode="Shift"
						proOptions={{
							hideAttribution: true,
						}}
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
		</div>
	);
};

export default CustomizableStack;
