import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

export const metadata: Metadata = {
	title: "Better-T-Stack | TypeScript Project Scaffolding",
	description:
		"Create modern TypeScript applications with complete type safety from frontend to backend. Features support for multiple databases, ORMs, authentication, and more.",
	keywords: [
		"TypeScript",
		"project scaffolding",
		"type safety",
		"Drizzle",
		"Prisma",
		"libSQL",
		"PostgreSQL",
		"Better-Auth",
		"Docker",
		"GitHub Actions",
		"monorepo",
		"Better T Stack",
		"Better-T-Stack",
		"Create better t stack",
	],
	authors: [{ name: "Better-T-Stack Team" }],
	creator: "Better-T-Stack",
	publisher: "Better-T-Stack",
	formatDetection: {
		email: false,
		telephone: false,
	},
	metadataBase: new URL("https://better-t-stack.pages.dev"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Better-T-Stack | Type-Safe TypeScript Project Scaffolding",
		description:
			"Create modern full-stack TypeScript applications with complete type safety from database to frontend",
		url: "https://better-t-stack.pages.dev",
		siteName: "Better-T-Stack",
		images: [
			{
				url: "/image.png",
				width: 1200,
				height: 630,
				alt: "Better-T-Stack Logo and Tagline",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Better-T-Stack | Type-Safe TypeScript Project Scaffolding",
		description:
			"Create modern TypeScript applications with complete type safety from frontend to backend",
		images: ["/image.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-video-preview": -1,
			"max-snippet": -1,
		},
	},
	category: "Technology",
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<main className="relative z-10 min-h-svh bg-zinc-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
			<Navbar />
			{children}
			<Footer />
		</main>
	);
}
