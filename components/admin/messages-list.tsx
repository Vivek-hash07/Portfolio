"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Message } from "@/app/generated/prisma/client";
import {
  deleteMessage,
  markMessageRead,
  markMessageUnread,
} from "@/app/admin/(dashboard)/messages/actions";
import type { BannerState } from "@/components/admin/apply-result";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { StatusBanner } from "@/components/admin/form";
import { formatTimestamp } from "@/lib/format";

export function MessagesList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [banner, setBanner] = useState<BannerState>(null);

  if (messages.length === 0) {
    return (
      <p className="mt-8 text-sm text-muted">
        No messages yet. The public contact form writes here.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <StatusBanner state={banner} />
      {messages.map((message) => {
        const unread = !message.readAt;
        const mailto = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(
          message.subject ? `Re: ${message.subject}` : "Re: your message",
        )}`;

        return (
          <article
            key={message.id}
            className={`rounded-2xl border bg-surface/80 p-4 sm:p-5 ${
              unread ? "border-accent/50" : "border-border"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-fg">
                {message.name}
              </h2>
              {unread ? (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[0.65rem] tracking-wide text-accent uppercase">
                  Unread
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted">{message.email}</p>
            {message.subject ? (
              <p className="mt-2 text-sm font-medium text-fg">{message.subject}</p>
            ) : null}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-fg/85">
              {message.body}
            </p>
            <p className="mt-3 font-mono text-xs text-muted">
              {formatTimestamp(message.createdAt)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={mailto} className="btn btn-ghost px-3 py-2 text-sm">
                Reply
              </a>
              <button
                type="button"
                className="btn btn-ghost px-3 py-2 text-sm"
                onClick={async () => {
                  const result = unread
                    ? await markMessageRead(message.id)
                    : await markMessageUnread(message.id);
                  setBanner(
                    result.ok
                      ? {
                          type: "success",
                          message: unread ? "Marked as read" : "Marked as unread",
                        }
                      : { type: "error", message: result.error },
                  );
                  router.refresh();
                }}
              >
                {unread ? "Mark read" : "Mark unread"}
              </button>
              <ConfirmDelete
                title={`Delete message from ${message.name}?`}
                description="This removes the message from the inbox permanently."
                onConfirm={async () => {
                  const result = await deleteMessage(message.id);
                  setBanner(
                    result.ok
                      ? { type: "success", message: "Message deleted" }
                      : { type: "error", message: result.error },
                  );
                  router.refresh();
                }}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
