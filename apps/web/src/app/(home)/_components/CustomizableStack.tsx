"use client";

import {
	Background,
	type Connection,
	type Edge,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { TechSelector } from "./TechSelector";
import "@xyflow/react/dist/style.css";
import { initialNodes } from "@/lib/constant";
import { CommandDisplay } from "./CommandDisplay";
import { TechNodeComponent } from "./TechNodeComponent";

const initialEdges = [
	{ id: "bun-hono", source: "bun", target: "hono", animated: true },
	{ id: "bun-tanstack", source: "bun", target: "tanstack", animated: true },
	{ id: "hono-libsql", source: "hono", target: "libsql", animated: true },
	{ id: "libsql-drizzle", source: "libsql", target: "drizzle", animated: true },
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
		database: "libsql",
		orm: "drizzle",
		auth: "better-auth",
	});

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

			const sourceNodes = nodes.filter(
				(n) => n.data.isActive && !n.data.isStatic,
			);
			const targetNode = nodes.find((n) => n.id === techId);

			if (!targetNode) return;

			setEdges((eds) =>
				eds.filter(
					(edge) =>
						!nodes.some(
							(n) =>
								n.data.category === category &&
								(edge.source === n.id || edge.target === n.id),
						),
				),
			);

			setEdges((eds) => [
				...eds,
				...sourceNodes.map((source) => ({
					id: `${source.id}-${techId}`,
					source: source.id,
					target: techId,
					animated: true,
				})),
			]);
		},
		[nodes, setNodes, setEdges],
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			const sourceNode = nodes.find((n) => n.id === connection.source);
			const targetNode = nodes.find((n) => n.id === connection.target);

			if (!sourceNode || !targetNode) return;

			if (sourceNode.data.group === targetNode.data.group) {
				return;
			}

			const edgesToRemove = edges.filter((edge) => {
				const edgeTarget = nodes.find((n) => n.id === edge.target);
				return edgeTarget?.data.group === targetNode.data.group;
			});

			setEdges((eds) => {
				const newEdges = eds.filter((edge) => !edgesToRemove.includes(edge));
				return [...newEdges, { ...(connection as Edge), animated: true }];
			});

			setNodes((nds) =>
				nds.map((node) => ({
					...node,
					data: {
						...node.data,
						isActive:
							node.id === connection.source || node.id === connection.target
								? true
								: node.data.group !== targetNode.data.group
									? node.data.isActive
									: false,
					},
				})),
			);
		},
		[nodes, edges, setEdges, setNodes],
	);

	const generateCommand = useCallback(() => {
		const flags: string[] = ["-y"];

		if (activeNodes.database !== "libsql") {
			flags.splice(flags.indexOf("-y"), 1);
			flags.push(`--database ${activeNodes.database}`);
		}

		if (activeNodes.auth !== "better-auth") {
			flags.splice(flags.indexOf("-y"), 1);
			flags.push("--no-auth");
		}

		return `npx create-better-t-stack my-app ${flags.join(" ")}`;
	}, [activeNodes]);

	return (
		<div className="relative w-full max-w-5xl mx-auto z-50 mt-24">
			<TechSelector onSelect={handleTechSelect} activeNodes={activeNodes} />
			<div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 w-96">
				<CommandDisplay command={generateCommand()} />
			</div>
			<div className="bg-gray-950/10 p-4 absolute top-4 right-4 z-50 w-96 rounded-xl border border-gray-800 backdrop-blur-3xl">
				<div className="text-sm text-gray-300">
					Select technologies from the left panel to customize your stack. The
					graph will automatically update connections.
				</div>
			</div>
			<div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl" />
			<div className="h-[600px] relative backdrop-blur-sm bg-gray-950/50 rounded-xl overflow-hidden border border-gray-800">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					fitView
					minZoom={1}
					maxZoom={1}
					zoomOnScroll={false}
					zoomOnPinch={false}
					preventScrolling={false}
					nodesConnectable={true}
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
