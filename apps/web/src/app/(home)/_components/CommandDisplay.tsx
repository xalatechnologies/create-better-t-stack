"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CommandDisplayProps {
	command: string;
}

export function CommandDisplay({ command }: CommandDisplayProps) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="group relative">
			<div className="w-fit overflow-x-auto rounded-lg border border-gray-200 bg-gray-100/80 p-4 font-mono text-gray-800 text-sm backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/20 dark:text-gray-300">
				<button
					type="button"
					onClick={copyToClipboard}
					className="-translate-y-1/2 absolute top-1/2 right-4 rounded-md p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
				>
					{copied ? (
						<Check className="h-4 w-4 text-green-500" />
					) : (
						<Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
					)}
				</button>
				<pre className="pr-12 max-sm:text-xs">{command}</pre>
			</div>
		</div>
	);
}
