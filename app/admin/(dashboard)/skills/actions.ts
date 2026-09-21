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
import {
  reorderSchema,
  skillGroupSchema,
  skillSchema,
  type SkillGroupInput,
  type SkillInput,
} from "@/lib/validations";

async function touchGroup(groupId: string) {
  await prisma.skillGroup.update({
    where: { id: groupId },
    data: { updatedAt: new Date() },
  });
}

export async function createSkillGroup(input: SkillGroupInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = skillGroupSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  const last = await prisma.skillGroup.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.skillGroup.create({
    data: {
      label: parsed.data.label,
      order: (last?.order ?? -1) + 1,
    },
  });

  revalidatePublic();
  return actionOk();
}

export async function updateSkillGroup(
  id: string,
  input: SkillGroupInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = skillGroupSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  await prisma.skillGroup.update({
    where: { id },
    data: { label: parsed.data.label },
  });

  revalidatePublic();
  return actionOk();
}

export async function deleteSkillGroup(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.skillGroup.delete({ where: { id } });
  revalidatePublic();
  return actionOk();
}

export async function createSkill(input: SkillInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  const last = await prisma.skill.findFirst({
    where: { groupId: parsed.data.groupId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.skill.create({
    data: {
      name: parsed.data.name,
      groupId: parsed.data.groupId,
      order: (last?.order ?? -1) + 1,
    },
  });
  await touchGroup(parsed.data.groupId);

  revalidatePublic();
  return actionOk();
}

export async function updateSkill(
  id: string,
  input: Pick<SkillInput, "name">,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = skillSchema.pick({ name: true }).safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  const skill = await prisma.skill.update({
    where: { id },
    data: { name: parsed.data.name },
  });
  await touchGroup(skill.groupId);

  revalidatePublic();
  return actionOk();
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdmin();
  const skill = await prisma.skill.delete({ where: { id } });
  await touchGroup(skill.groupId);
  revalidatePublic();
  return actionOk();
}

export async function reorderSkillGroups(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reorderSchema.safeParse({ ids });
  if (!parsed.success) return actionFail("Could not reorder groups.");

  await prisma.$transaction(
    parsed.data.ids.map((id, order) =>
      prisma.skillGroup.update({ where: { id }, data: { order } }),
    ),
  );

  revalidatePublic();
  return actionOk();
}

export async function reorderSkills(
  groupId: string,
  ids: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reorderSchema.safeParse({ ids });
  if (!parsed.success) return actionFail("Could not reorder skills.");

  await prisma.$transaction(
    parsed.data.ids.map((id, order) =>
      prisma.skill.update({ where: { id }, data: { order } }),
    ),
  );
  await touchGroup(groupId);

  revalidatePublic();
  return actionOk();
}
