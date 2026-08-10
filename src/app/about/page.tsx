import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../arrow-icon";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";

export const metadata: Metadata = {
  title: "About Us | Follow Me To The Sea",
  description:
    "Learn how Follow Me To The Sea helps businesses, brands, and creators strengthen their visible social media presence.",
};

const services = [
  {
    name: "Follower packages",
    description:
      "Choose from 1K, 2K, or 5K follower plans for a stronger-looking profile.",
  },
  {
    name: "Like packages",
    description:
      "Add visible support to selected content with 1K, 2K, or 5K like plans.",
  },
  {
    name: "View packages",
    description:
      "Increase visible reach with 1K, 5K, or 10K view plans for selected content.",
  },
];

export default function AboutPage() {
  return (
    <main className="about-page" id="top">
      <div className="sticky-header">
        <SiteHeader />
      </div>

      <section className="about-page-hero">
        <div className="about-hero-grid" aria-hidden="true" />
        <div className="about-hero-glow" aria-hidden="true" />
        <div className="page-shell about-hero-content">
          <div className="about-hero-layout">
            <div className="about-hero-heading">
              <p>About us</p>
              <h1>
                Helping your social media
                <br />
                <em>look stronger.</em>
              </h1>
            </div>

            <div className="about-hero-summary">
              <span>What we do</span>
              <p>
                Follow Me To The Sea offers clear follower, like, and view
                packages for businesses, brands, and creators who want a
                stronger-looking online presence.
              </p>
              <ul>
                <li>Follower plans</li>
                <li>Like plans</li>
                <li>View plans</li>
              </ul>
              <Link href="/packages">
                See all packages <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="page-shell">
          <div className="about-section-heading">
            <div>
              <p className="about-page-label">What we offer</p>
              <h2>Built around your goals</h2>
            </div>
            <p>
              Clear social media plans for the profile and content metrics
              that shape online first impressions.
            </p>
          </div>

          <div className="about-values-grid">
            {services.map((service) => (
              <article key={service.name}>
                <span aria-hidden="true" />
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="page-shell">
          <p>Ready to strengthen your presence?</p>
          <h2>Choose your next move.</h2>
          <div>
            <Link href="/packages">
              Explore packages <ArrowIcon />
            </Link>
            <Link className="about-inline-cta" href="/contact">
              Contact us <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
