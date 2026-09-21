import { PageHeader } from "@/components/admin/form";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader title="Add project" description="Create a new project card for the public site." />
      <ProjectForm
        defaultValues={{
          title: "",
          subtitle: "",
          description: [""],
          techStack: [""],
          liveUrl: "",
          repoUrl: "",
          imageUrl: "",
          featured: false,
        }}
      />
    </main>
  );
}
