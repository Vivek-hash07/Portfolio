"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/admin/(dashboard)/blog/actions";
import { applyActionResult, type BannerState } from "@/components/admin/apply-result";
import { FileUpload } from "@/components/admin/file-upload";
import {
  Field,
  StatusBanner,
  checkboxClassName,
  inputClassName,
} from "@/components/admin/form";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { slugify } from "@/lib/content-utils";
import { zodResolver } from "@/lib/zod-resolver";
import { postSchema, type PostInput } from "@/lib/validations";

export function PostForm({
  id,
  defaultValues,
}: {
  id?: string;
  defaultValues: PostInput;
}) {
  const router = useRouter();
  const [banner, setBanner] = useState<BannerState>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues,
  });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={form.handleSubmit(async (values) => {
        const result = id ? await updatePost(id, values) : await createPost(values);
        if (applyActionResult(result, form.setError, setBanner, values.published ? "Published" : "Saved")) {
          router.push("/admin/blog");
          router.refresh();
        }
      })}
    >
      <StatusBanner state={banner} />
      <Field label="Title" htmlFor="title" error={form.formState.errors.title?.message}>
        <input
          id="title"
          className={inputClassName}
          {...form.register("title", {
            onChange: (event) => {
              if (!slugTouched) {
                form.setValue("slug", slugify(event.target.value), { shouldValidate: true });
              }
            },
          })}
        />
      </Field>
      <Field
        label="Slug"
        htmlFor="slug"
        hint="Used in /blog/your-slug"
        error={form.formState.errors.slug?.message}
      >
        <input
          id="slug"
          className={inputClassName}
          {...form.register("slug", {
            onChange: () => setSlugTouched(true),
          })}
        />
      </Field>
      <Field label="Excerpt" htmlFor="excerpt" error={form.formState.errors.excerpt?.message}>
        <textarea
          id="excerpt"
          rows={3}
          className={`${inputClassName} resize-y`}
          {...form.register("excerpt")}
        />
      </Field>
      <MarkdownEditor
        value={form.watch("content")}
        onChange={(value) => form.setValue("content", value, { shouldDirty: true })}
        error={form.formState.errors.content?.message}
      />
      <FileUpload
        label="Cover image"
        kind="image"
        value={form.watch("coverImage")}
        onChange={(url) => form.setValue("coverImage", url, { shouldDirty: true })}
      />
      <label className="flex items-center gap-2 text-sm text-fg">
        <input type="checkbox" className={checkboxClassName} {...form.register("published")} />
        Published
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save post"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => router.push("/admin/blog")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
