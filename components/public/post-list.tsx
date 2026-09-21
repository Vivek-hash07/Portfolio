import Link from "next/link";
import type { Post } from "@/app/generated/prisma/client";
import { Container, SectionHeading } from "@/components/public/ui";
import { formatLongDate } from "@/lib/format";
import { estimateReadTimeMinutes, formatReadTime } from "@/lib/read-time";

export function PostList({ posts }: { posts: Post[] }) {
  const updatedAt = posts[0]?.updatedAt ?? null;

  return (
    <section className="py-[var(--section-y)]">
      <Container>
        <SectionHeading
          index="07"
          eyebrow="Writing"
          title="Blog"
          updatedAt={updatedAt}
        />
        <p className="mb-10 text-sm text-muted">
          <a href="/rss.xml" className="text-accent underline-offset-4 hover:underline">
            Subscribe via RSS
          </a>
        </p>
        {posts.length === 0 ? (
          <p className="text-muted">No published posts yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li key={post.id} className="py-8 first:pt-0">
                <p className="font-mono text-xs text-accent">
                  {post.publishedAt ? formatLongDate(post.publishedAt) : null}
                  {" · "}
                  {formatReadTime(estimateReadTimeMinutes(post.content))}
                </p>
                <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight">
                  <Link href={`/blog/${post.slug}`} className="text-fg hover:text-accent">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt ? (
                  <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                    {post.excerpt}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
