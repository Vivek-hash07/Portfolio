import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

const authSecret = process.env.BETTER_AUTH_SECRET;
const authUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

if (!authSecret && process.env.NODE_ENV === "production") {
  throw new Error("BETTER_AUTH_SECRET is not set");
}

export const auth = betterAuth({
  secret: authSecret,
  baseURL: authUrl,
  trustedOrigins: [authUrl],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    modelName: "adminUser",
    additionalFields: {
      passwordHash: {
        type: "string",
        required: true,
        input: false,
        returned: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
    password: {
      hash: hashPassword,
      verify: async ({ hash, password }) => verifyPassword(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
    storage: "database",
    customRules: {
      "/sign-in/email": {
        window: 60,
        max: 5,
      },
    },
  },
  logger: {
    level: "error",
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  },
  databaseHooks: {
    account: {
      create: {
        after: async (account) => {
          if (account.password && account.userId) {
            await prisma.adminUser.update({
              where: { id: account.userId },
              data: { passwordHash: account.password },
            });
          }
        },
      },
      update: {
        after: async (account) => {
          if (account.password && account.userId) {
            await prisma.adminUser.update({
              where: { id: account.userId },
              data: { passwordHash: account.password },
            });
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});
