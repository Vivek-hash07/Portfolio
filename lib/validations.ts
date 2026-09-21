import { z } from "zod";

const emptyToNull = (value: string | undefined | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const optionalText = z
  .string()
  .optional()
  .nullable()
  .transform(emptyToNull);

const mediaUrl = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .nullable()
  .refine(
    (value) =>
      !value ||
      value.startsWith("/") ||
      value.startsWith("https://") ||
      value.startsWith("http://"),
    "Must be a URL or site path",
  )
  .transform(emptyToNull);

const monthValue = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Use YYYY-MM");

const nonemptyList = (label: string) =>
  z
    .array(z.string().trim().min(1, `${label} cannot be empty`))
    .min(1, `Add at least one ${label.toLowerCase()}`);

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  title: z.string().trim().min(1, "Title is required").max(240),
  location: z.string().trim().min(1, "Location is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  phone: optionalText,
  summary: z.string().trim().min(1, "Summary is required"),
  linkedinUrl: mediaUrl,
  githubUrl: mediaUrl,
  websiteUrl: mediaUrl,
  resumeUrl: mediaUrl,
  avatarUrl: mediaUrl,
});

export const skillGroupSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(80),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Skill name is required").max(80),
  groupId: z.string().min(1),
});

export const experienceSchema = z
  .object({
    role: z.string().trim().min(1, "Role is required").max(160),
    company: z.string().trim().min(1, "Company is required").max(160),
    companyNote: optionalText,
    startDate: monthValue,
    current: z.boolean(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Use YYYY-MM")
      .or(z.literal(""))
      .optional(),
    bullets: nonemptyList("Bullet"),
  })
  .refine((value) => value.current || Boolean(value.endDate), {
    message: "End date is required unless this is a current role",
    path: ["endDate"],
  });

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  subtitle: optionalText,
  description: nonemptyList("Bullet"),
  techStack: nonemptyList("Tech"),
  liveUrl: mediaUrl,
  repoUrl: mediaUrl,
  imageUrl: mediaUrl,
  featured: z.boolean(),
});

export const certificationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  issuer: optionalText,
  url: mediaUrl,
});

export const educationSchema = z
  .object({
    degree: z.string().trim().min(1, "Degree is required").max(200),
    institution: z.string().trim().min(1, "Institution is required").max(200),
    detail: optionalText,
    startDate: monthValue,
    current: z.boolean(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Use YYYY-MM")
      .or(z.literal(""))
      .optional(),
  })
  .refine((value) => value.current || Boolean(value.endDate), {
    message: "End date is required unless this is current",
    path: ["endDate"],
  });

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  excerpt: optionalText,
  content: z.string().trim().min(1, "Content is required"),
  coverImage: mediaUrl,
  published: z.boolean(),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: optionalText,
  body: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(4000, "Message is too long"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type SkillGroupInput = z.infer<typeof skillGroupSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
