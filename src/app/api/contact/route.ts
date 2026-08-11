import { NextResponse } from "next/server";

import {
  recordContactInquiry,
  validateContactInquiry,
  type ContactInquiryDraft,
} from "../../contact-storage";

export async function POST(request: Request) {
  let draft: ContactInquiryDraft;

  try {
    draft = (await request.json()) as ContactInquiryDraft;
  } catch {
    return NextResponse.json(
      { error: "Invalid contact request." },
      { status: 400 },
    );
  }

  const result = validateContactInquiry(draft);

  if (!result.valid) {
    return NextResponse.json(
      { error: "Check your inquiry details.", errors: result.errors },
      { status: 400 },
    );
  }

  try {
    await recordContactInquiry(draft);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Supabase contact inquiry insert failed", error);
    return NextResponse.json(
      { error: "Unable to send your inquiry right now." },
      { status: 500 },
    );
  }
}
