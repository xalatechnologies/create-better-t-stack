import React from "react";

const CenterLines = () => {
	return (
		<>
			<div
				className="absolute top-3/4 -translate-y-1/2 left-0 w-80 h-14
      rounded-bl-3xl transform rotate-180
      border-b-2 border-l-2 border-slate-700
      shadow-lg backdrop-blur-sm"
			/>
			<div
				className="absolute top-3/4 -translate-y-1/2 right-0 w-80 h-14
      rounded-br-3xl transform rotate-180
      border-b-2 border-r-2 border-slate-700
      shadow-lg backdrop-blur-sm"
			/>
		</>
	);
};

export default CenterLines;
