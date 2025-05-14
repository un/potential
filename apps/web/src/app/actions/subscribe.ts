"use server";

import { Resend } from "resend";

import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function subscribe(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: env.RESEND_AUDIENCE_ID,
    });

    return { success: true };
  } catch (error) {
    console.error("Error subscribing:", error);
    return { error: "Failed to subscribe" };
  }
}
