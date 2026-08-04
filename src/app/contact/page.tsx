import type { Metadata } from "next";
import { ContactForm } from "../contact-form";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";

export const metadata: Metadata = {
  title: "Contact Us | Follow Me To The Sea",
  description:
    "Tell Follow Me To The Sea what you need for your social media presence.",
};

export default function ContactPage() {
  return (
    <main className="contact-page" id="top">
      <div className="sticky-header">
        <SiteHeader />
      </div>

      <section className="contact-page-hero">
        <div className="contact-page-orbit orbit-one" aria-hidden="true" />
        <div className="contact-page-orbit orbit-two" aria-hidden="true" />

        <div className="page-shell contact-page-grid">
          <div className="contact-page-copy">
            <p className="contact-page-label">Contact us</p>
            <h1>
              Let&apos;s grow your
              <br />
              <em>social presence.</em>
            </h1>
            <p>
              Tell us what you&apos;re working on and what kind of boost you
              need. We&apos;ll help you choose a straightforward package that
              fits your goal.
            </p>

            <div className="contact-details">
              <div>
                <small>Email us</small>
                <a href="mailto:hello@followmetothesea.com">
                  hello@followmetothesea.com
                </a>
              </div>
              <div>
                <small>Our approach</small>
                <span>Simple. Clear. No unnecessary waiting.</span>
              </div>
            </div>
          </div>

          <div className="contact-page-form">
            <div className="contact-form-heading">
              <span>Start an inquiry</span>
              <p>Complete the form and we&apos;ll take it from there.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
