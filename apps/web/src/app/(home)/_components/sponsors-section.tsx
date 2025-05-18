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
			<div className="mb-12 text-center">
				<h2 className="font-bold font-mono text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
					<span className="text-primary">Our Sponsors</span>
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
					This project is proudly supported by these amazing organizations and
					individuals.
				</p>
			</div>
			{loadingSponsors ? (
				<div className="flex animate-pulse items-center justify-center py-12 text-base text-muted-foreground">
					Loading sponsors...
				</div>
			) : sponsorError ? (
				<div className="flex items-center justify-center py-12 text-base text-destructive">
					{sponsorError}
				</div>
			) : sponsors.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-base text-muted-foreground">
					No sponsors yet.
					<a
						href="https://github.com/sponsors/AmanVarshney01"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary bg-transparent px-4 py-2 font-mono text-base text-primary shadow-md transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<title>Heart Icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
						Become a Sponsor
					</a>
				</div>
			) : (
				<div className="fade-in-sponsors grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5">
					{sponsors.map((entry) => {
						const since = new Date(entry.createdAt).toLocaleDateString(
							undefined,
							{ year: "numeric", month: "short" },
						);
						const title = `@${entry.sponsor.login} - ${entry.sponsor.type}${
							entry.isOneTime ? " (One-time)" : " (Monthly)"
						}\nTier: ${entry.tierName || "N/A"}\nSince: ${since}`;
						return (
							<a
								key={entry.sponsor.login}
								href={entry.sponsor.websiteUrl || entry.sponsor.linkUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group hover:-translate-y-1 relative flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 shadow-md transition-all duration-300 ease-in-out hover:border-primary hover:shadow-xl"
								title={title}
							>
								<div className="relative mb-2">
									<Image
										src={entry.sponsor.avatarUrl}
										alt={entry.sponsor.name || entry.sponsor.login}
										width={80}
										height={80}
										className="rounded-full border-2 border-border bg-background transition-colors duration-300 group-hover:border-primary"
										unoptimized
									/>
								</div>
								<span className="break-words text-center font-mono font-semibold text-foreground text-sm">
									{entry.sponsor.name || entry.sponsor.login}
								</span>
								{entry.tierName && (
									<span className="rounded-full bg-primary/10 px-3 py-1 text-center font-medium text-primary text-xs">
										{entry.tierName}
									</span>
								)}
							</a>
						);
					})}
				</div>
			)}
			{sponsors.length > 0 && (
				<div className="mt-16 text-center">
					<a
						href="https://github.com/sponsors/AmanVarshney01"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-3 rounded-xl border border-primary bg-transparent px-6 py-3 font-mono font-semibold text-lg text-primary shadow-md transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
					>
						<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<title>Heart Icon</title>
							<path
								fillRule="evenodd"
								d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
								clipRule="evenodd"
							/>
						</svg>
						Support Our Project!
					</a>
				</div>
			)}
		</section>
	);
}
