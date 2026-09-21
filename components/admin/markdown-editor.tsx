"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-2xl border border-border bg-surface-2/60" />
  ),
});

export function MarkdownEditor({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      setMode(root.classList.contains("dark") ? "dark" : "light");
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-fg">Content</p>
      <div data-color-mode={mode} className="overflow-hidden rounded-2xl border border-border">
        <MDEditor
          value={value}
          height={420}
          preview="live"
          visibleDragbar={false}
          textareaProps={{ placeholder: "Write markdown…" }}
          onChange={(next) => onChange(next ?? "")}
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
