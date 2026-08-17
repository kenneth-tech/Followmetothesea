import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_CHECKOUT_PACKAGES,
  ORDER_PACKAGE_PRICES,
  buildCheckoutSessionParams,
  buildCheckoutLineItems,
  buildCheckoutMetadata,
  getCheckoutSiteUrl,
  getOrderTotalCents,
  validateCheckoutOrder,
} from "./order-checkout.ts";

test("ORDER_PACKAGE_PRICES stores server-side package prices in cents", () => {
  assert.deepEqual(ORDER_PACKAGE_PRICES, {
    "1K Followers": 9900,
    "2K Followers": 14900,
    "5K Followers": 29900,
    "1K Likes": 9900,
    "2K Likes": 14900,
    "5K Likes": 29900,
    "1K Views": 5900,
    "5K Views": 15900,
    "10K Views": 29900,
  });
});

test("getOrderTotalCents totals selected packages", () => {
  assert.equal(getOrderTotalCents(["1K Followers", "5K Likes"]), 39800);
});

test("buildCheckoutLineItems creates Stripe line items from selected packages", () => {
  assert.deepEqual(buildCheckoutLineItems(["1K Views", "10K Views"]), [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "1K Views",
        },
        unit_amount: 5900,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "10K Views",
        },
        unit_amount: 29900,
      },
      quantity: 1,
    },
  ]);
});

test("validateCheckoutOrder rejects unknown package names", () => {
  assert.deepEqual(
    validateCheckoutOrder({
      email: "jane@example.com",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Followers", "Free followers"],
    }),
    {
      valid: false,
      errors: {
        packages: "Choose a valid package.",
      },
    },
  );
});

test("validateCheckoutOrder rejects malformed checkout data", () => {
  assert.deepEqual(validateCheckoutOrder(null), {
    valid: false,
    errors: {
      email: "Enter your email.",
      name: "Enter your name.",
      socialLink: "Enter a social media page link.",
      packages: "Choose at least one package.",
    },
  });
  assert.deepEqual(
    validateCheckoutOrder({
      email: "jane@example.com",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: "1K Followers",
    }),
    {
      valid: false,
      errors: {
        packages: "Choose at least one package.",
      },
    },
  );
});

test("validateCheckoutOrder rejects malformed email", () => {
  assert.deepEqual(
    validateCheckoutOrder({
      email: "jane",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Followers"],
    }),
    {
      valid: false,
      errors: {
        email: "Enter a valid email.",
      },
    },
  );
});

test("validateCheckoutOrder rejects unsafe social media URLs", () => {
  assert.deepEqual(
    validateCheckoutOrder({
      email: "jane@example.com",
      name: "Jane Doe",
      socialLink: "javascript:alert(1)",
      packages: ["1K Followers"],
    }),
    {
      valid: false,
      errors: {
        socialLink: "Enter a valid http or https link.",
      },
    },
  );
});

test("validateCheckoutOrder rejects duplicate packages", () => {
  assert.deepEqual(
    validateCheckoutOrder({
      email: "jane@example.com",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Followers", "1K Followers"],
    }),
    {
      valid: false,
      errors: {
        packages: "Choose each package only once.",
      },
    },
  );
});

test("validateCheckoutOrder rejects oversized package arrays", () => {
  assert.deepEqual(
    validateCheckoutOrder({
      email: "jane@example.com",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: Array.from({ length: MAX_CHECKOUT_PACKAGES + 1 }, () =>
        "1K Followers"
      ),
    }),
    {
      valid: false,
      errors: {
        packages: `Choose no more than ${MAX_CHECKOUT_PACKAGES} packages.`,
      },
    },
  );
});

test("buildCheckoutMetadata includes customer email for Stripe", () => {
  assert.deepEqual(
    buildCheckoutMetadata({
      email: "  jane@example.com  ",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Followers", "5K Likes"],
    }),
    {
      customer_email: "jane@example.com",
      customer_name: "Jane Doe",
      social_link: "https://instagram.com/example",
      packages: "1K Followers, 5K Likes",
      package_count: "2",
      total_cents: "39800",
    },
  );
});

test("getCheckoutSiteUrl requires a configured http or https site URL", () => {
  assert.equal(getCheckoutSiteUrl({}), null);
  assert.equal(getCheckoutSiteUrl({ NEXT_PUBLIC_SITE_URL: "notaurl" }), null);
  assert.equal(
    getCheckoutSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://www.followmetothesea.com/",
    }),
    "https://www.followmetothesea.com",
  );
});

test("buildCheckoutSessionParams limits launch checkout to card payments", () => {
  const params = buildCheckoutSessionParams(
    {
      email: "jane@example.com",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Followers"],
    },
    "https://www.followmetothesea.com",
  );

  assert.deepEqual(params.payment_method_types, ["card"]);
});
