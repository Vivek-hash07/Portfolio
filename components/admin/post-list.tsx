"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "@/app/generated/prisma/client";
import { deletePost } from "@/app/admin/(dashboard)/blog/actions";
import type { BannerState } from "@/components/admin/apply-result";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { StatusBanner } from "@/components/admin/form";
import { formatLongDate } from "@/lib/format";

export function PostList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [banner, setBanner] = useState<BannerState>(null);

  if (posts.length === 0) {
    return <p className="mt-8 text-sm text-muted">No posts yet. Write one to get started.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      <StatusBanner state={banner} />
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-2xl border border-border bg-surface/80 p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-fg">{post.title}</h2>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[0.65rem] tracking-wide uppercase ${
                post.published
                  ? "bg-accent/15 text-accent"
                  : "bg-surface-2 text-muted"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-muted">/{post.slug}</p>
          <p className="mt-2 text-sm text-muted">
            Updated {formatLongDate(post.updatedAt)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/admin/blog/${post.id}`} className="btn btn-ghost px-3 py-2 text-sm">
              Edit
            </Link>
            {post.published ? (
              <Link
                href={`/blog/${post.slug}`}
                className="btn btn-ghost px-3 py-2 text-sm"
                target="_blank"
              >
                View
              </Link>
            ) : null}
            <ConfirmDelete
              title={`Delete “${post.title}”?`}
              description="Deleting a post is permanent and cannot be undone."
              onConfirm={async () => {
                const result = await deletePost(post.id);
                setBanner(
                  result.ok
                    ? { type: "success", message: "Post deleted" }
                    : { type: "error", message: result.error },
                );
                router.refresh();
              }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
