import type { Project } from "@/app/generated/prisma/client";
import { Reveal } from "@/components/public/reveal";
import { Container, SectionHeading } from "@/components/public/ui";

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <article
      className={`project-card flex h-full flex-col rounded-2xl ${
        featured ? "p-7 sm:p-8" : "p-6"
      }`}
    >
      {project.imageUrl ? (
        // External admin-uploaded URLs are not yet allowlisted for next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          className="mb-6 aspect-video w-full rounded-xl object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col">
        {featured ? (
          <p className="font-mono text-[0.65rem] tracking-[0.18em] text-accent uppercase">
            Featured
          </p>
        ) : null}
        <h3
          className={`font-display font-semibold tracking-tight text-fg ${
            featured ? "mt-2 text-2xl" : "text-lg"
          }`}
        >
          {project.title}
        </h3>
        {project.subtitle ? (
          <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
        ) : null}
        <ul className="mt-4 space-y-2 text-sm leading-7 text-fg/85">
          {project.description.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.7rem] text-fg/85"
            >
              {tech}
            </li>
          ))}
        </ul>
        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                Live site
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                Repository
              </a>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}

export function Projects({
  projects,
  updatedAt,
}: {
  projects: Project[];
  updatedAt?: Date | null;
}) {
  if (projects.length === 0) {
    return null;
  }

  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <section
      id="projects"
      data-pipeline-node="Build"
      className="scroll-mt-24 border-b border-border py-[var(--section-y)]"
    >
      <Container>
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Selected work"
            title="Projects"
            updatedAt={updatedAt}
          />
          {featured.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          ) : null}
          {rest.length > 0 ? (
            <div
              className={`grid gap-6 sm:grid-cols-2 ${featured.length > 0 ? "mt-6" : ""}`}
            >
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
