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
import {
  experienceSchema,
  reorderSchema,
  type ExperienceInput,
} from "@/lib/validations";

function toData(input: ExperienceInput) {
  return {
    role: input.role,
    company: input.company,
    companyNote: input.companyNote,
    startDate: fromMonthInput(input.startDate),
    endDate: input.current || !input.endDate ? null : fromMonthInput(input.endDate),
    bullets: input.bullets,
  };
}

export async function createExperience(input: ExperienceInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  const last = await prisma.experience.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.experience.create({
    data: {
      ...toData(parsed.data),
      order: (last?.order ?? -1) + 1,
    },
  });

  revalidatePublic();
  return actionOk();
}

export async function updateExperience(
  id: string,
  input: ExperienceInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  await prisma.experience.update({
    where: { id },
    data: toData(parsed.data),
  });

  revalidatePublic();
  return actionOk();
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidatePublic();
  return actionOk();
}

export async function reorderExperiences(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reorderSchema.safeParse({ ids });
  if (!parsed.success) return actionFail("Could not reorder experience.");

  await prisma.$transaction(
    parsed.data.ids.map((id, order) =>
      prisma.experience.update({ where: { id }, data: { order } }),
    ),
  );

  revalidatePublic();
  return actionOk();
}
