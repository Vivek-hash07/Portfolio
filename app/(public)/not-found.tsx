import Link from "next/link";

export default function PublicNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-24">
      <p className="font-mono text-[0.7rem] tracking-[0.22em] text-accent uppercase">
        404
      </p>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        That page is unpublished or does not exist.
      </p>
      <Link href="/" className="btn btn-primary mt-8 w-fit">
        Back to home
      </Link>
    </main>
  );
}
