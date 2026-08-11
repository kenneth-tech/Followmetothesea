import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../../arrow-icon";
import { SiteFooter } from "../../site-footer";
import { SiteHeader } from "../../site-header";

export const metadata: Metadata = {
  title: "Payment Cancelled | Follow Me To The Sea",
  description:
    "Your payment was cancelled. You can return to packages and try again.",
};

export default function OrderCancelPage() {
  return (
    <main className="order-status-page" id="top">
      <div className="sticky-header">
        <SiteHeader />
      </div>

      <section className="order-status-section">
        <div className="page-shell order-status-card">
          <p>Payment cancelled</p>
          <h1>No payment was made.</h1>
          <span>
            Your order was not charged. You can return to the package page when
            you are ready.
          </span>
          <Link href="/packages">
            Choose packages <ArrowIcon />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
