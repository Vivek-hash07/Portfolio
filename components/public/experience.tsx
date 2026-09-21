import type { Experience } from "@/app/generated/prisma/client";
import { Reveal } from "@/components/public/reveal";
import { Container, SectionHeading } from "@/components/public/ui";
import { formatDateRange } from "@/lib/format";

export function ExperienceTimeline({
  experiences,
}: {
  experiences: Experience[];
}) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section
      id="experience"
      data-pipeline-node="Work"
      className="scroll-mt-24 border-b border-border py-[var(--section-y)]"
    >
      <Container>
        <Reveal>
          <SectionHeading index="03" eyebrow="Work" title="Experience" />
          <ol className="space-y-12">
            {experiences.map((role) => (
              <li
                key={role.id}
                className="relative rounded-2xl border border-border bg-surface/70 p-6 sm:p-7"
              >
                <p className="font-mono text-xs tracking-wide text-accent">
                  {formatDateRange(role.startDate, role.endDate)}
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold text-fg sm:text-2xl">
                  {role.role}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {role.company}
                  {role.companyNote ? ` · ${role.companyNote}` : ""}
                </p>
                <ul className="mt-5 space-y-2 text-sm leading-7 text-fg/85">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
