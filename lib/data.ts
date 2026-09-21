import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type {
  Certification,
  Education,
  Experience,
  Post,
  Profile,
  Project,
  Skill,
  SkillGroup,
} from "@/app/generated/prisma/client";

export type SkillGroupWithSkills = SkillGroup & { skills: Skill[] };

export type PortfolioData = {
  profile: Profile | null;
  skillGroups: SkillGroupWithSkills[];
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
};

export const getProfile = cache(async (): Promise<Profile | null> => {
  return prisma.profile.findFirst();
});

export const getPortfolio = cache(async (): Promise<PortfolioData> => {
  const [profile, skillGroups, experiences, projects, certifications, education] =
    await Promise.all([
      getProfile(),
      prisma.skillGroup.findMany({
        orderBy: { order: "asc" },
        include: { skills: { orderBy: { order: "asc" } } },
      }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.certification.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
    ]);

  return {
    profile,
    skillGroups,
    experiences,
    projects,
    certifications,
    education,
  };
});

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
});

export const getPublishedPostBySlug = cache(
  async (slug: string): Promise<Post | null> => {
    return prisma.post.findFirst({
      where: { slug, published: true },
    });
  },
);

export const getPublishedPostSlugs = cache(async (): Promise<{ slug: string }[]> => {
  return prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
});
