import { CertificationsManager } from "@/components/admin/certifications-manager";
import { PageHeader } from "@/components/admin/form";
import { getAdminCertifications } from "@/lib/admin-data";

export default async function AdminCertificationsPage() {
  const certifications = await getAdminCertifications();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Certifications"
        description="Add, edit, delete, and drag to reorder certifications."
      />
      <CertificationsManager
        key={certifications.map((item) => `${item.id}:${item.updatedAt.toISOString()}`).join("|")}
        certifications={certifications}
      />
    </main>
  );
}
