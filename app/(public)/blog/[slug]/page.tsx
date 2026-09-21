import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/public/markdown";
import { Container } from "@/components/public/ui";
import {
  getPublishedPostBySlug,
  getPublishedPostSlugs,
} from "@/lib/data";
import { formatLongDate } from "@/lib/format";
import { estimateReadTimeMinutes, formatReadTime } from "@/lib/read-time";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPostSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const url = `${getSiteUrl()}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readTime = formatReadTime(estimateReadTimeMinutes(post.content));

  return (
    <main className="py-16">
      <Container>
        <p className="text-sm">
          <Link href="/blog" className="text-muted hover:text-accent">
            ← All posts
          </Link>
        </p>
        <article className="mt-8">
          <p className="font-mono text-sm text-accent">
            {post.publishedAt ? `${formatLongDate(post.publishedAt)} · ` : null}
            {readTime}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-fg">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
              {post.excerpt}
            </p>
          ) : null}
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt=""
              className="mt-8 aspect-video w-full rounded-2xl object-cover"
            />
          ) : null}
          <div className="mt-10 max-w-3xl">
            <Markdown content={post.content} />
          </div>
        </article>
      </Container>
    </main>
  );
}
