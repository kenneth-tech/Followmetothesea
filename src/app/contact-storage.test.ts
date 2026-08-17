import assert from "node:assert/strict";
import test from "node:test";

import {
  CONTACT_FIELD_LIMITS,
  buildContactInquiryRecord,
  validateContactInquiry,
} from "./contact-storage.ts";

const inquiry = {
  country: "PH",
  email: "  kenneth@example.com  ",
  message: "  I need help choosing a package.  ",
  name: "  Kenneth  ",
  phone: "  0917 123 4567  ",
};

test("buildContactInquiryRecord formats a contact form submission for Supabase", () => {
  assert.deepEqual(buildContactInquiryRecord(inquiry), {
    country: "PH",
    email: "kenneth@example.com",
    message: "I need help choosing a package.",
    name: "Kenneth",
    phone: "0917 123 4567",
    status: "new",
  });
});

test("validateContactInquiry rejects missing required fields", () => {
  assert.deepEqual(validateContactInquiry({}), {
    errors: {
      country: "Choose a country.",
      email: "Enter your email.",
      message: "Enter a message.",
      name: "Enter your name.",
      phone: "Enter your phone number.",
    },
    valid: false,
  });
});

test("validateContactInquiry rejects malformed email", () => {
  assert.deepEqual(
    validateContactInquiry({
      ...inquiry,
      email: "kenneth",
    }),
    {
      errors: {
        email: "Enter a valid email.",
      },
      valid: false,
    },
  );
});

test("validateContactInquiry rejects oversized fields", () => {
  assert.deepEqual(
    validateContactInquiry({
      ...inquiry,
      email: `${"a".repeat(CONTACT_FIELD_LIMITS.email)}@example.com`,
      message: "a".repeat(CONTACT_FIELD_LIMITS.message + 1),
      name: "a".repeat(CONTACT_FIELD_LIMITS.name + 1),
      phone: "1".repeat(CONTACT_FIELD_LIMITS.phone + 1),
    }),
    {
      errors: {
        email: `Enter no more than ${CONTACT_FIELD_LIMITS.email} characters.`,
        message: `Enter no more than ${CONTACT_FIELD_LIMITS.message} characters.`,
        name: `Enter no more than ${CONTACT_FIELD_LIMITS.name} characters.`,
        phone: `Enter no more than ${CONTACT_FIELD_LIMITS.phone} characters.`,
      },
      valid: false,
    },
  );
});
