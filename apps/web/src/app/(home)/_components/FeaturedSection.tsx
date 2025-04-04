import { ArrowRight, Code2, Shield, Zap } from "lucide-react";
import React from "react";

const Featured = () => {
	return (
		<>
			<div className="relative z-50 mx-auto w-full max-w-6xl py-24">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{[
						{
							icon: Shield,
							title: "Type-Safe by Default",
							description:
								"End-to-end type safety from database to frontend. Catch errors before they happen.",
						},
						{
							icon: Zap,
							title: "Lightning Fast",
							description:
								"Built on Bun's lightning-fast runtime with optimal configurations for performance.",
						},
						{
							icon: Code2,
							title: "Developer Experience",
							description:
								"Modern tooling and intuitive APIs make development a breeze.",
						},
					].map((feature) => (
						<div
							key={feature.title}
							className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700"
						>
							<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
							<feature.icon className="mb-4 h-10 w-10 text-blue-500 dark:text-blue-400" />
							<h3 className="mb-2 font-semibold text-gray-900 text-xl dark:text-white">
								{feature.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="relative z-50 w-full border-gray-200 border-y bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
				<div className="mx-auto max-w-6xl py-24">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl dark:text-white">
							Write Better Code, Faster
						</h2>
						<p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
							Leverage the power of TypeScript with our carefully selected tools
							and frameworks.
						</p>
					</div>

					<div className="grid items-center gap-12 md:grid-cols-2">
						<div className="space-y-6">
							{[
								{
									title: "Type-Safe API Calls",
									description:
										"No more guessing API shapes. tRPC ensures type safety across your stack.",
								},
								{
									title: "Database Type Safety",
									description:
										"Drizzle ORM provides type-safe database queries with great DX.",
								},
								{
									title: "Modern Authentication",
									description:
										"Secure authentication with Better-Auth, built for modern web apps.",
								},
							].map((item) => (
								<div
									key={item.title}
									className="flex items-start space-x-4 rounded-lg p-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50"
								>
									<ArrowRight className="mt-1 h-6 w-6 text-blue-500 dark:text-blue-400" />
									<div>
										<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
											{item.title}
										</h3>
										<p className="text-gray-600 dark:text-gray-400">
											{item.description}
										</p>
									</div>
								</div>
							))}
						</div>

						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl" />
							<div className="relative rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
								<pre className="overflow-x-auto text-gray-700 text-sm dark:text-gray-300">
									<code>{`// Type-safe API endpoint
export const userRouter = router({
		get: publicProcedure
				.input(z.string())
				.query(async ({ input }) => {
						const user = await db
								.select()
								.from(users)
								.where(eq(users.id, input));

						return user;
				})
});`}</code>
								</pre>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="relative z-50 mx-auto w-full max-w-6xl py-24 text-center">
				<h2 className="mb-6 font-bold text-3xl text-gray-900 md:text-4xl dark:text-white">
					Ready to Build Something Amazing?
				</h2>
				<p className="mx-auto mb-8 max-w-xl text-gray-600 dark:text-gray-400">
					Start your next project with Better-T Stack and experience the future
					of web development.
				</p>
				<button
					type="button"
					className="group inline-flex items-center rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
				>
					Get Started
					<ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
				</button>
			</div>
		</>
	);
};

export default Featured;
