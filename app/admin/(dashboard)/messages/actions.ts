"use server";

import {
  actionOk,
  requireAdmin,
  type ActionResult,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function refreshInbox() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function markMessageRead(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.message.update({
    where: { id },
    data: { readAt: new Date() },
  });
  refreshInbox();
  return actionOk();
}

export async function markMessageUnread(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.message.update({
    where: { id },
    data: { readAt: null },
  });
  refreshInbox();
  return actionOk();
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.message.delete({ where: { id } });
  refreshInbox();
  return actionOk();
}
