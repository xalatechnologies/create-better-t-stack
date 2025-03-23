import { ArrowRight, Code2, Shield, Zap } from "lucide-react";
import React from "react";

const Featured = () => {
	return (
		<>
			<div className="w-full max-w-6xl mx-auto py-24 relative z-50">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
							className="relative group p-6 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
							<feature.icon className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
								{feature.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="w-full bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800 relative z-50">
				<div className="max-w-6xl mx-auto py-24">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Write Better Code, Faster
						</h2>
						<p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
							Leverage the power of TypeScript with our carefully selected tools
							and frameworks.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-12 items-center">
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
									className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
								>
									<ArrowRight className="w-6 h-6 text-blue-500 dark:text-blue-400 mt-1" />
									<div>
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
							<div className="relative bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
								<pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
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

			<div className="w-full max-w-6xl mx-auto py-24 text-center relative z-50">
				<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
					Ready to Build Something Amazing?
				</h2>
				<p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
					Start your next project with Better-T Stack and experience the future
					of web development.
				</p>
				<button
					type="button"
					className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors inline-flex items-center group"
				>
					Get Started
					<ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
				</button>
			</div>
		</>
	);
};

export default Featured;
