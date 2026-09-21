import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/public/theme-toggle";
import { getAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function safeAdminPath(value: string | string[] | undefined) {
  const from = Array.isArray(value) ? value[0] : value;

  if (!from || !from.startsWith("/admin") || from.startsWith("//") || from.includes("://")) {
    return "/admin";
  }

  if (from.startsWith("/admin/login")) {
    return "/admin";
  }

  return from;
}

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const from = safeAdminPath(params.from);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <p className="font-mono text-[0.7rem] tracking-[0.22em] text-accent uppercase">
        Private console
      </p>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg">
        Admin login
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Sign in with the seeded admin account. There is no public registration.
      </p>
      <LoginForm from={from} />
    </main>
  );
}
