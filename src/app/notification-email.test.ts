import assert from "node:assert/strict";
import test from "node:test";

import {
  buildContactNotificationHtml,
  buildContactNotificationText,
  buildPaidOrderNotificationHtml,
  buildPaidOrderNotificationText,
  getNotificationEmailConfig,
  sendAdminNotification,
} from "./notification-email.ts";

test("getNotificationEmailConfig reads Resend admin notification env vars", () => {
  assert.deepEqual(
    getNotificationEmailConfig({
      ADMIN_NOTIFICATION_EMAIL: "admin@example.com",
      NOTIFICATION_FROM: "Follow Me To The Sea <notify@example.com>",
      RESEND_API_KEY: "re_test_123",
    }),
    {
      apiKey: "re_test_123",
      from: "Follow Me To The Sea <notify@example.com>",
      to: "admin@example.com",
    },
  );
});

test("getNotificationEmailConfig returns null when any required env var is missing", () => {
  assert.equal(
    getNotificationEmailConfig({
      ADMIN_NOTIFICATION_EMAIL: "admin@example.com",
      RESEND_API_KEY: "re_test_123",
    }),
    null,
  );
});

test("buildContactNotificationText includes contact form details", () => {
  const text = buildContactNotificationText(
    {
      country: "PH",
      email: "kenneth@example.com",
      message: "I need help choosing a package.",
      name: "Kenneth",
      phone: "0917 123 4567",
    },
    new Date("2026-08-13T04:00:00.000Z"),
  );

  assert.match(text, /New contact form inquiry/);
  assert.match(text, /Name: Kenneth/);
  assert.match(text, /Email: kenneth@example\.com/);
  assert.match(text, /Country: PH/);
  assert.match(text, /Phone: 0917 123 4567/);
  assert.match(text, /Message:\nI need help choosing a package\./);
  assert.match(text, /Submitted: 2026-08-13T04:00:00\.000Z/);
});

test("buildPaidOrderNotificationText includes paid checkout details", () => {
  const text = buildPaidOrderNotificationText(
    {
      currency: "usd",
      customer_email: "kenneth@example.com",
      customer_name: "Kenneth",
      packages: ["1K Followers", "2K Likes"],
      social_link: "https://instagram.com/example",
      stripe_checkout_session_id: "cs_test_123",
      stripe_payment_intent_id: "pi_test_123",
      total_cents: 24800,
    },
    new Date("2026-08-13T05:00:00.000Z"),
  );

  assert.match(text, /Paid package checkout/);
  assert.match(text, /Customer name: Kenneth/);
  assert.match(text, /Customer email: kenneth@example\.com/);
  assert.match(text, /Social link: https:\/\/instagram\.com\/example/);
  assert.match(text, /Packages: 1K Followers, 2K Likes/);
  assert.match(text, /Total: \$248\.00 USD/);
  assert.match(text, /Stripe checkout session: cs_test_123/);
  assert.match(text, /Stripe payment intent: pi_test_123/);
  assert.match(text, /Paid at: 2026-08-13T05:00:00\.000Z/);
});

test("buildContactNotificationHtml renders a branded contact email", () => {
  const html = buildContactNotificationHtml(
    {
      country: "PH",
      email: "kenneth@example.com",
      message: "I need <help> choosing a package.",
      name: "Kenneth & Team",
      phone: "0917 123 4567",
    },
    new Date("2026-08-13T04:00:00.000Z"),
  );

  assert.match(html, /Follow Me To The Sea/);
  assert.match(html, /#08172c/);
  assert.match(html, /#7fffd4/);
  assert.match(html, /New Contact Inquiry/);
  assert.match(html, /Kenneth &amp; Team/);
  assert.match(html, /mailto:kenneth%40example\.com/);
  assert.match(html, /I need &lt;help&gt; choosing a package\./);
});

test("buildPaidOrderNotificationHtml renders a branded paid order email", () => {
  const html = buildPaidOrderNotificationHtml(
    {
      currency: "usd",
      customer_email: "kenneth@example.com",
      customer_name: "Kenneth",
      packages: ["1K Followers", "2K Likes"],
      social_link: "https://instagram.com/example",
      stripe_checkout_session_id: "cs_test_123",
      stripe_payment_intent_id: "pi_test_123",
      total_cents: 24800,
    },
    new Date("2026-08-13T05:00:00.000Z"),
  );

  assert.match(html, /Paid Package Checkout/);
  assert.match(html, /Payment Confirmed/);
  assert.match(html, /mailto:kenneth%40example\.com/);
  assert.match(html, /href="https:\/\/instagram\.com\/example"/);
  assert.match(html, /\$248\.00 USD/);
  assert.match(html, /1K Followers/);
  assert.match(html, /2K Likes/);
});

test("sendAdminNotification includes html when provided", async () => {
  let body = "";
  const fetcher = async (_url: string | URL | Request, init?: RequestInit) => {
    body = String(init?.body || "");

    return new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
    });
  };

  await sendAdminNotification(
    {
      html: "<strong>Hello</strong>",
      subject: "Subject",
      text: "Hello",
    },
    {
      ADMIN_NOTIFICATION_EMAIL: "admin@example.com",
      NOTIFICATION_FROM: "Follow Me To The Sea <notify@example.com>",
      RESEND_API_KEY: "re_test_123",
    },
    fetcher,
  );

  assert.equal(JSON.parse(body).html, "<strong>Hello</strong>");
});
