import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function clientKey(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  const ip =
    headers.get("cf-connecting-ip") ||
    forwarded?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";

  return ip;
}

export async function isLoginRateLimited(headers: Headers) {
  const key = clientKey(headers);
  const windowStart = new Date(Date.now() - WINDOW_MS);
  const attempts = await prisma.loginAttempt.count({
    where: {
      key,
      createdAt: { gte: windowStart },
    },
  });

  return attempts >= MAX_ATTEMPTS;
}

export async function recordFailedLogin(headers: Headers) {
  const key = clientKey(headers);
  const windowStart = new Date(Date.now() - WINDOW_MS);

  await prisma.$transaction([
    prisma.loginAttempt.create({ data: { key } }),
    prisma.loginAttempt.deleteMany({
      where: { createdAt: { lt: windowStart } },
    }),
  ]);
}
