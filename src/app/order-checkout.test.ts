import test from "node:test";
import assert from "node:assert/strict";
import {
  ORDER_PACKAGE_PRICES,
  buildCheckoutLineItems,
  buildCheckoutMetadata,
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
      name: "Enter your name.",
      socialLink: "Enter a social media page link.",
      packages: "Choose at least one package.",
    },
  });
  assert.deepEqual(
    validateCheckoutOrder({
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

test("buildCheckoutMetadata includes order details for Stripe", () => {
  assert.deepEqual(
    buildCheckoutMetadata({
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Followers", "5K Likes"],
    }),
    {
      customer_name: "Jane Doe",
      social_link: "https://instagram.com/example",
      packages: "1K Followers, 5K Likes",
      package_count: "2",
      total_cents: "39800",
    },
  );
});
