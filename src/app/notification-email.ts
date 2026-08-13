import type { ContactInquiryDraft } from "./contact-storage.ts";
import type { PaidOrderNotificationDetails } from "./order-storage.ts";

type NotificationEnv = Record<string, string | undefined>;

export type NotificationEmailConfig = {
  apiKey: string;
  from: string;
  to: string;
};

export type AdminNotificationMessage = {
  idempotencyKey?: string;
  replyTo?: string;
  subject: string;
  text: string;
};

export type AdminNotificationResult =
  | { id?: string; sent: true }
  | { error?: string; reason: "failed" | "not_configured"; sent: false };

type FetchLike = typeof fetch;

export function getNotificationEmailConfig(
  env: NotificationEnv = process.env,
): NotificationEmailConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.NOTIFICATION_FROM?.trim();
  const to = env.ADMIN_NOTIFICATION_EMAIL?.trim();

  if (!apiKey || !from || !to) {
    return null;
  }

  return { apiKey, from, to };
}

function formatSubmittedAt(date: Date): string {
  return date.toISOString();
}

function formatAmount(totalCents: number, currency: string): string {
  const currencyCode = currency.toUpperCase();
  const amount = new Intl.NumberFormat("en-US", {
    currency: currencyCode,
    style: "currency",
  }).format(totalCents / 100);

  return `${amount} ${currencyCode}`;
}

export function buildContactNotificationText(
  draft: ContactInquiryDraft,
  submittedAt = new Date(),
): string {
  return [
    "New contact form inquiry",
    "",
    `Name: ${draft.name.trim()}`,
    `Email: ${draft.email.trim()}`,
    `Country: ${draft.country.trim()}`,
    `Phone: ${draft.phone.trim()}`,
    "",
    "Message:",
    draft.message.trim(),
    "",
    `Submitted: ${formatSubmittedAt(submittedAt)}`,
  ].join("\n");
}

export function buildPaidOrderNotificationText(
  order: PaidOrderNotificationDetails,
  paidAt = new Date(),
): string {
  return [
    "Paid package checkout",
    "",
    `Customer name: ${order.customer_name}`,
    `Social link: ${order.social_link}`,
    `Packages: ${order.packages.join(", ")}`,
    `Total: ${formatAmount(order.total_cents, order.currency)}`,
    "",
    `Stripe checkout session: ${order.stripe_checkout_session_id}`,
    `Stripe payment intent: ${order.stripe_payment_intent_id ?? "Not provided"}`,
    "",
    `Paid at: ${formatSubmittedAt(paidAt)}`,
  ].join("\n");
}

export async function sendAdminNotification(
  message: AdminNotificationMessage,
  env: NotificationEnv = process.env,
  fetcher: FetchLike = fetch,
): Promise<AdminNotificationResult> {
  const config = getNotificationEmailConfig(env);

  if (!config) {
    return { reason: "not_configured", sent: false };
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    };

    if (message.idempotencyKey) {
      headers["Idempotency-Key"] = message.idempotencyKey;
    }

    const response = await fetcher("https://api.resend.com/emails", {
      body: JSON.stringify({
        from: config.from,
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        to: [config.to],
      }),
      headers,
      method: "POST",
    });

    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };

    if (!response.ok) {
      return {
        error: payload.message || response.statusText,
        reason: "failed",
        sent: false,
      };
    }

    return { id: payload.id, sent: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown email error",
      reason: "failed",
      sent: false,
    };
  }
}

export function sendContactInquiryNotification(
  draft: ContactInquiryDraft,
): Promise<AdminNotificationResult> {
  return sendAdminNotification({
    replyTo: draft.email.trim(),
    subject: "New contact inquiry - Follow Me To The Sea",
    text: buildContactNotificationText(draft),
  });
}

export function sendPaidOrderNotification(
  order: PaidOrderNotificationDetails,
  idempotencyKey?: string,
): Promise<AdminNotificationResult> {
  return sendAdminNotification({
    idempotencyKey,
    subject: "Paid package checkout - Follow Me To The Sea",
    text: buildPaidOrderNotificationText(order),
  });
}
