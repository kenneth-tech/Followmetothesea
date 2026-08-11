import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../../arrow-icon";
import { SiteFooter } from "../../site-footer";
import { SiteHeader } from "../../site-header";

export const metadata: Metadata = {
  title: "Payment Successful | Follow Me To The Sea",
  description:
    "Your payment was successful and your order has been received.",
};

export default function OrderSuccessPage() {
  return (
    <main className="order-status-page" id="top">
      <div className="sticky-header">
        <SiteHeader />
      </div>

      <section className="order-status-section">
        <div className="page-shell order-status-card">
          <p>Payment successful</p>
          <h1>Your order is in.</h1>
          <span>
            Thanks for your order. We have your payment and order details, and
            the next step is processing.
          </span>
          <Link href="/packages">
            Back to packages <ArrowIcon />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
