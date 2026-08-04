import { ContactForm } from "./contact-form";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "./site-header";
import { PackageIcon } from "./package-icon";
import { ArrowIcon } from "./arrow-icon";
import { SiteFooter } from "./site-footer";
import { AnimatedRouteLink } from "./animated-route-link";

const caseStudies = [
  {
    name: "Quantak",
    before: "353",
    after: "1.2K",
    screenshots: [
      {
        src: "/Before/quantak.png",
        alt: "Quantak Instagram profile before follower growth",
        width: 736,
        height: 244,
      },
      {
        src: "/After/quantak.png",
        alt: "Quantak Instagram profile after follower growth",
        width: 628,
        height: 223,
      },
    ],
  },
  {
    name: "HMM",
    before: "476",
    after: "1.3K",
    screenshots: [
      {
        src: "/Before/hmm.png",
        alt: "HMM Instagram profile before follower growth",
        width: 736,
        height: 238,
      },
      {
        src: "/After/hmm.png",
        alt: "HMM Instagram profile after follower growth",
        width: 853,
        height: 218,
      },
    ],
  },
  {
    name: "CCP",
    before: "1.3K",
    after: "2.2K",
    screenshots: [
      {
        src: "/Before/ccp.png",
        alt: "CCP Instagram profile before follower growth",
        width: 767,
        height: 219,
      },
      {
        src: "/After/ccp.png",
        alt: "CCP Instagram profile after follower growth",
        width: 942,
        height: 214,
      },
    ],
  },
  {
    name: "Bero Wine",
    before: "2.1K",
    after: "2.9K",
    screenshots: [
      {
        src: "/Before/berowine.png",
        alt: "Bero Wine Instagram profile before follower growth",
        width: 719,
        height: 237,
      },
      {
        src: "/After/berowine.png",
        alt: "Bero Wine Instagram profile after follower growth",
        width: 754,
        height: 230,
      },
    ],
  },
  {
    name: "Belt Mania",
    before: "20",
    after: "871",
    screenshots: [
      {
        src: "/Before/beltmania.png",
        alt: "Belt Mania Instagram profile before follower growth",
        width: 708,
        height: 212,
      },
      {
        src: "/After/beltmania.png",
        alt: "Belt Mania Instagram profile after follower growth",
        width: 737,
        height: 230,
      },
    ],
  },
  {
    name: "Yidlink",
    before: "26",
    after: "877",
    screenshots: [
      {
        src: "/Before/yidlink.png",
        alt: "Yidlink Instagram profile before follower growth",
        width: 685,
        height: 220,
      },
      {
        src: "/After/yidlink.png",
        alt: "Yidlink Instagram profile after follower growth",
        width: 715,
        height: 222,
      },
    ],
  },
  {
    name: "SandSea Media",
    before: "309",
    after: "1.2K",
    screenshots: [
      {
        src: "/Before/sandseamedia.png",
        alt: "SandSea Media Instagram profile before follower growth",
        width: 720,
        height: 249,
      },
      {
        src: "/After/sandseamedia.png",
        alt: "SandSea Media Instagram profile after follower growth",
        width: 802,
        height: 228,
      },
    ],
  },
];

const packages = [
  {
    name: "Follower",
    icon: "follower" as const,
    description: "Build instant social proof and make your profile feel established.",
  },
  {
    name: "Like",
    icon: "like" as const,
    description: "Give your best posts the attention and credibility they deserve.",
  },
  {
    name: "View",
    icon: "view" as const,
    description: "Push your content further with stronger, more visible view counts.",
  },
];

export default function Home() {
  return (
    <main className="home-page" id="top">
      <div className="sticky-header">
        <SiteHeader />
      </div>

      <section className="hero" id="home">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-content page-shell">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />
              Social growth, simplified
            </div>
            <h1>
              Increase your
              <br />
              <em>social media</em> presence.
            </h1>
            <p className="hero-intro">
              Real momentum starts with being seen. Choose your boost and let
              your content make a stronger first impression.
            </p>

            <div className="quick-actions" aria-label="Popular packages">
              <Link className="action-button primary" href="/contact">
                <span>Get 1K likes now.</span>
                <ArrowIcon />
              </Link>
              <Link className="action-button glass" href="/contact">
                <span>Get 1K followers now.</span>
                <ArrowIcon />
              </Link>
              <Link className="action-button glass" href="/contact">
                <span>Get 10K views now.</span>
                <ArrowIcon />
              </Link>
            </div>

            <AnimatedRouteLink className="text-link" href="/packages">
              Explore more packages <ArrowIcon />
            </AnimatedRouteLink>
          </div>
        </div>

      </section>

      <section className="case-section section">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Real growth stories</p>
              <h2>Case studies</h2>
            </div>
            <p>
              A closer look at pages we helped move from hundreds to
              thousands.
            </p>
          </div>

          <div className="case-grid">
            {caseStudies.map((study, index) => (
              <article
                className={`case-card${study.screenshots ? " featured-case" : ""}`}
                key={study.name}
              >
                <div
                  className={`case-visual visual-${(index % 3) + 1}${
                    study.screenshots ? " has-screenshots" : ""
                  }`}
                >
                  {study.screenshots && (
                    <>
                      <div className="case-screenshot-stack">
                        {study.screenshots.map((screenshot) => (
                          <div className="case-screenshot-frame" key={screenshot.src}>
                            <Image
                              src={screenshot.src}
                              alt={screenshot.alt}
                              width={screenshot.width}
                              height={screenshot.height}
                              className="case-screenshot"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="metric-row screenshot-metrics">
                        <div>
                          <small>Before</small>
                          <strong>{study.before}</strong>
                        </div>
                        <ArrowIcon />
                        <div>
                          <small>After</small>
                          <strong>{study.after}</strong>
                        </div>
                      </div>
                    </>
                  )}
                  <span className="asset-note">Screenshot pending · Shaula</span>
                  <div className="profile-orb">{study.name.charAt(0)}</div>
                  <p>{study.name}</p>
                  <div className="metric-row">
                    <div>
                      <small>Before</small>
                      <strong>{study.before}</strong>
                    </div>
                    <ArrowIcon />
                    <div>
                      <small>After</small>
                      <strong>{study.after}</strong>
                    </div>
                  </div>
                </div>
                <div className="case-caption">
                  <span>{study.name}</span>
                  <span>Followers</span>
                </div>
              </article>
            ))}
          </div>

          <p className="about-copy">
            Follow Me To The Sea offers social media growth packages that
            help businesses, brands, and creators build a{" "}
            <em>stronger-looking online presence.</em>
          </p>
        </div>
      </section>

      <section className="packages section page-shell" id="packages">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Pick your momentum</p>
            <h2>Packages</h2>
          </div>
          <p>
            Start with what your page needs today. We&apos;ll help you find the
            right fit.
          </p>
        </div>

        <div className="package-grid">
          {packages.map((item) => (
            <Link
              className="package-card"
              href={`/packages#${item.name.toLowerCase()}`}
              key={item.name}
            >
              <div className="package-top">
                <span className="package-arrow"><ArrowIcon /></span>
              </div>
              <span className="package-icon">
                <PackageIcon type={item.icon} />
              </span>
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <strong>{item.name} packages</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="page-shell contact-grid">
          <div className="contact-copy">
            <p className="section-kicker light">Let&apos;s make waves</p>
            <h2>
              Need something else
              <br />
              for your socials?
            </h2>
            <p>
              Tell us what you&apos;re working on. We&apos;ll get back to you
              with a package that makes sense.
            </p>
            <a href="mailto:hello@followmetothesea.com">
              hello@followmetothesea.com
            </a>
          </div>
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
