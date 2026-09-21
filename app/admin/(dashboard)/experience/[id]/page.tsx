import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/experience-form";
import { PageHeader } from "@/components/admin/form";
import { getAdminExperience } from "@/lib/admin-data";
import { toMonthInput } from "@/lib/content-utils";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getAdminExperience(id);

  if (!experience) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader title="Edit role" description={`${experience.role} · ${experience.company}`} />
      <ExperienceForm
        id={experience.id}
        defaultValues={{
          role: experience.role,
          company: experience.company,
          companyNote: experience.companyNote ?? "",
          startDate: toMonthInput(experience.startDate),
          current: !experience.endDate,
          endDate: experience.endDate ? toMonthInput(experience.endDate) : "",
          bullets: experience.bullets.length > 0 ? experience.bullets : [""],
        }}
      />
    </main>
  );
}
