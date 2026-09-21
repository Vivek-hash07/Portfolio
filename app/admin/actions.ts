"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isLoginRateLimited, recordFailedLogin } from "@/lib/login-rate-limit";

const LOGIN_ERROR_MESSAGE = "Invalid email or password";

export type LoginState = {
  error: string | null;
};

function safeAdminPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/admin")) {
    return "/admin";
  }

  if (value.startsWith("//") || value.includes("://") || value.startsWith("/admin/login")) {
    return "/admin";
  }

  return value;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeAdminPath(formData.get("from"));
  const requestHeaders = await headers();

  if (!email || !password) {
    return { error: LOGIN_ERROR_MESSAGE };
  }

  if (await isLoginRateLimited(requestHeaders)) {
    return { error: LOGIN_ERROR_MESSAGE };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: requestHeaders,
    });
  } catch {
    await recordFailedLogin(requestHeaders);
    return { error: LOGIN_ERROR_MESSAGE };
  }

  redirect(nextPath);
}

export async function logoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/admin/login");
}
