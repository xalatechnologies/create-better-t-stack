const SideCircles = () => {
	return (
		<>
			<div>
				<div className="h-[40vh] w-[40vw] rounded-full bg-violet-950/10 backdrop-blur-xl z-50 fixed top-1/2 -translate-y-1/2 -left-[30%]" />
				<div className="h-[50vh] w-[40vw] rounded-full bg-violet-950/10 backdrop-blur-xl z-40 fixed top-1/2 -translate-y-1/2 -left-[25%]" />
				<div className="h-[60vh] w-[40vw] rounded-full bg-violet-950/10 backdrop-blur-xl z-30 fixed top-1/2 -translate-y-1/2 -left-[20%]" />
			</div>
			<div>
				<div className="h-[40vh] w-[40vw] rounded-full bg-violet-950/10 backdrop-blur-xl z-50 fixed top-1/2 -translate-y-1/2 -right-[30%]" />
				<div className="h-[50vh] w-[40vw] rounded-full bg-violet-950/10 backdrop-blur-xl z-40 fixed top-1/2 -translate-y-1/2 -right-[25%]" />
				<div className="h-[60vh] w-[40vw] rounded-full bg-violet-950/10 backdrop-blur-xl z-30 fixed top-1/2 -translate-y-1/2 -right-[20%]" />
			</div>
		</>
	);
};

export default SideCircles;
