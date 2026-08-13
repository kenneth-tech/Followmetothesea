import { NextResponse } from "next/server";
import Stripe from "stripe";

import { sendPaidOrderNotification } from "../../../notification-email";
import { markCheckoutSessionPaid } from "../../../order-storage";

export const runtime = "nodejs";

function getPaymentIntentId(
  paymentIntent: Stripe.Checkout.Session["payment_intent"],
): string | null {
  if (!paymentIntent) {
    return null;
  }

  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripeSecretKey || !stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured yet." },
      { status: 500 },
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature." },
      { status: 400 },
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  try {
    const order = await markCheckoutSessionPaid(
      session.id,
      getPaymentIntentId(session.payment_intent),
    );

    if (!order) {
      console.error("Paid order notification skipped: Supabase not configured");
      return NextResponse.json({ received: true });
    }

    const notification = await sendPaidOrderNotification(
      order,
      `paid-order-${session.id}`,
    );

    if (!notification.sent) {
      console.error("Paid order notification email failed", notification);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe paid checkout webhook failed", error);
    return NextResponse.json(
      { error: "Unable to process paid checkout webhook." },
      { status: 500 },
    );
  }
}
