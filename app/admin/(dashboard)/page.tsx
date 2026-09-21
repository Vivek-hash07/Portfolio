import Link from "next/link";
import { PageHeader } from "@/components/admin/form";
import { getAdminOverview } from "@/lib/admin-data";
import { formatTimestamp } from "@/lib/format";

export default async function AdminDashboardPage() {
  const sections = await getAdminOverview();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Overview"
        description="Edit every section of the live site. Changes revalidate the public pages as soon as you save."
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="block h-full rounded-2xl border border-border bg-surface/80 p-5 transition hover:border-accent/50 hover:shadow-[0_18px_40px_-24px_var(--glow)]"
            >
              <p className="font-display text-lg font-semibold text-fg">{section.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{section.description}</p>
              <p className="mt-4 font-mono text-xs text-accent">
                {section.count} {section.count === 1 ? "item" : "items"}
                {"meta" in section && section.meta ? ` · ${section.meta}` : ""}
              </p>
              <p className="mt-1 text-xs text-muted">
                {section.updatedAt
                  ? `Updated ${formatTimestamp(section.updatedAt)}`
                  : "Not updated yet"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
