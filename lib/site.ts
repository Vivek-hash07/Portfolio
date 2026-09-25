export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const raw =
    configured ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

  return raw.replace(/\/$/, "");
}

export function getMetadataBase() {
  try {
    return new URL(getSiteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
