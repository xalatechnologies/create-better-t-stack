import { Handle, Position } from "@xyflow/react";

const categoryIndicators = {
	core: "before:bg-amber-500",
	frontend: "before:bg-blue-500",
	backend: "before:bg-emerald-500",
	database: "before:bg-purple-500",
	auth: "before:bg-red-500",
	orm: "before:bg-orange-500",
};

interface TechNodeData {
	category: keyof typeof categoryIndicators;
	isActive: boolean;
	label: string;
	description: string;
	isDefault?: boolean;
	isStatic?: boolean;
}

export function TechNodeComponent({ data }: { data: TechNodeData }) {
	const baseStyles = `
				relative lg:px-5 lg:py-4 px-3 py-1 rounded-lg
				transition-all duration-300
				dark:border-white/20 border-gray-300/30
				before:content-[''] before:absolute before:left-0 before:top-0 before:w-1.5 before:h-full
				before:rounded-l-xl ${categoryIndicators[data.category]}
		`;

	const activeStyles = data.isActive
		? "opacity-100 dark:bg-gradient-to-br dark:from-indigo-900/30 dark:to-violet-900/30 bg-gradient-to-br from-indigo-50 to-violet-50"
		: "opacity-80 hover:opacity-95 dark:bg-slate-800 bg-slate-100";

	return (
		<div className="relative group">
			{data.label !== "Bun" && (
				<Handle
					type="target"
					position={Position.Top}
					className="!w-2 !h-2 !bg-indigo-400/70 dark:!bg-indigo-400/70"
				/>
			)}

			<div className={`${baseStyles} ${activeStyles} backdrop-blur-3xl`}>
				<div className="dark:text-white text-gray-800 font-medium lg:text-sm text-xs tracking-wide lg:mb-1.5 mb-1">
					{data.label}
				</div>
				<div className="lg:text-[11px] text-[9px] leading-relaxed dark:text-white/80 text-gray-700">
					{data.description}
				</div>
				{!data.isDefault && !data.isStatic && (
					<div className="lg:text-[10px] text-[8px] dark:text-indigo-200/70 text-indigo-500/70 mt-2 italic">
						Alternative Option
					</div>
				)}
			</div>

			<Handle
				type="source"
				position={Position.Bottom}
				className="!w-2 !h-2 !bg-indigo-400/70 dark:!bg-indigo-400/70"
			/>
		</div>
	);
}
