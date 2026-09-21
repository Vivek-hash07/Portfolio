import type { Metadata } from "next";
import { PostList } from "@/components/public/post-list";
import { getPublishedPosts } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Published writing and notes.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main>
      <PostList posts={posts} />
    </main>
  );
}
