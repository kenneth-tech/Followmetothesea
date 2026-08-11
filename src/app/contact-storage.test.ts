import assert from "node:assert/strict";
import test from "node:test";

import {
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
