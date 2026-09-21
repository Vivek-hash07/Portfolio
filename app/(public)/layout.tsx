import type { Metadata } from "next";
import { PersonJsonLd } from "@/components/public/json-ld";
import { PipelineSpine } from "@/components/public/pipeline-spine";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteNav } from "@/components/public/site-nav";
import { getPortfolio, getProfile } from "@/lib/data";
import { latestDate } from "@/lib/format";
import { getSiteUrl } from "@/lib/site";

// ISR with a 60s safety net. Admin mutations call revalidatePublic() immediately.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteUrl = getSiteUrl();

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
    description: `${profile.title}. ${profile.summary.slice(0, 160)}`,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: profile.name,
      title: profile.name,
      description: profile.title,
    },
    twitter: {
      card: "summary_large_image",
      title: profile.name,
      description: profile.title,
    },
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
  };
}

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const [profile, portfolio] = await Promise.all([getProfile(), getPortfolio()]);
  const updatedAt = latestDate([
    profile?.updatedAt,
    ...portfolio.skillGroups.map((group) => group.updatedAt),
    ...portfolio.skillGroups.flatMap((group) =>
      group.skills.map((skill) => skill.updatedAt),
    ),
    ...portfolio.experiences.map((item) => item.updatedAt),
    ...portfolio.projects.map((item) => item.updatedAt),
    ...portfolio.certifications.map((item) => item.updatedAt),
    ...portfolio.education.map((item) => item.updatedAt),
  ]);

  return (
    <div className="relative z-10 flex min-h-full flex-1 flex-col bg-bg">
      {profile ? <PersonJsonLd profile={profile} /> : null}
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
        <SiteFooter profile={profile} updatedAt={updatedAt} />
      </div>
    </div>
  );
}
