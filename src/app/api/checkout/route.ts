import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  buildCheckoutSessionParams,
  getCheckoutSiteUrl,
  validateCheckoutOrder,
  type CheckoutOrderDraft,
} from "../../order-checkout";
import { recordCheckoutSession } from "../../order-storage";
import {
  buildRateLimitedResponse,
  checkoutRateLimiter,
  getClientIp,
} from "../../rate-limit";
import { isAllowedSiteRequest } from "../../request-security";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = getCheckoutSiteUrl();

  if (!isAllowedSiteRequest(request)) {
    return NextResponse.json(
      { error: "Request is not allowed." },
      { status: 403 },
    );
  }

  const rateLimit = checkoutRateLimiter.check(`checkout:${getClientIp(request)}`);

  if (!rateLimit.allowed) {
    return buildRateLimitedResponse(rateLimit);
  }

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 500 },
    );
  }

  if (!siteUrl) {
    return NextResponse.json(
      { error: "Site URL is not configured yet." },
      { status: 500 },
    );
  }

  let draft: CheckoutOrderDraft;

  try {
    draft = (await request.json()) as CheckoutOrderDraft;
  } catch {
    return NextResponse.json(
      { error: "Invalid checkout request." },
      { status: 400 },
    );
  }

  const result = validateCheckoutOrder(draft);

  if (!result.valid) {
    return NextResponse.json(
      { error: "Check your order details.", errors: result.errors },
      { status: 400 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.create(
      buildCheckoutSessionParams(draft, siteUrl),
    );

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    await recordCheckoutSession(draft, session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation failed", error);
    return NextResponse.json(
      { error: "Unable to start checkout right now." },
      { status: 500 },
    );
  }
}
