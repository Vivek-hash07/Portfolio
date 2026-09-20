import "dotenv/config";
import prisma from "../lib/prisma";

async function testDatabase() {
  console.log("Testing Prisma Postgres connection...\n");

  try {
    const [profile, skillGroups, experience, projects, certifications, education] =
      await Promise.all([
        prisma.profile.findFirst(),
        prisma.skillGroup.findMany({
          orderBy: { order: "asc" },
          include: { skills: { orderBy: { order: "asc" } } },
        }),
        prisma.experience.findMany({ orderBy: { order: "asc" } }),
        prisma.project.findMany({ orderBy: { order: "asc" } }),
        prisma.certification.findMany({ orderBy: { order: "asc" } }),
        prisma.education.findMany({ orderBy: { order: "asc" } }),
      ]);

    if (!profile) {
      throw new Error("No profile found. Run `npm run db:seed` first.");
    }

    console.log(`Profile: ${profile.name} — ${profile.title}`);
    console.log(`Skill groups: ${skillGroups.length}`);
    for (const group of skillGroups) {
      console.log(`  - ${group.label} (${group.skills.length})`);
    }
    console.log(`Experience: ${experience.length}`);
    for (const role of experience) {
      console.log(`  - ${role.role} @ ${role.company}`);
    }
    console.log(`Projects: ${projects.length}`);
    for (const project of projects) {
      console.log(`  - ${project.title}`);
    }
    console.log(`Certifications: ${certifications.length}`);
    console.log(`Education: ${education.length}`);

    if (
      skillGroups.length !== 7 ||
      experience.length !== 4 ||
      projects.length !== 2 ||
      certifications.length !== 5 ||
      education.length !== 1
    ) {
      throw new Error("Seeded content counts do not match Phase 2 expectations.");
    }

    console.log("\nDatabase read succeeded with expected Phase 2 content.");
  } catch (error) {
    console.error("Database test failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void testDatabase();
