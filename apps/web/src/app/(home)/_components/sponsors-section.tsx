"use client";

import type { Sponsor } from "@/lib/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SponsorsSection() {
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);
	const [loadingSponsors, setLoadingSponsors] = useState(true);
	const [sponsorError, setSponsorError] = useState<string | null>(null);

	useEffect(() => {
		fetch("https://sponsors.amanv.dev/sponsors.json")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch sponsors");
				return res.json();
			})
			.then((data) => {
				setSponsors(Array.isArray(data) ? data : []);
				setLoadingSponsors(false);
			})
			.catch(() => {
				setSponsorError("Could not load sponsors");
				setLoadingSponsors(false);
			});
	}, []);

	return (
		<section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div className="mb-10 text-center">
				<h2 className="font-bold font-mono text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl">
					<span className="text-primary">Sponsors</span>
				</h2>
				<p className="mx-auto mt-2 max-w-xl text-base text-muted-foreground">
					Thank you to our sponsors for supporting this project!
				</p>
			</div>
			{loadingSponsors ? (
				<div className="flex animate-pulse items-center justify-center py-8 text-muted-foreground text-sm">
					Loading sponsors...
				</div>
			) : sponsorError ? (
				<div className="flex items-center justify-center py-8 text-destructive text-sm">
					{sponsorError}
				</div>
			) : sponsors.length === 0 ? (
				<div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
					No sponsors yet.{" "}
					<a
						href="https://github.com/sponsors/AmanVarshney01"
						target="_blank"
						rel="noopener noreferrer"
						className="ml-2 text-primary underline"
					>
						Become a Sponsor
					</a>
				</div>
			) : (
				<div className="fade-in-sponsors flex flex-wrap justify-center gap-8">
					{sponsors.map((entry) => {
						const since = new Date(entry.createdAt).toLocaleDateString();
						const title = `@${entry.sponsor.login}\n${entry.sponsor.type}${
							entry.isOneTime ? " (One-time)" : " (Monthly)"
						}\n${entry.tierName ? `${entry.tierName}\n` : ""}Since: ${since}`;
						return (
							<a
								key={entry.sponsor.login}
								href={entry.sponsor.websiteUrl || entry.sponsor.linkUrl}
								target="_blank"
								rel="noopener noreferrer"
								className={
									"group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-background/80 px-6 py-5 shadow-sm transition-all duration-200 hover:scale-105 hover:border-primary hover:shadow-lg"
								}
								title={title}
								style={{ minWidth: 140, maxWidth: 180 }}
							>
								<div className="relative">
									<Image
										src={entry.sponsor.avatarUrl}
										alt={entry.sponsor.name || entry.sponsor.login}
										width={64}
										height={64}
										className="rounded-full border-2 border-border bg-background transition-colors group-hover:border-primary"
										unoptimized
									/>
								</div>
								<span className="break-all text-center font-mono text-foreground text-xs">
									{entry.sponsor.name || entry.sponsor.login}
								</span>
								{entry.tierName && (
									<span className="text-center text-[11px] text-muted-foreground">
										{entry.tierName}
									</span>
								)}
								<span className="text-center text-[11px] text-muted-foreground">
									{entry.monthlyDollars > 0
										? `$${entry.monthlyDollars} / mo`
										: entry.isOneTime && entry.monthlyDollars > 0
											? `$${entry.monthlyDollars} one-time`
											: "Supporter"}
								</span>
								<span className="text-center text-[10px] text-muted-foreground">
									{entry.isOneTime ? "One-time" : "Monthly"}
								</span>
							</a>
						);
					})}
				</div>
			)}
			<div className="mt-12 text-center">
				<a
					href="https://github.com/sponsors/AmanVarshney01"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-primary/10 px-8 py-3 font-mono text-lg text-primary shadow-md transition-all hover:scale-105 hover:bg-primary/20 hover:shadow-lg"
				>
					<svg
						className="mr-2 h-5 w-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						<title>Heart in Circle</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 8c-1.657 0-3 1.343-3 3 0 2.25 3 5 3 5s3-2.75 3-5c0-1.657-1.343-3-3-3z"
						/>
						<circle cx="12" cy="11" r="9" />
					</svg>
					Become a Sponsor
				</a>
			</div>
		</section>
	);
}
