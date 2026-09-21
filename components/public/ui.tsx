import { formatLongDate } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  index,
  updatedAt,
}: {
  eyebrow: string;
  title: string;
  index: string;
  updatedAt?: Date | null;
}) {
  return (
    <div className="mb-10">
      <p className="font-mono text-[0.7rem] tracking-[0.22em] text-accent uppercase">
        {index} / {eyebrow}
      </p>
      <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
      {updatedAt ? (
        <p className="mt-2 font-mono text-xs text-muted">
          Updated {formatLongDate(updatedAt)}
        </p>
      ) : null}
    </div>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 sm:px-6 ${className}`.trim()}>
      {children}
    </div>
  );
}
