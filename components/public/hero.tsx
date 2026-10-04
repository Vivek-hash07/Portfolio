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
        <div className="relative grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:gap-16">
          <div className="hero-entrance relative max-w-2xl">
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
              <a href="/resume.pdf" download className="btn btn-ghost">
                Download Resume
              </a>
            </div>
          </div>
          {profile.avatarUrl ? (
            <div className="hero-portrait relative mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="aspect-square w-full rounded-[1.75rem] border border-border object-cover object-top shadow-[0_28px_60px_-28px_var(--glow)]"
              />
            </div>
          ) : null}
        </div>
        <div className="hero-rule" aria-hidden="true" />
      </Container>
    </section>
  );
}
