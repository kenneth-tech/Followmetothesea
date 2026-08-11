import type Stripe from "stripe";

export type CheckoutOrderDraft = {
  name: string;
  socialLink: string;
  packages: string[];
};

export type CheckoutOrderErrors = Partial<
  Record<keyof CheckoutOrderDraft, string>
>;

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

  if (!socialLink.trim()) {
    errors.socialLink = "Enter a social media page link.";
  }

  if (packages.length === 0) {
    errors.packages = "Choose at least one package.";
  }

  const hasUnknownPackage = packages.some(
    (packageName) => !ORDER_PACKAGE_PRICES[packageName],
  );

  if (hasUnknownPackage) {
    errors.packages = "Choose a valid package.";
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
    customer_name: draft.name.trim(),
    social_link: draft.socialLink.trim(),
    packages: draft.packages.join(", "),
    package_count: String(draft.packages.length),
    total_cents: String(getOrderTotalCents(draft.packages)),
  };
}
