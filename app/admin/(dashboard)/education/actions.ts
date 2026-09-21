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
import { fromMonthInput } from "@/lib/content-utils";
import { educationSchema, reorderSchema, type EducationInput } from "@/lib/validations";

function toData(input: EducationInput) {
  return {
    degree: input.degree,
    institution: input.institution,
    detail: input.detail,
    startDate: fromMonthInput(input.startDate),
    endDate: input.current || !input.endDate ? null : fromMonthInput(input.endDate),
  };
}

export async function createEducation(input: EducationInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  const last = await prisma.education.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.education.create({
    data: {
      ...toData(parsed.data),
      order: (last?.order ?? -1) + 1,
    },
  });

  revalidatePublic();
  return actionOk();
}

export async function updateEducation(
  id: string,
  input: EducationInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  await prisma.education.update({
    where: { id },
    data: toData(parsed.data),
  });

  revalidatePublic();
  return actionOk();
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.education.delete({ where: { id } });
  revalidatePublic();
  return actionOk();
}

export async function reorderEducation(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reorderSchema.safeParse({ ids });
  if (!parsed.success) return actionFail("Could not reorder education.");

  await prisma.$transaction(
    parsed.data.ids.map((id, order) =>
      prisma.education.update({ where: { id }, data: { order } }),
    ),
  );

  revalidatePublic();
  return actionOk();
}
