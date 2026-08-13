import test from "node:test";
import assert from "node:assert/strict";
import {
  ORDER_GOAL_GROUPS,
  ORDER_GOAL_OPTIONS,
  createOrderDraft,
  toggleOrderPackage,
  validateOrderDraft,
} from "./order-draft.ts";

test("ORDER_GOAL_GROUPS organizes every package goal by package type", () => {
  assert.deepEqual(ORDER_GOAL_GROUPS, [
    {
      label: "Followers",
      options: [
        { label: "1K", value: "1K Followers" },
        { label: "2K", value: "2K Followers" },
        { label: "5K", value: "5K Followers" },
      ],
    },
    {
      label: "Likes",
      options: [
        { label: "1K", value: "1K Likes" },
        { label: "2K", value: "2K Likes" },
        { label: "5K", value: "5K Likes" },
      ],
    },
    {
      label: "Views",
      options: [
        { label: "1K", value: "1K Views" },
        { label: "5K", value: "5K Views" },
        { label: "10K", value: "10K Views" },
      ],
    },
  ]);
});

test("ORDER_GOAL_OPTIONS includes every package goal", () => {
  assert.deepEqual(ORDER_GOAL_OPTIONS, [
    "1K Followers",
    "2K Followers",
    "5K Followers",
    "1K Likes",
    "2K Likes",
    "5K Likes",
    "1K Views",
    "5K Views",
    "10K Views",
  ]);
});

test("createOrderDraft prefills one selected package and starts other fields empty", () => {
  assert.deepEqual(createOrderDraft("1K Followers"), {
    email: "",
    name: "",
    socialLink: "",
    packages: ["1K Followers"],
  });
});

test("validateOrderDraft handles older draft state with a missing email", () => {
  assert.deepEqual(
    validateOrderDraft({
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Likes"],
    } as never),
    {
      valid: false,
      errors: {
        email: "Enter your email.",
      },
    },
  );
});

test("toggleOrderPackage adds and removes packages", () => {
  assert.deepEqual(toggleOrderPackage([], "1K Followers"), ["1K Followers"]);
  assert.deepEqual(toggleOrderPackage(["1K Followers"], "5K Likes"), [
    "1K Followers",
    "5K Likes",
  ]);
  assert.deepEqual(
    toggleOrderPackage(["1K Followers", "5K Likes"], "1K Followers"),
    ["5K Likes"],
  );
});

test("toggleOrderPackage keeps a locked subscribed package selected", () => {
  assert.deepEqual(
    toggleOrderPackage(["1K Followers"], "1K Followers", "1K Followers"),
    ["1K Followers"],
  );
  assert.deepEqual(
    toggleOrderPackage(["1K Followers"], "5K Likes", "1K Followers"),
    ["1K Followers", "5K Likes"],
  );
  assert.deepEqual(
    toggleOrderPackage(
      ["1K Followers", "5K Likes"],
      "5K Likes",
      "1K Followers",
    ),
    ["1K Followers"],
  );
});

test("validateOrderDraft reports required field errors", () => {
  assert.deepEqual(validateOrderDraft(createOrderDraft()), {
    valid: false,
    errors: {
      email: "Enter your email.",
      name: "Enter your name.",
      socialLink: "Enter a social media page link.",
      packages: "Choose at least one package.",
    },
  });
});

test("validateOrderDraft rejects malformed email", () => {
  assert.deepEqual(
    validateOrderDraft({
      email: "jane",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Likes"],
    }),
    {
      valid: false,
      errors: {
        email: "Enter a valid email.",
      },
    },
  );
});

test("validateOrderDraft accepts a complete draft", () => {
  assert.deepEqual(
    validateOrderDraft({
      email: "jane@example.com",
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      packages: ["1K Likes", "5K Views"],
    }),
    {
      valid: true,
      errors: {},
    },
  );
});
