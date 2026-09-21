import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/form";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminProject } from "@/lib/admin-data";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAdminProject(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader title="Edit project" description={project.title} />
      <ProjectForm
        id={project.id}
        defaultValues={{
          title: project.title,
          subtitle: project.subtitle ?? "",
          description: project.description.length > 0 ? project.description : [""],
          techStack: project.techStack.length > 0 ? project.techStack : [""],
          liveUrl: project.liveUrl ?? "",
          repoUrl: project.repoUrl ?? "",
          imageUrl: project.imageUrl ?? "",
          featured: project.featured,
        }}
      />
    </main>
  );
}
