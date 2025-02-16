import { baseOptions } from "@/app/layout.config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Better-T-Stack",
	description: "Unleash the power of better-t-stack",
};

export default function Layout({ children }: { children: ReactNode }) {
	return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
