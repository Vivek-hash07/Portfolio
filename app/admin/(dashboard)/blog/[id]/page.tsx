import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/form";
import { PostForm } from "@/components/admin/post-form";
import { getAdminPost } from "@/lib/admin-data";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getAdminPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader title="Edit post" description={post.title} />
      <PostForm
        id={post.id}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          published: post.published,
        }}
      />
    </main>
  );
}
