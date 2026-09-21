import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { withVerifyFullSsl } from "@/lib/database-url";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: withVerifyFullSsl(connectionString),
});

const globalForPrisma = globalThis as unknown as {
  __portfolioPrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.__portfolioPrisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__portfolioPrisma = prisma;
}

export default prisma;
