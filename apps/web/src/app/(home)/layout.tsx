import { type ReactNode, Suspense } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<main className="relative z-10 grid min-h-svh grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden">
			<Suspense>{children}</Suspense>
		</main>
	);
}
