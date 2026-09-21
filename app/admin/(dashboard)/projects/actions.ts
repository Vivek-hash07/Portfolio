"use server";

import { prisma } from "@/lib/prisma";
import {
  actionFail,
  actionOk,
  failFromZod,
  requireAdmin,
  revalidatePublic,
  type ActionResult,
} from "@/lib/admin";
import { projectSchema, reorderSchema, type ProjectInput } from "@/lib/validations";

export async function createProject(input: ProjectInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  const last = await prisma.project.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.project.create({
    data: {
      ...parsed.data,
      order: (last?.order ?? -1) + 1,
    },
  });

  revalidatePublic();
  return actionOk();
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  await prisma.project.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePublic();
  return actionOk();
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePublic();
  return actionOk();
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reorderSchema.safeParse({ ids });
  if (!parsed.success) return actionFail("Could not reorder projects.");

  await prisma.$transaction(
    parsed.data.ids.map((id, order) =>
      prisma.project.update({ where: { id }, data: { order } }),
    ),
  );

  revalidatePublic();
  return actionOk();
}
