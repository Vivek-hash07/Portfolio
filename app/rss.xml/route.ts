import { getPublishedPosts, getProfile } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const [profile, posts] = await Promise.all([
    getProfile(),
    getPublishedPosts(),
  ]);
  const title = profile ? `${profile.name} — Blog` : "Blog";
  const description = profile?.title ?? "Published writing.";

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const date = (post.publishedAt ?? post.updatedAt).toUTCString();
      return `<item>
        <title>${escapeXml(post.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid>${escapeXml(url)}</guid>
        <pubDate>${date}</pubDate>
        ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    <description>${escapeXml(description)}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
