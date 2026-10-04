import type { SkillGroupWithSkills } from "@/lib/data";
import { Reveal } from "@/components/public/reveal";
import { Container, SectionHeading } from "@/components/public/ui";

export function Skills({
  groups,
  updatedAt,
}: {
  groups: SkillGroupWithSkills[];
  updatedAt?: Date | null;
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section
      id="skills"
      data-pipeline-node="Skills"
      className="scroll-mt-24 border-b border-border py-[var(--section-y)]"
    >
      <Container>
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Capabilities"
            title="Skills"
            updatedAt={updatedAt}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <article key={group.id} className="skill-panel rounded-2xl p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-fg">
                    {group.label}
                  </h3>
                  <span className="font-mono text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                    {String(group.skills.length).padStart(2, "0")} items
                  </span>
                </div>
                <ul className="mt-5 grid gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill.id} className="skill-row">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
