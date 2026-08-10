import test from "node:test";
import assert from "node:assert/strict";
import {
  ORDER_GOAL_GROUPS,
  ORDER_GOAL_OPTIONS,
  createOrderDraft,
  validateOrderDraft,
} from "./order-draft.ts";

test("ORDER_GOAL_GROUPS organizes every package goal by package type", () => {
  assert.deepEqual(ORDER_GOAL_GROUPS, [
    {
      label: "Follower Packages",
      options: ["1K Followers", "2K Followers", "5K Followers"],
    },
    {
      label: "Like Packages",
      options: ["1K Likes", "2K Likes", "5K Likes"],
    },
    {
      label: "View Packages",
      options: ["1K Views", "5K Views", "10K Views"],
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

test("createOrderDraft prefills the goal and starts other fields empty", () => {
  assert.deepEqual(createOrderDraft("1K Followers"), {
    name: "",
    socialLink: "",
    goal: "1K Followers",
  });
});

test("validateOrderDraft reports required field errors", () => {
  assert.deepEqual(validateOrderDraft(createOrderDraft()), {
    valid: false,
    errors: {
      name: "Enter your name.",
      socialLink: "Enter a social media page link.",
      goal: "Enter your goal.",
    },
  });
});

test("validateOrderDraft accepts a complete draft", () => {
  assert.deepEqual(
    validateOrderDraft({
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      goal: "1K Likes",
    }),
    {
      valid: true,
      errors: {},
    },
  );
});
