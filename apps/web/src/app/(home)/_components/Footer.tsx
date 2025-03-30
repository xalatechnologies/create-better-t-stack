import { Github } from "lucide-react";
import Link from "next/link";

const Footer = () => {
	return (
		<footer className="relative w-full font-mono border-t border-gray-200 dark:border-gray-800">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
				<div className="grid md:grid-cols-3 gap-8 mb-12">
					<div>
						<h3 className="text-gray-900 dark:text-white font-bold mb-4 text-lg flex items-center gap-2">
							<span>Better-T Stack</span>
						</h3>
						<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
							Type-safe, modern TypeScript scaffolding for full-stack web
							development
						</p>

						<div className="mt-4 flex space-x-3">
							<Link
								href="https://github.com/better-t-stack/create-better-t-stack"
								target="_blank"
								className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
								aria-label="GitHub"
							>
								<Github size={18} />
							</Link>
							<Link
								href="https://www.npmjs.com/package/create-better-t-stack"
								target="_blank"
								className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
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
						<h3 className="text-gray-900 dark:text-white font-bold mb-4 text-lg">
							Resources
						</h3>
						<ul className="text-gray-600 dark:text-gray-400 space-y-2.5">
							<li>
								<Link
									target="_blank"
									href="https://github.com/better-t-stack/create-better-t-stack"
									className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
								>
									GitHub Repository
								</Link>
							</li>
							<li>
								<Link
									target="_blank"
									href="https://www.npmjs.com/package/create-better-t-stack"
									className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
								>
									NPM Package
								</Link>
							</li>
							<li>
								<Link
									target="_blank"
									href="https://my-better-t-app-client.pages.dev/"
									className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
						<h3 className="text-gray-900 dark:text-white font-bold mb-4 text-lg">
							Contact
						</h3>
						<div className="text-gray-600 dark:text-gray-400 space-y-2.5">
							<p className="flex items-center">
								<span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm mr-2">
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

				<div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-gray-500 text-sm">
						© {new Date().getFullYear()} Better-T Stack. All rights reserved.
					</p>
					<p className="text-gray-500 text-sm flex items-center gap-1.5">
						Built with
						<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent font-medium">
							TypeScript
						</span>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
