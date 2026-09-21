import type { MetadataRoute } from "next";
import { getPortfolio, getPublishedPosts } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [{ profile }, posts] = await Promise.all([
    getPortfolio(),
    getPublishedPosts(),
  ]);

  const lastModified = profile?.updatedAt ?? posts[0]?.updatedAt ?? new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: posts[0]?.updatedAt ?? lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/resume.pdf`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
