import { PageHeader } from "@/components/admin/form";
import { SkillsManager } from "@/components/admin/skills-manager";
import { getAdminSkillGroups } from "@/lib/admin-data";

export default async function AdminSkillsPage() {
  const groups = await getAdminSkillGroups();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Skills"
        description="Add, edit, delete, and drag to reorder skill groups and the skills inside them."
      />
      <SkillsManager
        key={groups
          .map((group) => `${group.id}:${group.skills.map((skill) => skill.id).join(",")}`)
          .join("|")}
        groups={groups}
      />
    </main>
  );
}
