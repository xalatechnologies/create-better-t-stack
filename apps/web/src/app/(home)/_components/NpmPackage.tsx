"use client";

import { useEffect, useState } from "react";

const NpmPackage = () => {
	const [version, setVersion] = useState("");
	const [versionLoading, setVersionLoading] = useState(true);

	useEffect(() => {
		const getLatestVersion = async () => {
			setVersionLoading(true);
			const res = await fetch(
				"https://registry.npmjs.org/create-better-t-stack/latest",
			);
			const data = await res.json();
			setVersionLoading(false);
			setVersion(data.version);
		};
		getLatestVersion();
	}, []);

	return (
		<div className="mt-2 flex items-center justify-center">
			<span className="mr-2 inline-block h-5 w-3 animate-pulse bg-blue-400 dark:bg-blue-500" />
			<span className="font-mono text-gray-700 text-xl dark:text-gray-300">
				{versionLoading ? "[v1.0.0]" : `[v${version}]`}
			</span>
		</div>
	);
};

export default NpmPackage;
