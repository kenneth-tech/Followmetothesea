import { createClient } from "@supabase/supabase-js";

import {
  getOrderTotalCents,
  type CheckoutOrderDraft,
} from "./order-checkout.ts";

export const SUPABASE_ORDERS_TABLE = "orders";

export type SupabaseConfig = {
  key: string;
  url: string;
};

export type SupabaseOrderRecord = {
  customer_name: string;
  social_link: string;
  packages: string[];
  package_count: number;
  total_cents: number;
  currency: "usd";
  status: "checkout_started";
  stripe_checkout_session_id: string;
};

type SupabaseEnv = Record<string, string | undefined>;

export function getSupabaseConfig(
  env: SupabaseEnv = process.env,
): SupabaseConfig | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return { key, url };
}

export function buildOrderRecord(
  draft: CheckoutOrderDraft,
  stripeCheckoutSessionId: string,
): SupabaseOrderRecord {
  return {
    customer_name: draft.name.trim(),
    social_link: draft.socialLink.trim(),
    packages: draft.packages,
    package_count: draft.packages.length,
    total_cents: getOrderTotalCents(draft.packages),
    currency: "usd",
    status: "checkout_started",
    stripe_checkout_session_id: stripeCheckoutSessionId,
  };
}

export async function recordCheckoutSession(
  draft: CheckoutOrderDraft,
  stripeCheckoutSessionId: string,
): Promise<void> {
  const config = getSupabaseConfig();

  if (!config) {
    return;
  }

  const supabase = createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase
    .from(SUPABASE_ORDERS_TABLE)
    .insert(buildOrderRecord(draft, stripeCheckoutSessionId));

  if (error) {
    throw error;
  }
}
