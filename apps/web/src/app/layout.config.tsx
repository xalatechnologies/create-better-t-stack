import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import discordLogo from "@/public/icon/discord.svg";
import mainLogo from "@/public/logo.svg";

export const logo = (
	<>
		<Image
			alt="better-t-stack"
			src={mainLogo}
			className="w-8"
			aria-label="better-t-stack"
		/>
	</>
);

export const baseOptions: BaseLayoutProps = {
	nav: {
		title: (
			<>
				{logo}

				<span className="font-medium [.uwu_&]:hidden [header_&]:text-[15px]">
					Better T Stack
				</span>
			</>
		),
		// enabled: false,
	},
	links: [
		{
			text: "Docs",
			url: "/docs",
		},
		{
			text: "Builder",
			url: "/new",
		},
		{
			text: "Analytics",
			url: "/analytics",
		},
		{
			text: "Showcase",
			url: "/showcase",
		},
		{
			text: (
				<Image
					src={discordLogo}
					alt="discord"
					className="size-5 invert-0 dark:invert"
				/>
			),
			url: "https://discord.gg/ZYsbjpDaM5",
			external: true,
			secondary: true,
		},
	],
	githubUrl: "https://github.com/AmanVarshney01/create-better-t-stack",
};
