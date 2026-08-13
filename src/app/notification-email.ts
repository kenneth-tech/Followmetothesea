import type { ContactInquiryDraft } from "./contact-storage.ts";
import type { PaidOrderNotificationDetails } from "./order-storage.ts";

type NotificationEnv = Record<string, string | undefined>;

export type NotificationEmailConfig = {
  apiKey: string;
  from: string;
  to: string;
};

export type AdminNotificationMessage = {
  html?: string;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailLayout({
  accentLabel,
  children,
  eyebrow,
  title,
}: {
  accentLabel: string;
  children: string;
  eyebrow: string;
  title: string;
}): string {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f7f8f5;color:#08172c;font-family:Arial,Helvetica,sans-serif;">
    <div style="padding:32px 16px;background:#f7f8f5;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;border-collapse:collapse;">
        <tr>
          <td style="background:#08172c;border-radius:8px 8px 0 0;padding:28px 30px;">
            <div style="color:#7fffd4;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">Follow Me To The Sea</div>
            <h1 style="color:#ffffff;font-size:28px;line-height:1.2;margin:14px 0 0;">${escapeHtml(title)}</h1>
          </td>
        </tr>
        <tr>
          <td style="height:5px;background:#7fffd4;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td style="background:#ffffff;border:1px solid #e8f0ef;border-top:0;border-radius:0 0 8px 8px;padding:30px;">
            <div style="display:inline-block;background:#e8f0ef;border-radius:999px;color:#08172c;font-size:12px;font-weight:800;letter-spacing:.08em;margin-bottom:22px;padding:8px 12px;text-transform:uppercase;">${escapeHtml(accentLabel)}</div>
            <p style="color:#60707a;font-size:14px;line-height:1.6;margin:0 0 24px;">${escapeHtml(eyebrow)}</p>
            ${children}
            <div style="border-top:1px solid #e8f0ef;color:#7a8a91;font-size:12px;line-height:1.6;margin-top:30px;padding-top:18px;">
              Admin notification from Follow Me To The Sea.
            </div>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}

function buildDetailRow(label: string, value: string): string {
  return `<tr>
    <td style="color:#60707a;font-size:13px;font-weight:700;padding:9px 0;vertical-align:top;width:170px;">${escapeHtml(label)}</td>
    <td style="color:#08172c;font-size:15px;font-weight:700;line-height:1.5;padding:9px 0;vertical-align:top;">${value}</td>
  </tr>`;
}

function buildSection(title: string, children: string): string {
  return `<div style="margin-top:22px;">
    <h2 style="color:#08172c;font-size:16px;line-height:1.3;margin:0 0 10px;">${escapeHtml(title)}</h2>
    ${children}
  </div>`;
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

export function buildContactNotificationHtml(
  draft: ContactInquiryDraft,
  submittedAt = new Date(),
): string {
  const email = draft.email.trim();
  const message = escapeHtml(draft.message.trim()).replace(/\n/g, "<br>");
  const contactRows = [
    buildDetailRow("Name", escapeHtml(draft.name.trim())),
    buildDetailRow(
      "Email",
      `<a href="mailto:${encodeURIComponent(email)}" style="color:#08172c;text-decoration:underline;">${escapeHtml(email)}</a>`,
    ),
    buildDetailRow("Country", escapeHtml(draft.country.trim())),
    buildDetailRow("Phone", escapeHtml(draft.phone.trim())),
    buildDetailRow("Submitted", escapeHtml(formatSubmittedAt(submittedAt))),
  ].join("");

  return buildEmailLayout({
    accentLabel: "New Inquiry",
    children: [
      buildSection(
        "Contact Details",
        `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${contactRows}</table>`,
      ),
      buildSection(
        "Message",
        `<div style="background:#f7f8f5;border:1px solid #e8f0ef;border-radius:8px;color:#08172c;font-size:15px;line-height:1.65;padding:18px;">${message}</div>`,
      ),
    ].join(""),
    eyebrow: "A visitor submitted the website contact form.",
    title: "New Contact Inquiry",
  });
}

export function buildPaidOrderNotificationHtml(
  order: PaidOrderNotificationDetails,
  paidAt = new Date(),
): string {
  const socialLink = order.social_link;
  const orderRows = [
    buildDetailRow("Customer name", escapeHtml(order.customer_name)),
    buildDetailRow(
      "Social link",
      `<a href="${escapeHtml(socialLink)}" style="color:#08172c;text-decoration:underline;">${escapeHtml(socialLink)}</a>`,
    ),
    buildDetailRow("Packages", escapeHtml(order.packages.join(", "))),
    buildDetailRow(
      "Total",
      `<span style="background:#7fffd4;border-radius:6px;color:#08172c;display:inline-block;font-size:18px;font-weight:900;padding:8px 10px;">${escapeHtml(formatAmount(order.total_cents, order.currency))}</span>`,
    ),
    buildDetailRow("Paid at", escapeHtml(formatSubmittedAt(paidAt))),
  ].join("");
  const stripeRows = [
    buildDetailRow(
      "Checkout session",
      `<span style="font-family:Consolas,Monaco,monospace;font-size:13px;">${escapeHtml(order.stripe_checkout_session_id)}</span>`,
    ),
    buildDetailRow(
      "Payment intent",
      `<span style="font-family:Consolas,Monaco,monospace;font-size:13px;">${escapeHtml(order.stripe_payment_intent_id ?? "Not provided")}</span>`,
    ),
  ].join("");

  return buildEmailLayout({
    accentLabel: "Payment Confirmed",
    children: [
      buildSection(
        "Order Details",
        `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${orderRows}</table>`,
      ),
      buildSection(
        "Stripe Details",
        `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${stripeRows}</table>`,
      ),
    ].join(""),
    eyebrow: "Stripe confirmed that this package checkout was paid successfully.",
    title: "Paid Package Checkout",
  });
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
        html: message.html,
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
    html: buildContactNotificationHtml(draft),
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
    html: buildPaidOrderNotificationHtml(order),
    idempotencyKey,
    subject: "Paid package checkout - Follow Me To The Sea",
    text: buildPaidOrderNotificationText(order),
  });
}
