import { Reveal } from "@/components/public/reveal";
import { Container, SectionHeading } from "@/components/public/ui";

export function Summary({
  summary,
  updatedAt,
}: {
  summary: string;
  updatedAt?: Date | null;
}) {
  return (
    <section
      id="about"
      data-pipeline-node="About"
      className="scroll-mt-24 border-b border-border py-[var(--section-y)]"
    >
      <Container>
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow="About"
            title="Summary"
            updatedAt={updatedAt}
          />
          <p className="max-w-3xl text-base leading-8 text-fg/85 sm:text-lg">
            {summary}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
