import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      profiles,
      skillGroups,
      skills,
      experiences,
      projects,
      certifications,
      education,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.skillGroup.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.project.count(),
      prisma.certification.count(),
      prisma.education.count(),
    ]);

    return NextResponse.json({
      ok: true,
      database: "connected",
      counts: {
        profiles,
        skillGroups,
        skills,
        experiences,
        projects,
        certifications,
        education,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { ok: false, database: "unreachable" },
      { status: 500 },
    );
  }
}
