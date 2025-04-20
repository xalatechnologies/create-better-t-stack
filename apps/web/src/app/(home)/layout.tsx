import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<main className="relative z-10 grid min-h-svh grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden">
			{children}
		</main>
	);
}
