import { EducationManager } from "@/components/admin/education-manager";
import { PageHeader } from "@/components/admin/form";
import { getAdminEducation } from "@/lib/admin-data";

export default async function AdminEducationPage() {
  const education = await getAdminEducation();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Education"
        description="Add, edit, delete, and drag to reorder education entries."
      />
      <EducationManager
        key={education.map((item) => `${item.id}:${item.updatedAt.toISOString()}`).join("|")}
        education={education}
      />
    </main>
  );
}
