import { EducationAndCertifications } from "@/components/public/education-certs";
import { ExperienceTimeline } from "@/components/public/experience";
import { Hero } from "@/components/public/hero";
import { Projects } from "@/components/public/projects";
import { Skills } from "@/components/public/skills";
import { Summary } from "@/components/public/summary";
import { getPortfolio } from "@/lib/data";
import { latestDate } from "@/lib/format";

// Time-based ISR fallback. On-demand revalidation happens from admin saves.
export const revalidate = 60;

export default async function HomePage() {
  const {
    profile,
    skillGroups,
    experiences,
    projects,
    certifications,
    education,
  } = await getPortfolio();

  if (!profile) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-24">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">
          Portfolio
        </h1>
        <p className="mt-4 text-muted">Content has not been published yet.</p>
      </main>
    );
  }

  const skillsUpdatedAt = latestDate([
    ...skillGroups.map((group) => group.updatedAt),
    ...skillGroups.flatMap((group) => group.skills.map((skill) => skill.updatedAt)),
  ]);

  return (
    <main>
      <Hero profile={profile} />
      <Summary summary={profile.summary} updatedAt={profile.updatedAt} />
      <Skills groups={skillGroups} updatedAt={skillsUpdatedAt} />
      <ExperienceTimeline
        experiences={experiences}
        updatedAt={latestDate(experiences.map((item) => item.updatedAt))}
      />
      <Projects
        projects={projects}
        updatedAt={latestDate(projects.map((item) => item.updatedAt))}
      />
      <EducationAndCertifications
        education={education}
        certifications={certifications}
        updatedAt={latestDate([
          ...education.map((item) => item.updatedAt),
          ...certifications.map((item) => item.updatedAt),
        ])}
      />
    </main>
  );
}
