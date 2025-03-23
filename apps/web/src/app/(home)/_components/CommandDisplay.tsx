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
		<div className="relative group">
			<div className="dark:bg-gray-950/20 bg-gray-100/80 w-fit backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-800 dark:text-gray-300 overflow-x-auto">
				<button
					type="button"
					onClick={copyToClipboard}
					className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
				>
					{copied ? (
						<Check className="w-4 h-4 text-green-500" />
					) : (
						<Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
					)}
				</button>
				<pre className="pr-12 max-sm:text-xs">{command}</pre>
			</div>
		</div>
	);
}
