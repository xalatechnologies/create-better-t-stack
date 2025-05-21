export const dynamic = "force-static";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://better-t-stack.amanv.dev/",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: "https://better-t-stack.amanv.dev/new",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: "https://better-t-stack.amanv.dev/docs",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
	];
}
