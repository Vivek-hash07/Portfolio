import { getPublishedPostBySlug } from "@/lib/data";
import { renderOgImage } from "@/lib/og";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  return renderOgImage({
    kicker: "Writing",
    title: post?.title ?? "Blog",
    subtitle: post?.excerpt ?? undefined,
  });
}
