import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../site-header";
import { PackageIcon } from "../package-icon";
import { ArrowIcon } from "../arrow-icon";
import { SiteFooter } from "../site-footer";
import { OrderPopup } from "../order-popup";

export const metadata: Metadata = {
  title: "Packages | Follow Me To The Sea",
  description:
    "Explore follower, like, and view packages for your social media goals.",
};

const packageGroups = [
  {
    id: "follower",
    icon: "follower" as const,
    title: "Follower Packages",
    summary:
      "Build stronger social proof and help your profile look more established at first glance.",
    options: [
      {
        tier: "Follower plan",
        name: "1K Followers",
        price: "$99",
        note: "A straightforward boost for one social profile.",
        features: [
          "1,000 follower target",
          "For one social profile",
          "Package guidance included",
        ],
      },
      {
        tier: "Follower plan",
        name: "2K Followers",
        price: "$149",
        note: "For pages moving toward a stronger visible milestone.",
        features: [
          "2,000 follower target",
          "For one social profile",
          "Package guidance included",
        ],
      },
      {
        tier: "Follower plan",
        name: "5K Followers",
        price: "$299",
        note: "A larger follower package for established growth goals.",
        features: [
          "5,000 follower target",
          "For one social profile",
          "Package guidance included",
        ],
      },
    ],
  },
  {
    id: "like",
    icon: "like" as const,
    title: "Like Packages",
    summary:
      "Give priority posts a stronger presence with visible engagement that supports your content.",
    options: [
      {
        tier: "Like plan",
        name: "1K Likes",
        price: "$99",
        note: "A focused boost for priority content.",
        features: [
          "1,000 like target",
          "For one selected post",
          "Package guidance included",
        ],
      },
      {
        tier: "Like plan",
        name: "2K Likes",
        price: "$149",
        note: "A stronger like target for priority content.",
        features: [
          "2,000 like target",
          "For one selected post",
          "Package guidance included",
        ],
      },
      {
        tier: "Like plan",
        name: "5K Likes",
        price: "$299",
        note: "A high-volume like package for selected content.",
        features: [
          "5,000 like target",
          "For one selected post",
          "Package guidance included",
        ],
      },
    ],
  },
  {
    id: "view",
    icon: "view" as const,
    title: "View Packages",
    summary:
      "Increase visible reach on the content you want more people to notice.",
    options: [
      {
        tier: "View plan",
        name: "1K Views",
        price: "$59",
        note: "A focused view boost for selected content.",
        features: [
          "1,000 view target",
          "For selected content",
          "Package guidance included",
        ],
      },
      {
        tier: "View plan",
        name: "5K Views",
        price: "$159",
        note: "A stronger view target for priority content.",
        features: [
          "5,000 view target",
          "For selected content",
          "Package guidance included",
        ],
      },
      {
        tier: "View plan",
        name: "10K Views",
        price: "$299",
        note: "A high-visibility package for selected content.",
        features: [
          "10,000 view target",
          "For selected content",
          "Package guidance included",
        ],
      },
    ],
  },
];

export default function PackagesPage() {
  return (
    <main className="packages-page" id="top">
      <div className="sticky-header">
        <SiteHeader />
      </div>

      <section className="packages-hero">
        <div className="package-orbit orbit-one" aria-hidden="true" />
        <div className="package-orbit orbit-two" aria-hidden="true" />
        <div className="page-shell packages-hero-grid">
          <div>
            <p className="packages-label">Social growth packages</p>
            <h1>
              Pick the boost
              <br />
              that fits <em>your goal.</em>
            </h1>
          </div>
          <div className="packages-hero-copy">
            <p>
              No complicated process and no unnecessary waiting. Explore the
              options, choose what your page needs, and contact us to get
              started.
            </p>
            <OrderPopup triggerClassName="packages-inline-cta">
              Request a package <ArrowIcon />
            </OrderPopup>
          </div>
        </div>
      </section>

      <div className="package-list page-shell">
        {packageGroups.map((group) => (
          <section className="package-group" id={group.id} key={group.id}>
            <div className="package-group-intro">
              <div className="package-group-marker">
                <i>
                  <PackageIcon type={group.icon} />
                </i>
              </div>
              <h2>{group.title}</h2>
              <p>{group.summary}</p>
            </div>

            <div className="package-options">
              {group.options.map((option) => (
                <article key={option.name}>
                  <div>
                    <span className="plan-tier">{option.tier}</span>
                    <h3>{option.name}</h3>
                    <strong className="plan-price">{option.price}</strong>
                    <p>{option.note}</p>
                    <ul>
                      {option.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <OrderPopup
                    initialGoal={option.name}
                    triggerClassName="package-subscribe-button"
                    triggerAriaLabel={`Subscribe to ${option.name}`}
                  >
                    Subscribe Now
                  </OrderPopup>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="packages-cta">
        <div className="page-shell">
          <p>Need something else for your socials?</p>
          <h2>Let&apos;s build the right package together.</h2>
          <Link className="packages-inline-cta" href="/contact">
            Contact us <ArrowIcon />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
