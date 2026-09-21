import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { requireAdminSession } from "@/lib/admin-session";

export type ActionOk = { ok: true };
export type ActionFail = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
};
export type ActionResult = ActionOk | ActionFail;

export function actionOk(): ActionOk {
  return { ok: true };
}

export function actionFail(
  error: string,
  fieldErrors?: Record<string, string>,
): ActionFail {
  return { ok: false, error, fieldErrors };
}

export async function requireAdmin() {
  await requireAdminSession();
}

export function flattenZodError(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_form";
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

export function failFromZod(error: ZodError): ActionFail {
  const fieldErrors = flattenZodError(error);
  return actionFail(
    Object.values(fieldErrors)[0] ?? "Please fix the highlighted fields.",
    fieldErrors,
  );
}

export function revalidatePublic(extraPaths: string[] = []) {
  const paths = new Set(["/", "/blog", ...extraPaths]);

  for (const path of paths) {
    revalidatePath(path);
  }

  revalidatePath("/blog/[slug]", "page");
}
