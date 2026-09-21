"use server";

import { headers } from "next/headers";
import { sendContactEmail } from "@/lib/email";
import {
  isContactRateLimited,
  recordContactAttempt,
} from "@/lib/login-rate-limit";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export type ContactState = {
  ok: boolean;
  error: string | null;
};

const SUCCESS: ContactState = { ok: true, error: null };

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) {
    return SUCCESS;
  }

  const requestHeaders = await headers();
  if (await isContactRateLimited(requestHeaders)) {
    return {
      ok: false,
      error: "Too many messages. Please try again in a few minutes.",
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  await recordContactAttempt(requestHeaders);

  const profile = await prisma.profile.findFirst();
  if (!profile) {
    return { ok: false, error: "Unable to send right now. Email me directly." };
  }

  let message;
  try {
    message = await prisma.message.create({
      data: parsed.data,
    });
  } catch (error) {
    console.error("Contact save failed:", error);
    return { ok: false, error: "Unable to send right now. Email me directly." };
  }

  try {
    await sendContactEmail({
      profile,
      name: message.name,
      email: message.email,
      subject: message.subject,
      body: message.body,
    });
  } catch (error) {
    console.error("Contact email failed:", error);
  }

  return SUCCESS;
}
