import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
      <main className="w-full max-w-xl space-y-6">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Phase 1 scaffolding
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Vivek Sarvaiya
        </h1>
        <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400">
          Portfolio app is wired: App Router, Prisma, and a Postgres database.
          Public pages, admin, and content models land in later phases.
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <Link
            href="/admin"
            className="rounded-full bg-zinc-950 px-4 py-2 text-white dark:bg-zinc-50 dark:text-zinc-950"
          >
            Admin
          </Link>
          <Link
            href="/api/health"
            className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
          >
            API health
          </Link>
        </div>
      </main>
    </div>
  );
}
