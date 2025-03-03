import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

export const metadata: Metadata = {
	title: "Better-T-Stack",
	description: "Unleash the power of better-t-stack",
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<main className="relative z-10 min-h-svh bg-zinc-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden dark">
			<Navbar />
			{children}
			<Footer />
		</main>
	);
}
