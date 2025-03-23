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
			<body>
				<RootProvider
					search={{
						options: {
							type: "static",
						},
					}}
					theme={{
						enableSystem: true,
					}}
				>
					{children}
				</RootProvider>
			</body>
		</html>
	);
}
