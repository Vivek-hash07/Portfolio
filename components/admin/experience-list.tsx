"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Experience } from "@/app/generated/prisma/client";
import {
  deleteExperience,
  reorderExperiences,
} from "@/app/admin/(dashboard)/experience/actions";
import type { BannerState } from "@/components/admin/apply-result";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { StatusBanner } from "@/components/admin/form";
import { SortableList } from "@/components/admin/sortable-list";
import { formatDateRange } from "@/lib/format";

export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const router = useRouter();
  const [items, setItems] = useState(experiences);
  const [banner, setBanner] = useState<BannerState>(null);
  const [, startTransition] = useTransition();

  if (items.length === 0) {
    return <p className="mt-8 text-sm text-muted">No roles yet. Add one to get started.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      <StatusBanner state={banner} />
      <SortableList
        items={items}
        onReorder={(ids) => {
          setItems(ids.map((id) => items.find((item) => item.id === id)!));
          startTransition(async () => {
            const result = await reorderExperiences(ids);
            setBanner(
              result.ok
                ? { type: "success", message: "Order saved" }
                : { type: "error", message: result.error },
            );
            router.refresh();
          });
        }}
        renderItem={(role) => (
          <article className="rounded-2xl border border-border bg-surface/80 p-4 sm:p-5">
            <p className="font-mono text-xs text-accent">
              {formatDateRange(role.startDate, role.endDate)}
            </p>
            <h2 className="font-display mt-1 text-lg font-semibold text-fg">{role.role}</h2>
            <p className="text-sm text-muted">
              {role.company}
              {role.companyNote ? ` · ${role.companyNote}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/admin/experience/${role.id}`} className="btn btn-ghost px-3 py-2 text-sm">
                Edit
              </Link>
              <ConfirmDelete
                title={`Delete ${role.role} at ${role.company}?`}
                onConfirm={async () => {
                  const result = await deleteExperience(role.id);
                  setBanner(
                    result.ok
                      ? { type: "success", message: "Role deleted" }
                      : { type: "error", message: result.error },
                  );
                  router.refresh();
                }}
              />
            </div>
          </article>
        )}
      />
    </div>
  );
}
