import type { Metadata } from "next";
import { PipelineSpine } from "@/components/public/pipeline-spine";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteNav } from "@/components/public/site-nav";
import { getProfile } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  if (!profile) {
    return {
      title: "Portfolio",
    };
  }

  return {
    title: {
      default: profile.name,
      template: `%s · ${profile.name}`,
    },
    description: profile.title,
  };
}

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();

  return (
    <div className="relative z-10 flex min-h-full flex-1 flex-col bg-bg">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteNav name={profile?.name ?? "Portfolio"} />
      <div
        data-pipeline-root
        className="relative flex flex-1 flex-col pl-8 md:pl-12"
      >
        <PipelineSpine />
        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
        <SiteFooter profile={profile} />
      </div>
    </div>
  );
}
