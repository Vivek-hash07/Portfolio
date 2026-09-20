export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-24">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Protected later
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Admin dashboard
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
        This route is reserved for the CMS. Authentication and CRUD arrive in
        Phases 5 and 6.
      </p>
    </main>
  );
}
