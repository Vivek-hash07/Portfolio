"use client";

import { useRef, useTransition } from "react";

export function ConfirmDelete({
  label = "Delete",
  title,
  description = "This cannot be undone.",
  onConfirm,
}: {
  label?: string;
  title: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        className="btn btn-danger px-3 py-2 text-sm"
        onClick={() => dialogRef.current?.showModal()}
      >
        {label}
      </button>
      <dialog
        ref={dialogRef}
        className="w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/50"
      >
        <form
          method="dialog"
          className="space-y-4 p-5"
          onSubmit={(event) => {
            const submitter = (event.nativeEvent as SubmitEvent).submitter;
            if (!(submitter instanceof HTMLButtonElement) || submitter.value !== "confirm") {
              return;
            }

            event.preventDefault();
            startTransition(async () => {
              await onConfirm();
              dialogRef.current?.close();
            });
          }}
        >
          <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm leading-6 text-muted">{description}</p>
          <div className="flex justify-end gap-2">
            <button type="submit" value="cancel" className="btn btn-ghost px-3 py-2 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              value="confirm"
              className="btn btn-danger px-3 py-2 text-sm"
              disabled={pending}
            >
              {pending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
