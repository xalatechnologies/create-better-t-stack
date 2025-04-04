import { Github } from "lucide-react";
import Link from "next/link";

const Footer = () => {
	return (
		<footer className="relative w-full border-gray-200 border-t font-mono dark:border-gray-800">
			<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
				<div className="mb-12 grid gap-8 md:grid-cols-3">
					<div>
						<h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 text-lg dark:text-white">
							<span>Better-T Stack</span>
						</h3>
						<p className="text-gray-600 leading-relaxed dark:text-gray-400">
							Type-safe, modern TypeScript scaffolding for full-stack web
							development
						</p>

						<div className="mt-4 flex space-x-3">
							<Link
								href="https://github.com/better-t-stack/create-better-t-stack"
								target="_blank"
								className="text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
								aria-label="GitHub"
							>
								<Github size={18} />
							</Link>
							<Link
								href="https://www.npmjs.com/package/create-better-t-stack"
								target="_blank"
								className="text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
								aria-label="NPM"
							>
								<svg
									viewBox="0 0 24 24"
									width="18"
									height="18"
									fill="currentColor"
								>
									<title>NPM</title>
									<path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
								</svg>
							</Link>
						</div>
					</div>

					<div>
						<h3 className="mb-4 font-bold text-gray-900 text-lg dark:text-white">
							Resources
						</h3>
						<ul className="space-y-2.5 text-gray-600 dark:text-gray-400">
							<li>
								<Link
									target="_blank"
									href="https://github.com/better-t-stack/create-better-t-stack"
									className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
								>
									GitHub Repository
								</Link>
							</li>
							<li>
								<Link
									target="_blank"
									href="https://www.npmjs.com/package/create-better-t-stack"
									className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
								>
									NPM Package
								</Link>
							</li>
							<li>
								<Link
									target="_blank"
									href="https://my-better-t-app-client.pages.dev/"
									className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
								>
									Demo Application
								</Link>
							</li>
							{/* <li>
								<Link
									target="_blank"
									href="https://github.com/better-t-stack/create-better-t-stack#readme"
									className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
								>
									Documentation
								</Link>
							</li> */}
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-bold text-gray-900 text-lg dark:text-white">
							Contact
						</h3>
						<div className="space-y-2.5 text-gray-600 dark:text-gray-400">
							<p className="flex items-center">
								<span className="mr-2 rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-gray-800">
									$
								</span>
								<span>amanvarshney.work@gmail.com</span>
							</p>
							<p className="mt-3">
								Have questions or feedback? Feel free to reach out or open an
								issue on GitHub.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-gray-200 border-t pt-6 sm:flex-row dark:border-gray-800">
					<p className="text-gray-500 text-sm">
						© {new Date().getFullYear()} Better-T Stack. All rights reserved.
					</p>
					<p className="flex items-center gap-1.5 text-gray-500 text-sm">
						Built with
						<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text font-medium text-transparent">
							TypeScript
						</span>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
