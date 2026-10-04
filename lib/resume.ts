const DEFAULT_RESUME_KEYS = ["portfolio/Vivek Sarvaiya.pdf"];

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function s3KeyFromPublicUrl(url: string) {
  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
}

export function resumeObjectKeys(resumeUrl?: string | null) {
  const fromProfile = resumeUrl?.trim()
    ? s3KeyFromPublicUrl(resumeUrl.trim())
    : null;

  return unique([fromProfile ?? "", ...DEFAULT_RESUME_KEYS]);
}

export function publicResumeUrl(resumeUrl?: string | null) {
  const stored = resumeUrl?.trim();
  if (stored) {
    return stored;
  }

  const base = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
  if (!base) {
    return null;
  }

  const key = DEFAULT_RESUME_KEYS[0]
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${base}/${key}`;
}
