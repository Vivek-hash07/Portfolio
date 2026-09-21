"use server";

import { prisma } from "@/lib/prisma";
import {
  actionOk,
  failFromZod,
  requireAdmin,
  revalidatePublic,
  type ActionResult,
} from "@/lib/admin";
import { profileSchema, type ProfileInput } from "@/lib/validations";

export async function saveProfile(input: ProfileInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return failFromZod(parsed.error);
  }

  const existing = await prisma.profile.findFirst();
  const data = parsed.data;

  if (existing) {
    await prisma.profile.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.profile.create({ data });
  }

  revalidatePublic();
  return actionOk();
}
