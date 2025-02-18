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
		<div className="max-sm:w-[95%] max-w-6xl mx-auto p-2 sm:p-6 mt-6 sm:mt-12 relative z-50">
			<div className="bg-gray-900/30 backdrop-blur-3xl rounded-lg shadow-xl overflow-hidden">
				<div className="bg-gray-800/30 backdrop-blur-3xl px-2 sm:px-4 py-1 sm:py-2 flex items-center">
					<div className="flex space-x-1 sm:space-x-2">
						<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
						<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
						<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
					</div>
				</div>

				<div className="p-2 sm:p-4 font-mono text-xs sm:text-sm flex flex-col">
					<div className="flex items-center text-gray-300 mb-2 sm:mb-4 overflow-x-auto">
						<span className="text-green-400">➜</span>
						<span className="text-blue-400 ml-1 sm:ml-2">~</span>
						<span className="ml-1 sm:ml-2">$</span>
						<span className="ml-1 sm:ml-2 max-sm:text-xs text-white">
							npx create-better-t-stack@latest
						</span>
					</div>

					<pre className="text-blue-400 whitespace-pre sm:overflow-x-auto px-8 max-sm:scale-50 max-sm:origin-left">
						{TITLE_TEXT}
					</pre>
				</div>
			</div>
		</div>
	);
};

export default TerminalDisplay;
