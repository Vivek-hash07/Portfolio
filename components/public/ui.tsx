export const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#education", label: "Education" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
] as const;

export function SectionHeading({
  eyebrow,
  title,
  index,
}: {
  eyebrow: string;
  title: string;
  index: string;
}) {
  return (
    <div className="mb-10">
      <p className="font-mono text-[0.7rem] tracking-[0.22em] text-accent uppercase">
        {index} / {eyebrow}
      </p>
      <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
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
