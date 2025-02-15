import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import { type ReactNode, Suspense } from "react";
import Navbar from "./(home)/_components/Navbar";

const inter = Inter({
	subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<body className="flex flex-col min-h-screen relative bg-black">
				<RootProvider
					search={{
						options: {
							type: "static",
						},
					}}
				>
					<Navbar />
					<div className="relative z-10 bg-zinc-50 dark:bg-zinc-950 pt-20 transition-colors duration-300  overflow-hidden">
						<Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
					</div>
				</RootProvider>
			</body>
		</html>
	);
}

function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center min-h-[200px]">
			<div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
		</div>
	);
}
