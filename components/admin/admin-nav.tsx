"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/blog", label: "Blog" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin sections"
      className="overflow-x-auto border-b border-border/80"
    >
      <ul className="mx-auto flex w-full max-w-6xl gap-1 px-5 py-2 sm:px-6">
        {LINKS.map((link) => {
          const active = isActive(pathname, link.href, "exact" in link && link.exact);

          return (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className={`block rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-accent text-accent-fg"
                    : "text-muted hover:bg-surface-2 hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
