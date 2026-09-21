import { cache } from "react";
import { latestDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const getAdminProfile = cache(async () => {
  return prisma.profile.findFirst();
});

export const getAdminSkillGroups = cache(async () => {
  return prisma.skillGroup.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });
});

export const getAdminExperiences = cache(async () => {
  return prisma.experience.findMany({ orderBy: { order: "asc" } });
});

export const getAdminExperience = cache(async (id: string) => {
  return prisma.experience.findUnique({ where: { id } });
});

export const getAdminProjects = cache(async () => {
  return prisma.project.findMany({ orderBy: { order: "asc" } });
});

export const getAdminProject = cache(async (id: string) => {
  return prisma.project.findUnique({ where: { id } });
});

export const getAdminCertifications = cache(async () => {
  return prisma.certification.findMany({ orderBy: { order: "asc" } });
});

export const getAdminEducation = cache(async () => {
  return prisma.education.findMany({ orderBy: { order: "asc" } });
});

export const getAdminPosts = cache(async () => {
  return prisma.post.findMany({
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
});

export const getAdminPost = cache(async (id: string) => {
  return prisma.post.findUnique({ where: { id } });
});

export const getAdminMessages = cache(async () => {
  return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });
});

export const getAdminUnreadMessageCount = cache(async () => {
  return prisma.message.count({ where: { readAt: null } });
});

export const getAdminOverview = cache(async () => {
  const [
    profile,
    skillGroups,
    skills,
    experiences,
    projects,
    certifications,
    education,
    posts,
    messages,
  ] =
    await Promise.all([
      prisma.profile.findFirst({ select: { updatedAt: true } }),
      prisma.skillGroup.findMany({ select: { updatedAt: true } }),
      prisma.skill.findMany({ select: { updatedAt: true } }),
      prisma.experience.findMany({ select: { updatedAt: true } }),
      prisma.project.findMany({ select: { updatedAt: true } }),
      prisma.certification.findMany({ select: { updatedAt: true } }),
      prisma.education.findMany({ select: { updatedAt: true } }),
      prisma.post.findMany({
        select: { updatedAt: true, published: true },
      }),
      prisma.message.findMany({
        select: { createdAt: true, readAt: true },
      }),
    ]);

  return [
    {
      href: "/admin/profile",
      title: "Profile",
      description: "Name, title, summary, contact, avatar, résumé",
      count: profile ? 1 : 0,
      updatedAt: profile?.updatedAt ?? null,
    },
    {
      href: "/admin/skills",
      title: "Skills",
      description: "Groups and individual skills",
      count: skills.length,
      updatedAt: latestDate([
        ...skillGroups.map((item) => item.updatedAt),
        ...skills.map((item) => item.updatedAt),
      ]),
    },
    {
      href: "/admin/experience",
      title: "Experience",
      description: "Roles, dates, and bullets",
      count: experiences.length,
      updatedAt: latestDate(experiences.map((item) => item.updatedAt)),
    },
    {
      href: "/admin/projects",
      title: "Projects",
      description: "Case studies, images, and tech stacks",
      count: projects.length,
      updatedAt: latestDate(projects.map((item) => item.updatedAt)),
    },
    {
      href: "/admin/certifications",
      title: "Certifications",
      description: "Names, issuers, and links",
      count: certifications.length,
      updatedAt: latestDate(certifications.map((item) => item.updatedAt)),
    },
    {
      href: "/admin/education",
      title: "Education",
      description: "Degrees and institutions",
      count: education.length,
      updatedAt: latestDate(education.map((item) => item.updatedAt)),
    },
    {
      href: "/admin/blog",
      title: "Blog",
      description: "Drafts and published posts",
      count: posts.length,
      meta: `${posts.filter((post) => post.published).length} published`,
      updatedAt: latestDate(posts.map((item) => item.updatedAt)),
    },
    {
      href: "/admin/messages",
      title: "Messages",
      description: "Contact form inbox",
      count: messages.length,
      meta: `${messages.filter((item) => !item.readAt).length} unread`,
      updatedAt: latestDate(messages.map((item) => item.createdAt)),
    },
  ];
});
