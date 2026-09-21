import { Resend } from "resend";
import type { Profile } from "@/app/generated/prisma/client";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

export async function sendContactEmail({
  profile,
  name,
  email,
  subject,
  body,
}: {
  profile: Profile;
  name: string;
  email: string;
  subject: string | null;
  body: string;
}) {
  const resend = getResend();
  if (!resend) {
    return { sent: false as const };
  }

  const from =
    process.env.RESEND_FROM?.trim() || "Portfolio <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL?.trim() || profile.email;
  const topic = subject?.trim() || "New portfolio message";

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `${topic} — ${name}`,
    text: [
      `From: ${name} <${email}>`,
      subject ? `Subject: ${subject}` : null,
      "",
      body,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    console.error("Contact email failed:", error);
    return { sent: false as const };
  }

  return { sent: true as const };
}
