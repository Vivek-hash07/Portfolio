import { ExperienceForm } from "@/components/admin/experience-form";
import { PageHeader } from "@/components/admin/form";

export default function NewExperiencePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader title="Add role" description="Create a new experience entry." />
      <ExperienceForm
        defaultValues={{
          role: "",
          company: "",
          companyNote: "",
          startDate: "",
          current: true,
          endDate: "",
          bullets: [""],
        }}
      />
    </main>
  );
}
