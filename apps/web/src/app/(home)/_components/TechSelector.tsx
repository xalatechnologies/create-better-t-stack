type TechOption = {
	id: string;
	label: string;
	category: string;
};

const techOptions: Record<string, TechOption[]> = {
	database: [
		{ id: "sqlite", label: "Sqlite", category: "database" },
		{ id: "postgres", label: "PostgreSQL", category: "database" },
	],
	orm: [
		{ id: "drizzle", label: "Drizzle", category: "orm" },
		{ id: "prisma", label: "Prisma", category: "orm" },
	],
	auth: [
		{ id: "better-auth", label: "Better-Auth", category: "auth" },
		{ id: "no-auth", label: "No Auth", category: "auth" },
	],
};

interface TechSelectorProps {
	onSelect: (category: string, techId: string) => void;
	activeNodes: Record<string, string>;
}

export function TechSelector({ onSelect, activeNodes }: TechSelectorProps) {
	return (
		<div className="absolute max-sm:w-11/12 top-4 left-4 z-50 sm:space-y-4 space-y-2 bg-gray-950/10 sm:p-4 px-4 py-2 rounded-xl border border-gray-800 backdrop-blur-3xl">
			<div className="text-sm font-medium text-gray-200">Customize Stack</div>
			{Object.entries(techOptions).map(([category, options]) => (
				<div key={category} className="space-y-2">
					<div className="text-xs text-gray-400 capitalize">{category}</div>
					<div className="flex gap-2">
						{options.map((option) => (
							<Badge
								key={option.id}
								variant="secondary"
								className={`cursor-pointer hover:bg-gray-700 ${
									activeNodes[category] === option.id &&
									"bg-blue-600 text-white"
								}`}
								onClick={() => onSelect(category, option.id)}
							>
								{option.label}
							</Badge>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

const Badge = ({
	children,
	className,
	...props
}: {
	children: React.ReactNode;
	variant: "primary" | "secondary";
	className?: string;
	onClick?: () => void;
}) => {
	return (
		<span
			className={`
        px-2 rounded-full py-1 text-xs font-medium,
        ${className}
      `}
			{...props}
			onClick={props.onClick}
		>
			{children}
		</span>
	);
};
