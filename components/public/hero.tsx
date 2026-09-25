import type { Profile } from "@/app/generated/prisma/client";
import { Container } from "@/components/public/ui";
import { formatLongDate } from "@/lib/format";

export function Hero({ profile }: { profile: Profile }) {
  const firstSentence = profile.summary.split(/(?<=\.)\s/)[0] ?? profile.summary;

  return (
    <section
      id="top"
      data-pipeline-node="Start"
      className="scroll-mt-24 border-b border-border py-[var(--section-y)]"
    >
      <Container className="relative">
        <div className="hero-orb hero-orb-a" aria-hidden="true" />
        <div className="hero-orb hero-orb-b" aria-hidden="true" />
        <div className="hero-entrance relative max-w-3xl">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={`${profile.name}`}
              className="mb-5 h-20 w-20 rounded-2xl border border-border object-cover"
            />
          ) : null}
          <p className="font-mono text-[0.7rem] tracking-[0.22em] text-accent uppercase">
            <span className="live-dot" aria-hidden="true" /> Live pipeline · {profile.location}
          </p>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-muted sm:text-base">
            {profile.title}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-fg/80 sm:text-lg">
            {firstSentence}
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            Updated {formatLongDate(profile.updatedAt)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn btn-ghost">
              Contact
            </a>
            <a href="/resume.pdf" className="btn btn-ghost">
              Download Résumé
            </a>
          </div>
        </div>
        <div className="hero-rule" aria-hidden="true" />
      </Container>
    </section>
  );
}
