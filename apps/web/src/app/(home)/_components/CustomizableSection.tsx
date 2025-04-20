import { cn } from "@/lib/utils";
import { Code, Sliders, Terminal, TerminalSquare } from "lucide-react";
import { motion } from "motion/react";
import StackArchitect from "./StackArchitech";

export default function CustomizableSection() {
	return (
		<section className="relative z-10 mx-auto mt-20 w-full max-w-7xl space-y-16 px-4 sm:px-6">
			<div className="relative space-y-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					<h2 className="font-bold font-mono text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
						<span className="border-primary border-b-2 pb-1 text-foreground dark:text-primary">
							Your Stack, Your Choice
						</span>
					</h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mx-auto max-w-3xl space-y-6"
				>
					<p className="font-mono text-lg text-muted-foreground leading-relaxed sm:text-xl">
						Configure your ideal TypeScript environment with all the options you
						need
					</p>

					<div className="flex flex-wrap justify-center gap-2 text-muted-foreground text-xs sm:gap-3 sm:text-sm">
						<div className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-3 py-1.5 shadow-sm transition-colors">
							<Terminal className="h-3.5 w-3.5">
								<title>Runtime Options</title>
							</Terminal>
							<span>--runtime</span>
						</div>
						<div className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-3 py-1.5 shadow-sm transition-colors">
							<Code className="h-3.5 w-3.5">
								<title>Framework Options</title>
							</Code>
							<span>--framework</span>
						</div>
						<div className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-3 py-1.5 shadow-sm transition-colors">
							<TerminalSquare className="h-3.5 w-3.5">
								<title>Database Options</title>
							</TerminalSquare>
							<span>--database</span>
						</div>
						<div className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-3 py-1.5 shadow-sm transition-colors">
							<Sliders className="h-3.5 w-3.5">
								<title>Addon Options</title>
							</Sliders>
							<span>--addons</span>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.4, delay: 0.3 }}
					className="flex flex-wrap justify-center gap-2 pt-2 sm:gap-3"
				>
					<Badge color="chart-5">Bun or Node</Badge>
					<Badge color="chart-2">Hono or Elysia</Badge>
					<Badge color="chart-3">SQLite or PostgreSQL</Badge>
					<Badge color="chart-2">Drizzle or Prisma</Badge>
					<Badge color="chart-4">Authentication</Badge>
					<Badge color="chart-1">Optional Addons</Badge>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-50px" }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="relative"
			>
				<StackArchitect />
			</motion.div>
		</section>
	);
}

function Badge({
	children,
	color,
}: { children: React.ReactNode; color: string }) {
	const baseClasses =
		"rounded-full border px-2.5 py-1 font-medium text-xs shadow-sm";

	const colorClasses = `bg-[--color-${color}]/10 text-[--color-${color}] border-[--color-${color}]/30`;

	return <span className={cn(baseClasses, colorClasses)}>{children}</span>;
}
