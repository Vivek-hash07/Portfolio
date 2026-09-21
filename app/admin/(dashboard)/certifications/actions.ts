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
  certificationSchema,
  reorderSchema,
  type CertificationInput,
} from "@/lib/validations";

export async function createCertification(
  input: CertificationInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = certificationSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  const last = await prisma.certification.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.certification.create({
    data: {
      ...parsed.data,
      order: (last?.order ?? -1) + 1,
    },
  });

  revalidatePublic();
  return actionOk();
}

export async function updateCertification(
  id: string,
  input: CertificationInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = certificationSchema.safeParse(input);
  if (!parsed.success) return failFromZod(parsed.error);

  await prisma.certification.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePublic();
  return actionOk();
}

export async function deleteCertification(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.certification.delete({ where: { id } });
  revalidatePublic();
  return actionOk();
}

export async function reorderCertifications(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reorderSchema.safeParse({ ids });
  if (!parsed.success) return actionFail("Could not reorder certifications.");

  await prisma.$transaction(
    parsed.data.ids.map((id, order) =>
      prisma.certification.update({ where: { id }, data: { order } }),
    ),
  );

  revalidatePublic();
  return actionOk();
}
