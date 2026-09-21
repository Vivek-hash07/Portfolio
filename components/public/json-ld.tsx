import type { Profile } from "@/app/generated/prisma/client";
import { getSiteUrl } from "@/lib/site";

export function PersonJsonLd({ profile }: { profile: Profile }) {
  const siteUrl = getSiteUrl();
  const sameAs = [profile.linkedinUrl, profile.githubUrl, profile.websiteUrl].filter(
    (value): value is string => Boolean(value),
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: profile.email,
    telephone: profile.phone ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
    url: siteUrl,
    image: profile.avatarUrl ?? undefined,
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
