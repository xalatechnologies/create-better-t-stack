const SideCircles = () => {
	return (
		<>
			<div>
				<div className="h-[50vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl z-40 fixed top-1/2 -translate-y-1/2 -left-[30%]" />
				<div className="h-[40vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl z-50 fixed top-1/2 -translate-y-1/2 -left-[35%]" />
				<div className="h-[60vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl z-30 fixed top-1/2 -translate-y-1/2 -left-[25%]" />
			</div>
			<div>
				<div className="h-[40vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl z-50 fixed top-1/2 -translate-y-1/2 -right-[35%]" />
				<div className="h-[50vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl z-40 fixed top-1/2 -translate-y-1/2 -right-[30%]" />
				<div className="h-[60vh] w-[40vw] rounded-full bg-gradient-to-b from-transparent via-violet-950/20 to-transparent backdrop-blur-xl z-30 fixed top-1/2 -translate-y-1/2 -right-[25%]" />
			</div>
		</>
	);
};

export default SideCircles;
