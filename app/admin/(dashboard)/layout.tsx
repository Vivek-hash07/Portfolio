import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/public/theme-toggle";
import { getAdminUnreadMessageCount } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-session";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  const unreadMessages = await getAdminUnreadMessageCount();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-bg">
      <header className="border-b border-border/80 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="font-display text-sm font-semibold tracking-tight text-fg"
            >
              Admin
            </Link>
            <Link
              href="/"
              className="hidden text-sm text-muted hover:text-accent sm:inline"
            >
              View site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden font-mono text-xs text-muted sm:block">
              {session.user.email}
            </p>
            <ThemeToggle />
            <form action={logoutAction}>
              <button type="submit" className="btn btn-ghost px-3 py-2 text-sm">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <AdminNav unreadMessages={unreadMessages} />
      {children}
    </div>
  );
}
