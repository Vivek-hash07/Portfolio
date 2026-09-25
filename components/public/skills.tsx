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
          <div className="grid gap-10 sm:grid-cols-2">
            {groups.map((group) => (
              <div key={group.id}>
                <h3 className="font-mono text-[0.7rem] font-semibold tracking-[0.18em] text-muted uppercase">
                  {group.label}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill, index) => (
                    <li
                      key={skill.id}
                      className="skill-chip rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-fg/90"
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
