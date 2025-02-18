import React from "react";

const Footer = () => {
	return (
		<footer className="relative w-full mt-20">
			<div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent" />
			<div className="max-w-6xl mx-auto px-4 py-12 relative">
				<div className="mt-12 pt-8 border-t border-gray-800">
					<p className="text-center text-gray-500">
						© {new Date().getFullYear()} Better-T Stack. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
