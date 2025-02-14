import React from "react";

const Spotlight = () => {
	return (
		<div className="fixed w-full h-96 -top-12 overflow-hidden">
			<div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-24">
				<div className="w-12 h-[40vh] bg-gradient-to-b from-white/30 to-transparent blur-xl" />
				<div className="w-12 h-[50vh] bg-gradient-to-b from-white/30 to-transparent blur-xl" />
				<div className="w-12 h-[50vh] bg-gradient-to-b from-white/30 to-transparent blur-xl" />
				<div className="w-12 h-[40vh] bg-gradient-to-b from-white/30 to-transparent blur-xl" />
			</div>
		</div>
	);
};

export default Spotlight;
