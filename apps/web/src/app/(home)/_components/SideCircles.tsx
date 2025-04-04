const SideCircles = () => {
	return (
		<>
			<div>
				<div className="-translate-y-1/2 -left-[30%] fixed top-1/2 z-40 h-[50vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl" />
				<div className="-translate-y-1/2 -left-[35%] fixed top-1/2 z-50 h-[40vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl" />
				<div className="-translate-y-1/2 -left-[25%] fixed top-1/2 z-30 h-[60vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl" />
			</div>
			<div>
				<div className="-translate-y-1/2 -right-[35%] fixed top-1/2 z-50 h-[40vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl" />
				<div className="-translate-y-1/2 -right-[30%] fixed top-1/2 z-40 h-[50vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl" />
				<div className="-translate-y-1/2 -right-[25%] fixed top-1/2 z-30 h-[60vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl" />
			</div>
		</>
	);
};

export default SideCircles;
