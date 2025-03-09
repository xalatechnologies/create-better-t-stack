interface ActiveNodes {
	backend: string;
	database: string;
	orm: string;
	auth: string;
	packageManager: string;
	addons: {
		docker: boolean;
		githubActions: boolean;
		seo: boolean;
		git: boolean;
	};
}

type TechOption = {
	id: string;
	label: string;
	category: string;
};

const techOptions: Record<string, TechOption[]> = {
	database: [
		{ id: "sqlite", label: "SQLite", category: "database" },
		{ id: "postgres", label: "PostgreSQL", category: "database" },
		{ id: "no-database", label: "No DB", category: "database" },
	],
	orm: [
		{ id: "drizzle", label: "Drizzle", category: "orm" },
		{ id: "prisma", label: "Prisma", category: "orm" },
	],
	auth: [
		{ id: "better-auth", label: "Auth", category: "auth" },
		{ id: "no-auth", label: "No Auth", category: "auth" },
	],
	packageManager: [
		{ id: "npm", label: "NPM", category: "packageManager" },
		{ id: "pnpm", label: "PNPM", category: "packageManager" },
		{ id: "yarn", label: "Yarn", category: "packageManager" },
		{ id: "bun", label: "Bun", category: "packageManager" },
	],
	addons: [
		{ id: "docker", label: "Docker", category: "addons" },
		{ id: "githubActions", label: "GitHub Actions", category: "addons" },
		{ id: "seo", label: "SEO", category: "addons" },
		{ id: "git", label: "Git", category: "addons" },
	],
};

interface TechSelectorProps {
	onSelect: (category: string, techId: string) => void;
	activeNodes: ActiveNodes;
}

export function TechSelector({ onSelect, activeNodes }: TechSelectorProps) {
	return (
		<div className="h-full overflow-y-auto p-3 space-y-5">
			<div className="text-sm font-medium text-gray-200 border-b border-gray-700 pb-2">
				Options
			</div>

			{Object.entries(techOptions)
				.filter(([category]) => category !== "addons")
				.map(([category, options]) => (
					<div key={category} className="space-y-2">
						<div className="text-xs text-gray-400 capitalize">{category}</div>
						<div className="flex flex-wrap gap-1">
							{options.map((option) => (
								<Badge
									key={option.id}
									variant="secondary"
									className={`cursor-pointer hover:bg-gray-700 text-gray-300 ${
										activeNodes[
											category as keyof Omit<ActiveNodes, "addons">
										] === option.id && "bg-blue-600 text-white"
									}`}
									onClick={() => onSelect(category, option.id)}
								>
									{option.label}
								</Badge>
							))}
						</div>
					</div>
				))}

			<div className="space-y-2">
				<div className="text-xs text-gray-400">Addons</div>
				<div className="flex flex-wrap gap-1">
					{techOptions.addons.map((option) => (
						<Badge
							key={option.id}
							variant="secondary"
							className={`cursor-pointer hover:bg-gray-700 text-gray-300 ${
								activeNodes.addons[
									option.id as keyof typeof activeNodes.addons
								] === true && "bg-blue-600 text-white"
							}`}
							onClick={() => onSelect("addons", option.id)}
						>
							{option.label}
						</Badge>
					))}
				</div>
			</div>
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
        px-2 rounded-full py-1 text-xs font-medium
        ${className}
      `}
			{...props}
			onClick={props.onClick}
		>
			{children}
		</span>
	);
};
