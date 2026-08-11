import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  buildCheckoutLineItems,
  buildCheckoutMetadata,
  validateCheckoutOrder,
  type CheckoutOrderDraft,
} from "../../order-checkout";
import { recordCheckoutSession } from "../../order-storage";

function getSiteUrl(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    new URL(request.url).origin
  ).replace(/\/$/, "");
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
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
  const siteUrl = getSiteUrl(request);
  const metadata = buildCheckoutMetadata(draft);

  try {
    const session = await stripe.checkout.sessions.create({
      cancel_url: `${siteUrl}/order/cancel`,
      line_items: buildCheckoutLineItems(draft.packages),
      metadata,
      mode: "payment",
      payment_intent_data: {
        metadata,
      },
      success_url: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    try {
      await recordCheckoutSession(draft, session.id);
    } catch (error) {
      console.error("Supabase order insert failed", error);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session failed", error);
    return NextResponse.json(
      { error: "Unable to start checkout right now." },
      { status: 500 },
    );
  }
}
