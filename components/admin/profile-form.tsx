"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { saveProfile } from "@/app/admin/(dashboard)/profile/actions";
import { applyActionResult, type BannerState } from "@/components/admin/apply-result";
import { FileUpload } from "@/components/admin/file-upload";
import { Field, StatusBanner, inputClassName } from "@/components/admin/form";
import { zodResolver } from "@/lib/zod-resolver";
import { profileSchema, type ProfileInput } from "@/lib/validations";

export function ProfileForm({
  profile,
}: {
  profile: ProfileInput | null;
}) {
  const [banner, setBanner] = useState<BannerState>(null);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile ?? {
      name: "",
      title: "",
      location: "",
      email: "",
      phone: "",
      summary: "",
      linkedinUrl: "",
      githubUrl: "",
      websiteUrl: "",
      resumeUrl: "",
      avatarUrl: "",
    },
  });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={form.handleSubmit(async (values) => {
        const result = await saveProfile(values);
        applyActionResult(result, form.setError, setBanner);
      })}
    >
      <StatusBanner state={banner} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={form.formState.errors.name?.message}>
          <input id="name" className={inputClassName} {...form.register("name")} />
        </Field>
        <Field label="Location" htmlFor="location" error={form.formState.errors.location?.message}>
          <input id="location" className={inputClassName} {...form.register("location")} />
        </Field>
      </div>
      <Field label="Title" htmlFor="title" error={form.formState.errors.title?.message}>
        <input id="title" className={inputClassName} {...form.register("title")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
          <input id="email" type="email" className={inputClassName} {...form.register("email")} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={form.formState.errors.phone?.message}>
          <input id="phone" className={inputClassName} {...form.register("phone")} />
        </Field>
      </div>
      <Field label="Summary" htmlFor="summary" error={form.formState.errors.summary?.message}>
        <textarea
          id="summary"
          rows={8}
          className={`${inputClassName} resize-y`}
          {...form.register("summary")}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="LinkedIn URL" htmlFor="linkedinUrl" error={form.formState.errors.linkedinUrl?.message}>
          <input id="linkedinUrl" className={inputClassName} {...form.register("linkedinUrl")} />
        </Field>
        <Field label="GitHub URL" htmlFor="githubUrl" error={form.formState.errors.githubUrl?.message}>
          <input id="githubUrl" className={inputClassName} {...form.register("githubUrl")} />
        </Field>
        <Field label="Website URL" htmlFor="websiteUrl" error={form.formState.errors.websiteUrl?.message}>
          <input id="websiteUrl" className={inputClassName} {...form.register("websiteUrl")} />
        </Field>
      </div>
      <FileUpload
        label="Avatar"
        kind="image"
        value={form.watch("avatarUrl")}
        onChange={(url) => form.setValue("avatarUrl", url, { shouldDirty: true })}
        hint="Square photos work best."
      />
      <FileUpload
        label="Résumé PDF (optional upload)"
        kind="pdf"
        value={form.watch("resumeUrl")}
        onChange={(url) => form.setValue("resumeUrl", url, { shouldDirty: true })}
        hint="The public Download Résumé button always uses a PDF generated from this content at /resume.pdf."
      />
      <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
