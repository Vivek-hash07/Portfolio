import { PageHeader } from "@/components/admin/form";
import { ProfileForm } from "@/components/admin/profile-form";
import { getAdminProfile } from "@/lib/admin-data";

export default async function AdminProfilePage() {
  const profile = await getAdminProfile();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Profile"
        description="Name, title, summary, contact details, avatar, and résumé. This is the source for the public hero and footer."
      />
      <ProfileForm
        profile={
          profile
            ? {
                name: profile.name,
                title: profile.title,
                location: profile.location,
                email: profile.email,
                phone: profile.phone ?? "",
                summary: profile.summary,
                linkedinUrl: profile.linkedinUrl ?? "",
                githubUrl: profile.githubUrl ?? "",
                websiteUrl: profile.websiteUrl ?? "",
                resumeUrl: profile.resumeUrl ?? "",
                avatarUrl: profile.avatarUrl ?? "",
              }
            : null
        }
      />
    </main>
  );
}
