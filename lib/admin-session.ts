import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE = "admin_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export function adminSessionCookieName() {
  return COOKIE;
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}

export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token: tokenHash(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  };
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function createAdminSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);

  await prisma.session.create({
    data: {
      id: randomUUID(),
      token: tokenHash(token),
      userId,
      expiresAt,
    },
  });

  (await cookies()).set(COOKIE, token, cookieOptions());
}

export async function destroyAdminSession() {
  const token = (await cookies()).get(COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { token: tokenHash(token) },
    });
  }

  (await cookies()).delete(COOKIE);
}
