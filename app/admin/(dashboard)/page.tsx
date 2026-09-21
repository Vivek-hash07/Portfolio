export default function AdminDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-12 sm:px-6">
      <p className="font-mono text-[0.7rem] tracking-[0.22em] text-accent uppercase">
        Authenticated
      </p>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg">
        Admin dashboard
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        You are signed in. Content CRUD for profile, skills, experience,
        projects, certifications, education, and blog arrives in Phase 6.
      </p>
    </main>
  );
}
