import React from "react";

const BackgroundGradients = () => {
	return (
		<div className="-z-10 fixed inset-0 overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.04)_0%,transparent_40%),radial-gradient(circle_at_70%_60%,rgba(79,70,229,0.03)_0%,transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_40%),radial-gradient(circle_at_70%_60%,rgba(79,70,229,0.08)_0%,transparent_40%)]" />
			<div className="absolute inset-0 opacity-20 dark:opacity-25">
				<div className="absolute top-1/4 left-1/3 h-28 w-28 rounded-full bg-blue-300/30 blur-[120px] dark:bg-blue-500/20" />
				<div className="absolute top-2/3 right-1/4 h-32 w-32 rounded-full bg-indigo-300/30 blur-[140px] dark:bg-indigo-500/20" />
			</div>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]" />
		</div>
	);
};

export default BackgroundGradients;
