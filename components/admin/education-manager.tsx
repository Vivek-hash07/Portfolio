"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { Education } from "@/app/generated/prisma/client";
import {
  createEducation,
  deleteEducation,
  reorderEducation,
  updateEducation,
} from "@/app/admin/(dashboard)/education/actions";
import { applyActionResult, type BannerState } from "@/components/admin/apply-result";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import {
  Field,
  StatusBanner,
  checkboxClassName,
  inputClassName,
} from "@/components/admin/form";
import { SortableList } from "@/components/admin/sortable-list";
import { formatDateRange } from "@/lib/format";
import { toMonthInput } from "@/lib/content-utils";
import { zodResolver } from "@/lib/zod-resolver";
import { educationSchema, type EducationInput } from "@/lib/validations";

const emptyValues: EducationInput = {
  degree: "",
  institution: "",
  detail: "",
  startDate: "",
  current: false,
  endDate: "",
};

function toValues(item: Education): EducationInput {
  return {
    degree: item.degree,
    institution: item.institution,
    detail: item.detail ?? "",
    startDate: toMonthInput(item.startDate),
    current: !item.endDate,
    endDate: item.endDate ? toMonthInput(item.endDate) : "",
  };
}

export function EducationManager({ education }: { education: Education[] }) {
  const router = useRouter();
  const [items, setItems] = useState(education);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);
  const [, startTransition] = useTransition();
  const editing = items.find((item) => item.id === editingId);

  return (
    <div className="mt-8 space-y-6">
      <StatusBanner state={banner} />
      <button type="button" className="btn btn-primary" onClick={() => setEditingId("new")}>
        Add education
      </button>
      {editingId ? (
        <EducationForm
          key={editingId}
          id={editingId === "new" ? undefined : editingId}
          defaultValues={editing ? toValues(editing) : emptyValues}
          onCancel={() => setEditingId(null)}
          onSaved={() => {
            setEditingId(null);
            router.refresh();
          }}
          setBanner={setBanner}
        />
      ) : null}
      {items.length === 0 ? (
        <p className="text-sm text-muted">No education entries yet.</p>
      ) : (
        <SortableList
          items={items}
          onReorder={(ids) => {
            setItems(ids.map((id) => items.find((item) => item.id === id)!));
            startTransition(async () => {
              const result = await reorderEducation(ids);
              setBanner(
                result.ok
                  ? { type: "success", message: "Order saved" }
                  : { type: "error", message: result.error },
              );
              router.refresh();
            });
          }}
          renderItem={(item) => (
            <article className="rounded-2xl border border-border bg-surface/80 p-4 sm:p-5">
              <p className="font-mono text-xs text-accent">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
              <h2 className="font-display mt-1 text-lg font-semibold text-fg">{item.degree}</h2>
              <p className="text-sm text-muted">{item.institution}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-ghost px-3 py-2 text-sm"
                  onClick={() => setEditingId(item.id)}
                >
                  Edit
                </button>
                <ConfirmDelete
                  title={`Delete ${item.degree}?`}
                  onConfirm={async () => {
                    const result = await deleteEducation(item.id);
                    setBanner(
                      result.ok
                        ? { type: "success", message: "Education deleted" }
                        : { type: "error", message: result.error },
                    );
                    router.refresh();
                  }}
                />
              </div>
            </article>
          )}
        />
      )}
    </div>
  );
}

function EducationForm({
  id,
  defaultValues,
  onCancel,
  onSaved,
  setBanner,
}: {
  id?: string;
  defaultValues: EducationInput;
  onCancel: () => void;
  onSaved: () => void;
  setBanner: (state: BannerState) => void;
}) {
  const form = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues,
  });
  const current = form.watch("current");

  return (
    <form
      className="space-y-5 rounded-2xl border border-border bg-surface/80 p-5"
      onSubmit={form.handleSubmit(async (values) => {
        const result = id ? await updateEducation(id, values) : await createEducation(values);
        if (applyActionResult(result, form.setError, setBanner)) {
          onSaved();
        }
      })}
    >
      <Field label="Degree" htmlFor="degree" error={form.formState.errors.degree?.message}>
        <input id="degree" className={inputClassName} {...form.register("degree")} />
      </Field>
      <Field
        label="Institution"
        htmlFor="institution"
        error={form.formState.errors.institution?.message}
      >
        <input id="institution" className={inputClassName} {...form.register("institution")} />
      </Field>
      <Field label="Detail" htmlFor="detail" error={form.formState.errors.detail?.message}>
        <input id="detail" className={inputClassName} {...form.register("detail")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start" htmlFor="edu-start" error={form.formState.errors.startDate?.message}>
          <input
            id="edu-start"
            type="month"
            className={inputClassName}
            {...form.register("startDate")}
          />
        </Field>
        <Field label="End" htmlFor="edu-end" error={form.formState.errors.endDate?.message}>
          <input
            id="edu-end"
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
        I currently study here
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
