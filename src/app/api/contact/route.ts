import { NextResponse } from "next/server";

import {
  recordContactInquiry,
  validateContactInquiry,
  type ContactInquiryDraft,
} from "../../contact-storage";
import { sendContactInquiryNotification } from "../../notification-email";
import {
  buildRateLimitedResponse,
  contactRateLimiter,
  getClientIp,
} from "../../rate-limit";
import { isAllowedSiteRequest } from "../../request-security";

export async function POST(request: Request) {
  if (!isAllowedSiteRequest(request)) {
    return NextResponse.json(
      { error: "Request is not allowed." },
      { status: 403 },
    );
  }

  const rateLimit = contactRateLimiter.check(`contact:${getClientIp(request)}`);

  if (!rateLimit.allowed) {
    return buildRateLimitedResponse(rateLimit);
  }

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
    const notification = await sendContactInquiryNotification(draft);

    if (!notification.sent) {
      console.error("Contact notification email failed", notification);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Supabase contact inquiry insert failed", error);
    return NextResponse.json(
      { error: "Unable to send your inquiry right now." },
      { status: 500 },
    );
  }
}
