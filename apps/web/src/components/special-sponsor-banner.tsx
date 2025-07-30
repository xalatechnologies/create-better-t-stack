"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Sponsor } from "@/lib/types";

const isSpecialSponsor = (sponsor: Sponsor) => {
	return sponsor.monthlyDollars >= 100;
};

export function SpecialSponsorBanner() {
	const [specialSponsor, setSpecialSponsor] = useState<Sponsor | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("https://sponsors.amanv.dev/sponsors.json")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch sponsors");
				return res.json();
			})
			.then((data) => {
				const sponsorsData = Array.isArray(data) ? data : [];
				const specialSponsor = sponsorsData.find(
					(sponsor) => sponsor.monthlyDollars > 0 && isSpecialSponsor(sponsor),
				);

				if (specialSponsor) {
					setSpecialSponsor(specialSponsor);
				}
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="">
				<div className="flex items-center gap-3">
					<div className="h-[30px] w-[30px] animate-pulse rounded border border-border bg-muted" />
					<div className="min-w-0 flex-1">
						<div className="h-4 w-20 animate-pulse rounded bg-muted" />
					</div>
				</div>
			</div>
		);
	}

	if (!specialSponsor) {
		return null;
	}

	return (
		<div className="">
			<div className="flex items-center gap-3">
				<Image
					src={
						specialSponsor.sponsor.customLogoUrl ||
						specialSponsor.sponsor.avatarUrl
					}
					alt={specialSponsor.sponsor.name || specialSponsor.sponsor.login}
					width={30}
					height={30}
					className="rounded border border-border"
					unoptimized
				/>
				<div className="min-w-0 flex-1">
					<h4 className="truncate font-medium text-sm">
						{specialSponsor.sponsor.name || specialSponsor.sponsor.login}
					</h4>
				</div>
			</div>
		</div>
	);
}
