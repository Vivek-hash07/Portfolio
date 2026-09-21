"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/app/generated/prisma/client";
import { deleteProject, reorderProjects } from "@/app/admin/(dashboard)/projects/actions";
import type { BannerState } from "@/components/admin/apply-result";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { StatusBanner } from "@/components/admin/form";
import { SortableList } from "@/components/admin/sortable-list";

export function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [items, setItems] = useState(projects);
  const [banner, setBanner] = useState<BannerState>(null);
  const [, startTransition] = useTransition();

  if (items.length === 0) {
    return <p className="mt-8 text-sm text-muted">No projects yet. Add one to get started.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      <StatusBanner state={banner} />
      <SortableList
        items={items}
        onReorder={(ids) => {
          setItems(ids.map((id) => items.find((item) => item.id === id)!));
          startTransition(async () => {
            const result = await reorderProjects(ids);
            setBanner(
              result.ok
                ? { type: "success", message: "Order saved" }
                : { type: "error", message: result.error },
            );
            router.refresh();
          });
        }}
        renderItem={(project) => (
          <article className="rounded-2xl border border-border bg-surface/80 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-fg">{project.title}</h2>
              {project.featured ? (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[0.65rem] tracking-wide text-accent uppercase">
                  Featured
                </span>
              ) : null}
            </div>
            {project.subtitle ? (
              <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/admin/projects/${project.id}`} className="btn btn-ghost px-3 py-2 text-sm">
                Edit
              </Link>
              <ConfirmDelete
                title={`Delete ${project.title}?`}
                onConfirm={async () => {
                  const result = await deleteProject(project.id);
                  setBanner(
                    result.ok
                      ? { type: "success", message: "Project deleted" }
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
