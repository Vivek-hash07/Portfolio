import Link from "next/link";
import { PageHeader } from "@/components/admin/form";
import { ProjectList } from "@/components/admin/project-list";
import { getAdminProjects } from "@/lib/admin-data";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Projects"
        description="Case studies, tech stacks, images, and featured treatment. Drag to reorder."
        actions={
          <Link href="/admin/projects/new" className="btn btn-primary">
            Add project
          </Link>
        }
      />
      <ProjectList
        key={projects.map((item) => item.id).join("|")}
        projects={projects}
      />
    </main>
  );
}
