import type { Profile } from "@/app/generated/prisma/client";
import { Container } from "@/components/public/ui";

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-muted underline-offset-4 hover:text-accent hover:underline"
    >
      {label}
    </a>
  );
}

export function SiteFooter({ profile }: { profile: Profile | null }) {
  return (
    <footer
      id="contact"
      data-pipeline-node="Contact"
      className="scroll-mt-24 border-t border-border py-16"
    >
      <Container>
        <p className="font-mono text-[0.7rem] tracking-[0.22em] text-accent uppercase">
          06 / Contact
        </p>
        {profile ? (
          <>
            <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Get in touch
            </h2>
            <div className="mt-6 flex flex-col gap-2 text-sm text-fg/85">
              <a href={`mailto:${profile.email}`} className="hover:text-accent">
                {profile.email}
              </a>
              {profile.phone ? (
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  className="hover:text-accent"
                >
                  {profile.phone}
                </a>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-sm">
              {profile.linkedinUrl ? (
                <SocialLink href={profile.linkedinUrl} label="LinkedIn" />
              ) : null}
              {profile.githubUrl ? (
                <SocialLink href={profile.githubUrl} label="GitHub" />
              ) : null}
              {profile.websiteUrl ? (
                <SocialLink href={profile.websiteUrl} label="Website" />
              ) : null}
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">Contact details coming soon.</p>
        )}
      </Container>
    </footer>
  );
}
