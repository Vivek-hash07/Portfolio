import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const CONTACT_MAX_ATTEMPTS = 5;

function clientKey(headers: Headers, prefix?: string) {
  const forwarded = headers.get("x-forwarded-for");
  const ip =
    headers.get("cf-connecting-ip") ||
    forwarded?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";

  return prefix ? `${prefix}:${ip}` : ip;
}

async function isRateLimited(
  headers: Headers,
  maxAttempts: number,
  prefix?: string,
) {
  const key = clientKey(headers, prefix);
  const windowStart = new Date(Date.now() - WINDOW_MS);
  const attempts = await prisma.loginAttempt.count({
    where: {
      key,
      createdAt: { gte: windowStart },
    },
  });

  return attempts >= maxAttempts;
}

async function recordAttempt(headers: Headers, prefix?: string) {
  const key = clientKey(headers, prefix);
  const windowStart = new Date(Date.now() - WINDOW_MS);

  await prisma.$transaction([
    prisma.loginAttempt.create({ data: { key } }),
    prisma.loginAttempt.deleteMany({
      where: { createdAt: { lt: windowStart } },
    }),
  ]);
}

export async function isLoginRateLimited(headers: Headers) {
  return isRateLimited(headers, LOGIN_MAX_ATTEMPTS);
}

export async function recordFailedLogin(headers: Headers) {
  return recordAttempt(headers);
}

export async function isContactRateLimited(headers: Headers) {
  return isRateLimited(headers, CONTACT_MAX_ATTEMPTS, "contact");
}

export async function recordContactAttempt(headers: Headers) {
  return recordAttempt(headers, "contact");
}
