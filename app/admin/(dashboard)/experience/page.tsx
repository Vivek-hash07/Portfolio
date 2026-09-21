import Link from "next/link";
import { ExperienceList } from "@/components/admin/experience-list";
import { PageHeader } from "@/components/admin/form";
import { getAdminExperiences } from "@/lib/admin-data";

export default async function AdminExperiencePage() {
  const experiences = await getAdminExperiences();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Experience"
        description="Roles, dates, and bullets. Drag to reorder how they appear on the public timeline."
        actions={
          <Link href="/admin/experience/new" className="btn btn-primary">
            Add role
          </Link>
        }
      />
      <ExperienceList
        key={experiences.map((item) => item.id).join("|")}
        experiences={experiences}
      />
    </main>
  );
}
