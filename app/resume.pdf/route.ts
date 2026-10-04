import { getPortfolio } from "@/lib/data";
import { publicResumeUrl, resumeObjectKeys } from "@/lib/resume";
import { buildResumePdf, resumeFilename } from "@/lib/resume-pdf";
import { getS3Object } from "@/lib/storage";

export const revalidate = 60;

async function fetchRemotePdf(url: string) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 5 || bytes.subarray(0, 4).toString() !== "%PDF") {
      return null;
    }

    return bytes;
  } catch {
    return null;
  }
}

export async function GET() {
  const data = await getPortfolio();

  if (!data.profile) {
    return new Response("Profile not found", { status: 404 });
  }

  const filename = resumeFilename(data.profile.name);

  for (const key of resumeObjectKeys(data.profile.resumeUrl)) {
    const object = await getS3Object(key);
    if (object) {
      return new Response(new Uint8Array(object.bytes), {
        headers: {
          "Content-Type": object.contentType || "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      });
    }
  }

  const remoteUrl = publicResumeUrl(data.profile.resumeUrl);
  const remoteBytes = remoteUrl ? await fetchRemotePdf(remoteUrl) : null;
  if (remoteBytes) {
    return new Response(new Uint8Array(remoteBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  }

  const bytes = await buildResumePdf(data);

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
