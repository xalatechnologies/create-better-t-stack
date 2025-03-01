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
		<div className="flex items-center justify-center mt-2">
			<span className="inline-block w-3 h-5 bg-blue-400 animate-pulse mr-2" />
			<span className="text-gray-300 text-xl font-mono">
				{versionLoading ? "[v1.0.0]" : `[v${version}]`}
			</span>
		</div>
	);
};

export default NpmPackage;
