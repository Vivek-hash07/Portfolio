import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "bcryptjs",
    "@aws-sdk/client-s3",
    "pdf-lib",
    "resend",
  ],
};

export default nextConfig;
