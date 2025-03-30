import React from "react";

const BackgroundGradients = () => {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.04)_0%,transparent_40%),radial-gradient(circle_at_70%_60%,rgba(79,70,229,0.03)_0%,transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_40%),radial-gradient(circle_at_70%_60%,rgba(79,70,229,0.08)_0%,transparent_40%)]" />
			<div className="absolute inset-0 opacity-20 dark:opacity-25">
				<div className="absolute h-28 w-28 rounded-full bg-blue-300/30 dark:bg-blue-500/20 blur-[120px] top-1/4 left-1/3" />
				<div className="absolute h-32 w-32 rounded-full bg-indigo-300/30 dark:bg-indigo-500/20 blur-[140px] top-2/3 right-1/4" />
			</div>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
		</div>
	);
};

export default BackgroundGradients;
