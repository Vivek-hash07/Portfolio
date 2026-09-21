import type { Certification, Education } from "@/app/generated/prisma/client";
import { Reveal } from "@/components/public/reveal";
import { Container, SectionHeading } from "@/components/public/ui";
import { formatDateRange } from "@/lib/format";

export function EducationAndCertifications({
  education,
  certifications,
  updatedAt,
}: {
  education: Education[];
  certifications: Certification[];
  updatedAt?: Date | null;
}) {
  if (education.length === 0 && certifications.length === 0) {
    return null;
  }

  return (
    <section
      id="education"
      data-pipeline-node="Path"
      className="scroll-mt-24 border-b border-border py-[var(--section-y)]"
    >
      <Container>
        <Reveal>
          <SectionHeading
            index="05"
            eyebrow="Background"
            title="Education & Certifications"
            updatedAt={updatedAt}
          />
          <div className="grid gap-12 md:grid-cols-2">
            {education.length > 0 ? (
              <div>
                <h3 className="font-mono text-[0.7rem] tracking-[0.18em] text-muted uppercase">
                  Education
                </h3>
                <ul className="mt-6 space-y-6">
                  {education.map((item) => (
                    <li key={item.id}>
                      <p className="font-mono text-xs text-accent">
                        {formatDateRange(item.startDate, item.endDate)}
                      </p>
                      <p className="font-display mt-1 font-semibold text-fg">
                        {item.degree}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {item.institution}
                      </p>
                      {item.detail ? (
                        <p className="mt-2 text-sm text-muted">{item.detail}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {certifications.length > 0 ? (
              <div>
                <h3 className="font-mono text-[0.7rem] tracking-[0.18em] text-muted uppercase">
                  Certifications
                </h3>
                <ul className="mt-6 space-y-4">
                  {certifications.map((cert) => (
                    <li key={cert.id}>
                      {cert.url ? (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-fg underline-offset-4 hover:text-accent hover:underline"
                        >
                          {cert.name}
                        </a>
                      ) : (
                        <p className="font-medium text-fg">{cert.name}</p>
                      )}
                      {cert.issuer ? (
                        <p className="text-sm text-muted">{cert.issuer}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
