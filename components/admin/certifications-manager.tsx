"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { Certification } from "@/app/generated/prisma/client";
import {
  createCertification,
  deleteCertification,
  reorderCertifications,
  updateCertification,
} from "@/app/admin/(dashboard)/certifications/actions";
import { applyActionResult, type BannerState } from "@/components/admin/apply-result";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Field, StatusBanner, inputClassName } from "@/components/admin/form";
import { SortableList } from "@/components/admin/sortable-list";
import { zodResolver } from "@/lib/zod-resolver";
import { certificationSchema, type CertificationInput } from "@/lib/validations";

const emptyValues: CertificationInput = {
  name: "",
  issuer: "",
  url: "",
};

export function CertificationsManager({
  certifications,
}: {
  certifications: Certification[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(certifications);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);
  const [, startTransition] = useTransition();
  const editing = items.find((item) => item.id === editingId);

  return (
    <div className="mt-8 space-y-6">
      <StatusBanner state={banner} />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setEditingId("new")}
      >
        Add certification
      </button>
      {editingId ? (
        <CertificationForm
          key={editingId}
          id={editingId === "new" ? undefined : editingId}
          defaultValues={
            editing
              ? { name: editing.name, issuer: editing.issuer ?? "", url: editing.url ?? "" }
              : emptyValues
          }
          onCancel={() => setEditingId(null)}
          onSaved={() => {
            setEditingId(null);
            router.refresh();
          }}
          setBanner={setBanner}
        />
      ) : null}
      {items.length === 0 ? (
        <p className="text-sm text-muted">No certifications yet.</p>
      ) : (
        <SortableList
          items={items}
          onReorder={(ids) => {
            setItems(ids.map((id) => items.find((item) => item.id === id)!));
            startTransition(async () => {
              const result = await reorderCertifications(ids);
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
              <h2 className="font-display text-lg font-semibold text-fg">{item.name}</h2>
              {item.issuer ? <p className="mt-1 text-sm text-muted">{item.issuer}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-ghost px-3 py-2 text-sm"
                  onClick={() => setEditingId(item.id)}
                >
                  Edit
                </button>
                <ConfirmDelete
                  title={`Delete ${item.name}?`}
                  onConfirm={async () => {
                    const result = await deleteCertification(item.id);
                    setBanner(
                      result.ok
                        ? { type: "success", message: "Certification deleted" }
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

function CertificationForm({
  id,
  defaultValues,
  onCancel,
  onSaved,
  setBanner,
}: {
  id?: string;
  defaultValues: CertificationInput;
  onCancel: () => void;
  onSaved: () => void;
  setBanner: (state: BannerState) => void;
}) {
  const form = useForm<CertificationInput>({
    resolver: zodResolver(certificationSchema),
    defaultValues,
  });

  return (
    <form
      className="space-y-5 rounded-2xl border border-border bg-surface/80 p-5"
      onSubmit={form.handleSubmit(async (values) => {
        const result = id
          ? await updateCertification(id, values)
          : await createCertification(values);
        if (applyActionResult(result, form.setError, setBanner)) {
          onSaved();
        }
      })}
    >
      <Field label="Name" htmlFor="cert-name" error={form.formState.errors.name?.message}>
        <input id="cert-name" className={inputClassName} {...form.register("name")} />
      </Field>
      <Field label="Issuer" htmlFor="cert-issuer" error={form.formState.errors.issuer?.message}>
        <input id="cert-issuer" className={inputClassName} {...form.register("issuer")} />
      </Field>
      <Field label="URL" htmlFor="cert-url" error={form.formState.errors.url?.message}>
        <input id="cert-url" className={inputClassName} {...form.register("url")} />
      </Field>
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
