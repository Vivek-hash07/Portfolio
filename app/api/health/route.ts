import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.smokeTest.count();
    return NextResponse.json({
      ok: true,
      database: "connected",
      smokeTestRows: count,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { ok: false, database: "unreachable" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const row = await prisma.smokeTest.create({
      data: { label: `phase-1-${Date.now()}` },
    });
    const count = await prisma.smokeTest.count();

    return NextResponse.json({ ok: true, row, smokeTestRows: count }, { status: 201 });
  } catch (error) {
    console.error("Smoke test write failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to write smoke test row" },
      { status: 500 },
    );
  }
}
