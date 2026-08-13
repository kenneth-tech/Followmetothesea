import assert from "node:assert/strict";
import test from "node:test";

import {
  buildContactNotificationText,
  buildPaidOrderNotificationText,
  getNotificationEmailConfig,
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
  assert.match(text, /Social link: https:\/\/instagram\.com\/example/);
  assert.match(text, /Packages: 1K Followers, 2K Likes/);
  assert.match(text, /Total: \$248\.00 USD/);
  assert.match(text, /Stripe checkout session: cs_test_123/);
  assert.match(text, /Stripe payment intent: pi_test_123/);
  assert.match(text, /Paid at: 2026-08-13T05:00:00\.000Z/);
});
