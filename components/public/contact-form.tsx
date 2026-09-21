"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/(public)/actions";
import { inputClassName } from "@/components/admin/form";

const initialState: ContactState = { ok: false, error: null };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.ok) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-accent/40 bg-accent/10 px-4 py-4 text-sm leading-6 text-fg"
      >
        Message received. I will get back to you soon.
      </p>
    );
  }

  return (
    <form action={formAction} className="relative space-y-4">
      <div className="absolute -left-[10000px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-medium text-fg">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-fg">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClassName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-subject" className="text-sm font-medium text-fg">
          Subject <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-body" className="text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id="contact-body"
          name="body"
          required
          minLength={10}
          rows={5}
          className={inputClassName}
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
