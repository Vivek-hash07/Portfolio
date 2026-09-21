"use client";

import { useLayoutEffect } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  root.dataset.theme = theme;
}

function readTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  useLayoutEffect(() => {
    applyTheme(readTheme());
  }, []);

  function toggle() {
    const next: Theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 text-fg"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={toggle}
    >
      <svg
        viewBox="0 0 24 24"
        className="hidden h-4 w-4 dark:block"
        aria-hidden="true"
      >
        <path
          d="M12 4V2M12 22v-2M4.93 4.93 3.5 3.5M20.5 20.5l-1.43-1.43M4 12H2M22 12h-2M4.93 19.07 3.5 20.5M20.5 3.5l-1.43 1.43"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3.4" fill="currentColor" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="block h-4 w-4 dark:hidden"
        aria-hidden="true"
      >
        <path
          d="M16.5 13.2A6.2 6.2 0 0 1 10.8 7.5 6.4 6.4 0 1 0 16.5 13.2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
