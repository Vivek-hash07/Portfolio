"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  createExperience,
  updateExperience,
} from "@/app/admin/(dashboard)/experience/actions";
import { applyActionResult, type BannerState } from "@/components/admin/apply-result";
import {
  Field,
  StatusBanner,
  checkboxClassName,
  inputClassName,
} from "@/components/admin/form";
import { StringListInput } from "@/components/admin/string-list-input";
import { zodResolver } from "@/lib/zod-resolver";
import { experienceSchema, type ExperienceInput } from "@/lib/validations";

export function ExperienceForm({
  id,
  defaultValues,
}: {
  id?: string;
  defaultValues: ExperienceInput;
}) {
  const router = useRouter();
  const [banner, setBanner] = useState<BannerState>(null);
  const form = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });
  const current = form.watch("current");

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={form.handleSubmit(async (values) => {
        const result = id
          ? await updateExperience(id, values)
          : await createExperience(values);
        if (applyActionResult(result, form.setError, setBanner)) {
          router.push("/admin/experience");
          router.refresh();
        }
      })}
    >
      <StatusBanner state={banner} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Role" htmlFor="role" error={form.formState.errors.role?.message}>
          <input id="role" className={inputClassName} {...form.register("role")} />
        </Field>
        <Field label="Company" htmlFor="company" error={form.formState.errors.company?.message}>
          <input id="company" className={inputClassName} {...form.register("company")} />
        </Field>
      </div>
      <Field
        label="Company note"
        htmlFor="companyNote"
        hint="Optional, e.g. Backed by Indago Research"
        error={form.formState.errors.companyNote?.message}
      >
        <input id="companyNote" className={inputClassName} {...form.register("companyNote")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start" htmlFor="startDate" error={form.formState.errors.startDate?.message}>
          <input
            id="startDate"
            type="month"
            className={inputClassName}
            {...form.register("startDate")}
          />
        </Field>
        <Field label="End" htmlFor="endDate" error={form.formState.errors.endDate?.message}>
          <input
            id="endDate"
            type="month"
            className={inputClassName}
            disabled={current}
            {...form.register("endDate")}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-fg">
        <input
          type="checkbox"
          className={checkboxClassName}
          checked={current}
          onChange={(event) => {
            form.setValue("current", event.target.checked, { shouldDirty: true });
            if (event.target.checked) {
              form.setValue("endDate", "", { shouldDirty: true });
            }
          }}
        />
        I currently work here
      </label>
      <StringListInput
        label="Bullets"
        addLabel="Add bullet"
        values={form.watch("bullets")}
        onChange={(values) => form.setValue("bullets", values, { shouldDirty: true })}
        error={form.formState.errors.bullets?.message ?? form.formState.errors.bullets?.[0]?.message}
      />
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save role"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push("/admin/experience")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
