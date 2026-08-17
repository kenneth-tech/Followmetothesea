import type Stripe from "stripe";

export type CheckoutOrderDraft = {
  email: string;
  name: string;
  socialLink: string;
  packages: string[];
};

export type CheckoutOrderErrors = Partial<
  Record<keyof CheckoutOrderDraft, string>
>;

export const MAX_CHECKOUT_PACKAGES = 9;

export const ORDER_PACKAGE_PRICES: Record<string, number> = {
  "1K Followers": 9900,
  "2K Followers": 14900,
  "5K Followers": 29900,
  "1K Likes": 9900,
  "2K Likes": 14900,
  "5K Likes": 29900,
  "1K Views": 5900,
  "5K Views": 15900,
  "10K Views": 29900,
};

export function getOrderTotalCents(packages: string[]): number {
  return packages.reduce(
    (total, packageName) => total + (ORDER_PACKAGE_PRICES[packageName] ?? 0),
    0,
  );
}

export function buildCheckoutLineItems(
  packages: string[],
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return packages.map((packageName) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: packageName,
      },
      unit_amount: ORDER_PACKAGE_PRICES[packageName],
    },
    quantity: 1,
  }));
}

export function validateCheckoutOrder(draft: unknown): {
  valid: boolean;
  errors: CheckoutOrderErrors;
} {
  const errors: CheckoutOrderErrors = {};
  const checkoutDraft =
    draft && typeof draft === "object"
      ? (draft as Partial<CheckoutOrderDraft>)
      : {};
  const name =
    typeof checkoutDraft.name === "string" ? checkoutDraft.name : "";
  const email =
    typeof checkoutDraft.email === "string" ? checkoutDraft.email : "";
  const socialLink =
    typeof checkoutDraft.socialLink === "string"
      ? checkoutDraft.socialLink
      : "";
  const packages = Array.isArray(checkoutDraft.packages)
    ? checkoutDraft.packages
    : [];

  if (!name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!email.trim()) {
    errors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email.";
  }

  const trimmedSocialLink = socialLink.trim();

  if (!trimmedSocialLink) {
    errors.socialLink = "Enter a social media page link.";
  } else {
    try {
      const parsedSocialLink = new URL(trimmedSocialLink);

      if (!["http:", "https:"].includes(parsedSocialLink.protocol)) {
        errors.socialLink = "Enter a valid http or https link.";
      }
    } catch {
      errors.socialLink = "Enter a valid http or https link.";
    }
  }

  if (packages.length === 0) {
    errors.packages = "Choose at least one package.";
  } else if (packages.length > MAX_CHECKOUT_PACKAGES) {
    errors.packages = `Choose no more than ${MAX_CHECKOUT_PACKAGES} packages.`;
  } else if (packages.some((packageName) => typeof packageName !== "string")) {
    errors.packages = "Choose a valid package.";
  } else if (new Set(packages).size !== packages.length) {
    errors.packages = "Choose each package only once.";
  } else {
    const hasUnknownPackage = packages.some(
      (packageName) => !ORDER_PACKAGE_PRICES[packageName],
    );

    if (hasUnknownPackage) {
      errors.packages = "Choose a valid package.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildCheckoutMetadata(
  draft: CheckoutOrderDraft,
): Record<string, string> {
  return {
    customer_email: draft.email.trim(),
    customer_name: draft.name.trim(),
    social_link: draft.socialLink.trim(),
    packages: draft.packages.join(", "),
    package_count: String(draft.packages.length),
    total_cents: String(getOrderTotalCents(draft.packages)),
  };
}

export function getCheckoutSiteUrl(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    return null;
  }

  try {
    const parsedSiteUrl = new URL(siteUrl);

    if (!["http:", "https:"].includes(parsedSiteUrl.protocol)) {
      return null;
    }

    return parsedSiteUrl.origin;
  } catch {
    return null;
  }
}

export function buildCheckoutSessionParams(
  draft: CheckoutOrderDraft,
  siteUrl: string,
): Stripe.Checkout.SessionCreateParams {
  const metadata = buildCheckoutMetadata(draft);

  return {
    cancel_url: `${siteUrl}/order/cancel`,
    customer_email: draft.email.trim(),
    line_items: buildCheckoutLineItems(draft.packages),
    metadata,
    mode: "payment",
    payment_intent_data: {
      metadata,
    },
    payment_method_types: ["card"],
    success_url: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
  };
}
