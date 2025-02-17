import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
});

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={poppins.className} suppressHydrationWarning>
			<body className="flex flex-col min-h-screen relative bg-black">
				<RootProvider
					search={{
						options: {
							type: "static",
						},
					}}
				>
					<div className="relative z-10 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300  overflow-hidden">
						{children}
					</div>
				</RootProvider>
			</body>
		</html>
	);
}
