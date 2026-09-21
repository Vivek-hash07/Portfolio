"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  actionFail,
  actionOk,
  failFromZod,
  requireAdmin,
  revalidatePublic,
  type ActionResult,
} from "@/lib/admin";
import { postSchema, type PostInput } from "@/lib/validations";

function isUniqueSlugError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createPost(input: PostInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  try {
    await prisma.post.create({
      data: {
        ...parsed.data,
        publishedAt: parsed.data.published ? new Date() : null,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return actionFail("That slug is already in use.", {
        slug: "That slug is already in use.",
      });
    }
    throw error;
  }

  revalidatePublic(
    parsed.data.published ? [`/blog/${parsed.data.slug}`] : [],
  );
  return actionOk();
}

export async function updatePost(id: string, input: PostInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return actionFail("Post not found.");
  }

  try {
    await prisma.post.update({
      where: { id },
      data: {
        ...parsed.data,
        publishedAt: parsed.data.published
          ? (existing.publishedAt ?? new Date())
          : existing.publishedAt,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return actionFail("That slug is already in use.", {
        slug: "That slug is already in use.",
      });
    }
    throw error;
  }

  revalidatePublic([`/blog/${existing.slug}`, `/blog/${parsed.data.slug}`]);
  return actionOk();
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin();
  const post = await prisma.post.delete({ where: { id } });
  revalidatePublic([`/blog/${post.slug}`]);
  return actionOk();
}
