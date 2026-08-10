import test from "node:test";
import assert from "node:assert/strict";
import { createOrderDraft, validateOrderDraft } from "./order-draft.ts";

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
