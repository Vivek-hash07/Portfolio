export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatusBanner({
  state,
}: {
  state: { type: "success" | "error"; message: string } | null;
}) {
  if (!state) {
    return null;
  }

  return (
    <p
      role="status"
      className={`rounded-xl border px-3.5 py-2.5 text-sm ${
        state.type === "success"
          ? "border-accent/40 bg-accent/10 text-fg"
          : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
      }`}
    >
      {state.message}
    </p>
  );
}

export const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none ring-accent/40 transition focus:border-accent focus:ring-2 disabled:opacity-60";

export const checkboxClassName =
  "h-4 w-4 rounded border-border accent-[var(--accent)]";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs leading-5 text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
