import assert from "node:assert/strict";
import test from "node:test";

import {
  buildOrderRecord,
  getSupabaseConfig,
} from "./order-storage.ts";

const draft = {
  name: "  Kenneth  ",
  socialLink: "  https://instagram.com/followmetothesea  ",
  packages: ["1K Followers", "5K Views"],
};

test("buildOrderRecord formats a checkout order for Supabase", () => {
  assert.deepEqual(buildOrderRecord(draft, "cs_test_123"), {
    customer_name: "Kenneth",
    social_link: "https://instagram.com/followmetothesea",
    packages: ["1K Followers", "5K Views"],
    package_count: 2,
    total_cents: 25800,
    currency: "usd",
    status: "checkout_started",
    stripe_checkout_session_id: "cs_test_123",
  });
});

test("getSupabaseConfig returns null when Supabase is not configured", () => {
  assert.equal(getSupabaseConfig({}), null);
  assert.equal(
    getSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    }),
    null,
  );
  assert.equal(
    getSupabaseConfig({
      SUPABASE_SECRET_KEY: "sb_secret_test",
    }),
    null,
  );
});

test("getSupabaseConfig supports secret and legacy service role keys", () => {
  assert.deepEqual(
    getSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SECRET_KEY: "sb_secret_test",
    }),
    {
      key: "sb_secret_test",
      url: "https://example.supabase.co",
    },
  );

  assert.deepEqual(
    getSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
    }),
    {
      key: "service-role-test",
      url: "https://example.supabase.co",
    },
  );
});
