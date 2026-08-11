import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "./order-storage.ts";

export const SUPABASE_CONTACT_INQUIRIES_TABLE = "contact_inquiries";

export type ContactInquiryDraft = {
  country: string;
  email: string;
  message: string;
  name: string;
  phone: string;
};

export type ContactInquiryErrors = Partial<
  Record<keyof ContactInquiryDraft, string>
>;

export type ContactInquiryRecord = ContactInquiryDraft & {
  status: "new";
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDraftValue(
  draft: Partial<ContactInquiryDraft>,
  field: keyof ContactInquiryDraft,
): string {
  return typeof draft[field] === "string" ? draft[field] : "";
}

export function validateContactInquiry(draft: unknown): {
  errors: ContactInquiryErrors;
  valid: boolean;
} {
  const inquiry =
    draft && typeof draft === "object"
      ? (draft as Partial<ContactInquiryDraft>)
      : {};
  const errors: ContactInquiryErrors = {};
  const country = getDraftValue(inquiry, "country");
  const email = getDraftValue(inquiry, "email");
  const message = getDraftValue(inquiry, "message");
  const name = getDraftValue(inquiry, "name");
  const phone = getDraftValue(inquiry, "phone");

  if (!country.trim()) {
    errors.country = "Choose a country.";
  }

  if (!email.trim()) {
    errors.email = "Enter your email.";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Enter a valid email.";
  }

  if (!message.trim()) {
    errors.message = "Enter a message.";
  }

  if (!name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!phone.trim()) {
    errors.phone = "Enter your phone number.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
}

export function buildContactInquiryRecord(
  draft: ContactInquiryDraft,
): ContactInquiryRecord {
  return {
    country: draft.country.trim(),
    email: draft.email.trim(),
    message: draft.message.trim(),
    name: draft.name.trim(),
    phone: draft.phone.trim(),
    status: "new",
  };
}

export async function recordContactInquiry(
  draft: ContactInquiryDraft,
): Promise<void> {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase is not configured.");
  }

  const supabase = createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase
    .from(SUPABASE_CONTACT_INQUIRIES_TABLE)
    .insert(buildContactInquiryRecord(draft));

  if (error) {
    throw error;
  }
}
