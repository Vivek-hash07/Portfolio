"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession } from "@/lib/admin-session";
import { isLoginRateLimited, recordFailedLogin } from "@/lib/login-rate-limit";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export type LoginState = { error: string } | null;

function safeAdminPath(value: FormDataEntryValue | null) {
  const from = String(value ?? "");

  if (!from.startsWith("/admin") || from.startsWith("//") || from.includes("://")) {
    return "/admin";
  }

  if (from.startsWith("/admin/login")) {
    return "/admin";
  }

  return from;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const requestHeaders = await headers();

  if (await isLoginRateLimited(requestHeaders)) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = email
    ? await prisma.adminUser.findUnique({ where: { email } })
    : null;
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    await recordFailedLogin(requestHeaders);
    return { error: "Invalid email or password" };
  }

  await createAdminSession(user.id);
  redirect(safeAdminPath(formData.get("from")));
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
