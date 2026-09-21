import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "better-auth",
    "bcryptjs",
    "@aws-sdk/client-s3",
  ],
};

export default nextConfig;
