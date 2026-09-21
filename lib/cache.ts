import { unstable_cache } from "next/cache";
import { cache } from "react";

/** Single tag covering every public page. Admin saves expire it immediately. */
export const PUBLIC_CACHE_TAG = "portfolio-public";

/** Time-based ISR fallback (seconds). Must stay a literal `60` in route files. */
export const PUBLIC_REVALIDATE_SECONDS = 60;

export function cachedPublicQuery<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  key: string,
) {
  return cache(
    unstable_cache(fn, [key], {
      tags: [PUBLIC_CACHE_TAG],
      revalidate: PUBLIC_REVALIDATE_SECONDS,
    }),
  );
}
