"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  createProject,
  updateProject,
} from "@/app/admin/(dashboard)/projects/actions";
import { applyActionResult, type BannerState } from "@/components/admin/apply-result";
import { FileUpload } from "@/components/admin/file-upload";
import {
  Field,
  StatusBanner,
  checkboxClassName,
  inputClassName,
} from "@/components/admin/form";
import { StringListInput } from "@/components/admin/string-list-input";
import { zodResolver } from "@/lib/zod-resolver";
import { projectSchema, type ProjectInput } from "@/lib/validations";

export function ProjectForm({
  id,
  defaultValues,
}: {
  id?: string;
  defaultValues: ProjectInput;
}) {
  const router = useRouter();
  const [banner, setBanner] = useState<BannerState>(null);
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={form.handleSubmit(async (values) => {
        const result = id ? await updateProject(id, values) : await createProject(values);
        if (applyActionResult(result, form.setError, setBanner)) {
          router.push("/admin/projects");
          router.refresh();
        }
      })}
    >
      <StatusBanner state={banner} />
      <Field label="Title" htmlFor="title" error={form.formState.errors.title?.message}>
        <input id="title" className={inputClassName} {...form.register("title")} />
      </Field>
      <Field label="Subtitle" htmlFor="subtitle" error={form.formState.errors.subtitle?.message}>
        <input id="subtitle" className={inputClassName} {...form.register("subtitle")} />
      </Field>
      <StringListInput
        label="Description bullets"
        addLabel="Add bullet"
        values={form.watch("description")}
        onChange={(values) => form.setValue("description", values, { shouldDirty: true })}
        error={
          form.formState.errors.description?.message ??
          form.formState.errors.description?.[0]?.message
        }
      />
      <StringListInput
        label="Tech stack"
        addLabel="Add tech"
        placeholder="Next.js"
        values={form.watch("techStack")}
        onChange={(values) => form.setValue("techStack", values, { shouldDirty: true })}
        error={
          form.formState.errors.techStack?.message ??
          form.formState.errors.techStack?.[0]?.message
        }
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Live URL" htmlFor="liveUrl" error={form.formState.errors.liveUrl?.message}>
          <input id="liveUrl" className={inputClassName} {...form.register("liveUrl")} />
        </Field>
        <Field label="Repo URL" htmlFor="repoUrl" error={form.formState.errors.repoUrl?.message}>
          <input id="repoUrl" className={inputClassName} {...form.register("repoUrl")} />
        </Field>
      </div>
      <FileUpload
        label="Project image"
        kind="image"
        value={form.watch("imageUrl")}
        onChange={(url) => form.setValue("imageUrl", url, { shouldDirty: true })}
      />
      <label className="flex items-center gap-2 text-sm text-fg">
        <input type="checkbox" className={checkboxClassName} {...form.register("featured")} />
        Featured project
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save project"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
