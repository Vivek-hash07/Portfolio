import Link from "next/link";
import { PageHeader } from "@/components/admin/form";
import { PostList } from "@/components/admin/post-list";
import { getAdminPosts } from "@/lib/admin-data";

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Blog"
        description="Draft, publish, and delete posts. Unpublished posts stay 404 on the public site."
        actions={
          <Link href="/admin/blog/new" className="btn btn-primary">
            New post
          </Link>
        }
      />
      <PostList
        key={posts.map((item) => `${item.id}:${item.updatedAt.toISOString()}`).join("|")}
        posts={posts}
      />
    </main>
  );
}
