"use client";

import { useRef, useState } from "react";
import { inputClassName } from "@/components/admin/form";

type UploadKind = "image" | "pdf" | "any";

export function FileUpload({
  label,
  value,
  onChange,
  kind,
  hint,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  kind: UploadKind;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept =
    kind === "pdf" ? "application/pdf" : kind === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "image/*,application/pdf";

  async function upload(file: File) {
    setError(null);
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed.");
      }

      onChange(data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-fg">{label}</p>
      <div
        className={`rounded-2xl border border-dashed px-4 py-6 text-center transition ${
          dragging
            ? "border-accent bg-accent/10"
            : "border-border bg-surface/70"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) {
            void upload(file);
          }
        }}
      >
        <p className="text-sm text-muted">
          {uploading ? "Uploading…" : "Drop a file here, or browse"}
        </p>
        <button
          type="button"
          className="btn btn-ghost mt-3 px-3 py-2 text-sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void upload(file);
            }
            event.target.value = "";
          }}
        />
      </div>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {value ? (
        <div className="space-y-2">
          {kind !== "pdf" && (value.startsWith("/") || value.startsWith("http")) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-40 rounded-xl border border-border object-cover" />
          ) : null}
          <input
            value={value}
            readOnly
            className={inputClassName}
            aria-label={`${label} URL`}
          />
          <button
            type="button"
            className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
            onClick={() => onChange(null)}
          >
            Remove file
          </button>
        </div>
      ) : null}
    </div>
  );
}
