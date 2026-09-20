import "dotenv/config";
import prisma from "../lib/prisma";

async function testDatabase() {
  console.log("Testing Prisma Postgres connection...\n");

  try {
    const created = await prisma.smokeTest.create({
      data: { label: "phase-1-read-write" },
    });
    console.log("Wrote smoke test row:", created);

    const rows = await prisma.smokeTest.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log(`Read ${rows.length} smoke test row(s):`);
    for (const row of rows) {
      console.log(`  - ${row.id} ${row.label}`);
    }

    console.log("\nDatabase read/write succeeded.");
  } catch (error) {
    console.error("Database test failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void testDatabase();
