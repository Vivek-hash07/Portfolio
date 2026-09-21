"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createSkill,
  createSkillGroup,
  deleteSkill,
  deleteSkillGroup,
  reorderSkillGroups,
  reorderSkills,
  updateSkill,
  updateSkillGroup,
} from "@/app/admin/(dashboard)/skills/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { StatusBanner, inputClassName } from "@/components/admin/form";
import { SortableList } from "@/components/admin/sortable-list";
import type { BannerState } from "@/components/admin/apply-result";
import type { SkillGroupWithSkills } from "@/lib/data";

type Banner = BannerState;

function resultBanner(
  result: { ok: true } | { ok: false; error: string },
  success: string,
): Banner {
  return result.ok ? { type: "success", message: success } : { type: "error", message: result.error };
}

export function SkillsManager({ groups }: { groups: SkillGroupWithSkills[] }) {
  const router = useRouter();
  const [items, setItems] = useState(groups);
  const [banner, setBanner] = useState<Banner>(null);
  const [groupLabel, setGroupLabel] = useState("");
  const [, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  return (
    <div className="mt-8 space-y-6">
      <StatusBanner state={banner} />
      <form
        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/70 p-4 sm:flex-row sm:items-end"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await createSkillGroup({ label: groupLabel });
          setBanner(resultBanner(result, "Skill group added"));
          if (result.ok) {
            setGroupLabel("");
            refresh();
          }
        }}
      >
        <label className="block min-w-0 flex-1 space-y-2">
          <span className="text-sm font-medium text-fg">Add skill group</span>
          <input
            value={groupLabel}
            onChange={(event) => setGroupLabel(event.target.value)}
            className={inputClassName}
            placeholder="Languages, Frontend, AI / GenAI…"
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Add group
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-muted">No skill groups yet. Add one to get started.</p>
      ) : (
        <SortableList
          items={items}
          onReorder={(ids) => {
            setItems(ids.map((id) => items.find((item) => item.id === id)!));
            startTransition(async () => {
              const result = await reorderSkillGroups(ids);
              setBanner(resultBanner(result, "Group order saved"));
              refresh();
            });
          }}
          renderItem={(group) => (
            <SkillGroupCard
              group={group}
              onBanner={setBanner}
              onChange={(next) =>
                setItems((current) => current.map((item) => (item.id === next.id ? next : item)))
              }
              onRefresh={refresh}
            />
          )}
        />
      )}
    </div>
  );
}

function SkillGroupCard({
  group,
  onBanner,
  onChange,
  onRefresh,
}: {
  group: SkillGroupWithSkills;
  onBanner: (banner: Banner) => void;
  onChange: (group: SkillGroupWithSkills) => void;
  onRefresh: () => void;
}) {
  const [label, setLabel] = useState(group.label);
  const [skillName, setSkillName] = useState("");
  const [, startTransition] = useTransition();

  return (
    <article className="rounded-2xl border border-border bg-surface/80 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className={inputClassName}
          aria-label="Group label"
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-ghost px-3 py-2 text-sm"
            onClick={async () => {
              const result = await updateSkillGroup(group.id, { label });
              onBanner(resultBanner(result, "Group saved"));
              onRefresh();
            }}
          >
            Save
          </button>
          <ConfirmDelete
            title={`Delete ${group.label}?`}
            description="This permanently deletes the group and every skill inside it."
            onConfirm={async () => {
              const result = await deleteSkillGroup(group.id);
              onBanner(resultBanner(result, "Group deleted"));
              onRefresh();
            }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {group.skills.length === 0 ? (
          <p className="text-sm text-muted">No skills in this group yet.</p>
        ) : (
          <SortableList
            items={group.skills}
            onReorder={(ids) => {
              onChange({
                ...group,
                skills: ids.map((id) => group.skills.find((skill) => skill.id === id)!),
              });
              startTransition(async () => {
                const result = await reorderSkills(group.id, ids);
                onBanner(resultBanner(result, "Skill order saved"));
                onRefresh();
              });
            }}
            renderItem={(skill) => (
              <SkillRow
                skill={skill}
                onBanner={onBanner}
                onRefresh={onRefresh}
              />
            )}
          />
        )}
      </div>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await createSkill({ name: skillName, groupId: group.id });
          onBanner(resultBanner(result, "Skill added"));
          if (result.ok) {
            setSkillName("");
            onRefresh();
          }
        }}
      >
        <input
          value={skillName}
          onChange={(event) => setSkillName(event.target.value)}
          className={inputClassName}
          placeholder="Add a skill"
        />
        <button type="submit" className="btn btn-primary px-3 py-2 text-sm">
          Add skill
        </button>
      </form>
    </article>
  );
}

function SkillRow({
  skill,
  onBanner,
  onRefresh,
}: {
  skill: SkillGroupWithSkills["skills"][number];
  onBanner: (banner: Banner) => void;
  onRefresh: () => void;
}) {
  const [name, setName] = useState(skill.name);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-bg/40 p-3 sm:flex-row sm:items-center">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        className={inputClassName}
        aria-label="Skill name"
      />
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-ghost px-3 py-2 text-sm"
          onClick={async () => {
            const result = await updateSkill(skill.id, { name });
            onBanner(resultBanner(result, "Skill saved"));
            onRefresh();
          }}
        >
          Save
        </button>
        <ConfirmDelete
          title={`Delete ${skill.name}?`}
          onConfirm={async () => {
            const result = await deleteSkill(skill.id);
            onBanner(resultBanner(result, "Skill deleted"));
            onRefresh();
          }}
        />
      </div>
    </div>
  );
}
