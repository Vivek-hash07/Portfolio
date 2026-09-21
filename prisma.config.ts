import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { withVerifyFullSsl } from "./lib/database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: withVerifyFullSsl(env("DATABASE_URL")),
  },
});
