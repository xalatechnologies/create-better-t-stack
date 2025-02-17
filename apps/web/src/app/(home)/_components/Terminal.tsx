import React from "react";

const TerminalDisplay = () => {
	const TITLE_TEXT = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ██████╗ ███████╗████████╗████████╗███████╗██████╗        ║
║   ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗       ║
║   ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝       ║
║   ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗       ║
║   ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║       ║
║   ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝       ║
║                                                            ║
║   ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗   ║
║   ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝   ║
║      ██║       ███████╗   ██║   ███████║██║     █████╔╝    ║
║      ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗    ║
║      ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗   ║
║      ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `;

	return (
		<div className="max-w-6xl mx-auto p-6 mt-12">
			<div className="bg-gray-900/30 backdrop-blur-3xl rounded-lg shadow-xl overflow-hidden">
				<div className="bg-gray-800/30 backdrop-blur-3xl px-4 py-2 flex items-center">
					<div className="flex space-x-2">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
					</div>
				</div>

				<div className="p-4 font-mono text-sm flex flex-col">
					<div className="flex items-center text-gray-300 mb-4">
						<span className="text-green-400">➜</span>
						<span className="text-blue-400 ml-2">~</span>
						<span className="ml-2">$</span>
						<span className="ml-2 text-white">
							npx create-better-t-stack@latest
						</span>
					</div>

					<pre className="text-blue-400 whitespace-pre overflow-x-auto px-8">
						{TITLE_TEXT}
					</pre>
				</div>
			</div>
		</div>
	);
};

export default TerminalDisplay;
