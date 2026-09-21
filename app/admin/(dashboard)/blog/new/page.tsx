import { PageHeader } from "@/components/admin/form";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader title="New post" description="Write markdown with a live preview, then save or publish." />
      <PostForm
        defaultValues={{
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverImage: "",
          published: false,
        }}
      />
    </main>
  );
}
