import React from "react";

const testimonials = [
	{
		name: "Alex Chen",
		role: "Senior Developer",
		company: "TechCorp",
		content:
			"Better-T Stack has revolutionized our development workflow. The type safety and development experience is unmatched.",
		avatar: "AC",
	},
	{
		name: "Sarah Miller",
		role: "Tech Lead",
		company: "Innovation Labs",
		content:
			"This is the future of full-stack development. The integration between all tools is seamless and intuitive.",
		avatar: "SM",
	},
	{
		name: "James Wilson",
		role: "Frontend Architect",
		company: "DevForce",
		content:
			"Finally, a stack that prioritizes both developer experience and performance. It's a game-changer.",
		avatar: "JW",
	},
];

const Testimonials = () => {
	return (
		<section className="w-full py-24 px-4 bg-gray-900/50 backdrop-blur-sm">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
						Loved by Developers Worldwide
					</h2>
					<p className="text-gray-400 mt-4 text-lg">
						Join thousands of developers crafting the future with Better-T Stack
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.name}
							className="group rounded-xl border border-gray-800 bg-gray-900/70 p-6 hover:border-gray-700 transition-colors duration-200"
						>
							<div className="flex items-center space-x-4 mb-4">
								<div className="shrink-0">
									<div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
										{testimonial.avatar}
									</div>
								</div>
								<div>
									<h3 className="text-white font-semibold">
										{testimonial.name}
									</h3>
									<p className="text-sm">
										<span className="text-purple-400">{testimonial.role}</span>
										<span className="text-gray-500 mx-1">at</span>
										<span className="text-pink-400">{testimonial.company}</span>
									</p>
								</div>
							</div>
							<p className="text-gray-300 leading-relaxed">
								{testimonial.content}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
