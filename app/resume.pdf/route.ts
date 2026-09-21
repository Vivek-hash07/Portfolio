import { getPortfolio } from "@/lib/data";
import { buildResumePdf, resumeFilename } from "@/lib/resume-pdf";

export const revalidate = 60;

export async function GET() {
  const data = await getPortfolio();

  if (!data.profile) {
    return new Response("Profile not found", { status: 404 });
  }

  const bytes = await buildResumePdf(data);
  const filename = resumeFilename(data.profile.name);

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
