import React from "react";

const BackgroundGradients = () => {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.08)_0%,transparent_40%),radial-gradient(circle_at_70%_60%,rgba(94,234,212,0.05)_0%,transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15)_0%,transparent_40%),radial-gradient(circle_at_70%_60%,rgba(94,234,212,0.1)_0%,transparent_40%)]" />

			<div className="absolute inset-0 opacity-20 dark:opacity-30">
				<div className="absolute h-28 w-28 rounded-full bg-rose-300/30 dark:bg-amber-500/30 blur-[120px] top-1/4 left-1/3 " />

				<div className="absolute h-32 w-32 rounded-full bg-teal-300/30 dark:bg-emerald-500/30 blur-[140px] top-2/3 right-1/4  delay-700" />

				<div className="absolute h-36 w-36 rounded-full bg-purple-300/30 dark:bg-fuchsia-500/30 blur-[130px] bottom-1/4 right-1/3  delay-1000" />

				<div className="absolute h-24 w-24 rounded-full bg-slate-300/30 dark:bg-slate-500/30 blur-[100px] top-1/2 left-1/2  delay-500" />
			</div>

			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />

			{/* <div className="absolute inset-0 bg-noise opacity-[0.035] dark:opacity-[0.07] mix-blend-overlay" /> */}
		</div>
	);
};

export default BackgroundGradients;
