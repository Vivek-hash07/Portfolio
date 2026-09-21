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
import { cachedPublicQuery } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

export type SkillGroupWithSkills = SkillGroup & { skills: Skill[] };

export type PortfolioData = {
  profile: Profile | null;
  skillGroups: SkillGroupWithSkills[];
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
};

export const getProfile = cachedPublicQuery(async (): Promise<Profile | null> => {
  return prisma.profile.findFirst();
}, "public-profile");

export const getPortfolio = cachedPublicQuery(async (): Promise<PortfolioData> => {
  const [profile, skillGroups, experiences, projects, certifications, education] =
    await Promise.all([
      prisma.profile.findFirst(),
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
}, "public-portfolio");

export const getPublishedPosts = cachedPublicQuery(async (): Promise<Post[]> => {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
}, "public-posts");

export const getPublishedPostBySlug = cachedPublicQuery(
  async (slug: string): Promise<Post | null> => {
    return prisma.post.findFirst({
      where: { slug, published: true },
    });
  },
  "public-post-by-slug",
);

export const getPublishedPostSlugs = cachedPublicQuery(
  async (): Promise<{ slug: string }[]> => {
    return prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });
  },
  "public-post-slugs",
);
