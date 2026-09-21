import { getProfile } from "@/lib/data";
import { renderOgImage } from "@/lib/og";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Image() {
  const profile = await getProfile();

  return renderOgImage({
    kicker: profile ? `Live pipeline · ${profile.location}` : "Portfolio",
    title: profile?.name ?? "Portfolio",
    subtitle: profile?.title,
  });
}
