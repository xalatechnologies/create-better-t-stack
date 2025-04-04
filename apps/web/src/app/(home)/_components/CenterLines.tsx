import React from "react";

const CenterLines = () => {
	return (
		<>
			<div className="-translate-y-1/2 absolute top-3/4 left-0 h-14 w-80 rotate-180 transform rounded-bl-3xl border-slate-700 border-b-2 border-l-2 shadow-lg backdrop-blur-sm dark:border-slate-300" />
			<div className="-translate-y-1/2 absolute top-3/4 right-0 h-14 w-80 rotate-180 transform rounded-br-3xl border-slate-700 border-r-2 border-b-2 shadow-lg backdrop-blur-sm dark:border-slate-300" />
		</>
	);
};

export default CenterLines;
