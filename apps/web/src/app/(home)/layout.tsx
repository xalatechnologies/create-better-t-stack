"use client";

import { HomeLayout } from "fumadocs-ui/layouts/home";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { baseOptions } from "@/app/layout.config";

export default function Layout({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	useEffect(() => {
		const header = document.querySelector("#nd-nav");
		if (!header) return;

		const main = document.querySelector("main");
		if (!main) return;

		if (pathname === "/new") {
			header.classList.remove("*:mx-auto", "*:max-w-fd-container");
			main.classList.remove("max-w-[1400px]", "mx-auto", "min-h-svh");
		} else {
			header.classList.add("*:mx-auto", "*:max-w-fd-container");
			main.classList.add("max-w-[1400px]", "mx-auto", "min-h-svh");
		}
	}, [pathname]);

	return (
		<HomeLayout {...baseOptions}>
			<main className="h-full w-full">{children}</main>
		</HomeLayout>
	);
}
