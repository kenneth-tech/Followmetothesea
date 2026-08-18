import Link from "next/link";
import { ArrowIcon } from "./arrow-icon";
import { Logo } from "./site-header";
import { SocialIcon } from "./social-icon";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v11H9l-5 4Z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-main">
        <div className="footer-brand-column">
          <Logo />
          <p>Connect</p>
          <nav className="footer-socials" aria-label="Social media">
            <a href="#" aria-label="Follow us on Instagram">
              <SocialIcon platform="instagram" />
            </a>
            <a href="#" aria-label="Follow us on Facebook">
              <SocialIcon platform="facebook" />
            </a>
            <a href="#" aria-label="Follow us on TikTok">
              <SocialIcon platform="tiktok" />
            </a>
          </nav>
        </div>

        <div className="footer-link-column">
          <h2>Packages</h2>
          <nav aria-label="Package links">
            <Link href="/packages#follower">Follower Packages</Link>
            <Link href="/packages#like">Like Packages</Link>
            <Link href="/packages#view">View Packages</Link>
          </nav>
        </div>

        <div className="footer-link-column">
          <h2>Company</h2>
          <nav aria-label="Company links">
            <Link href="/about">About Us</Link>
            <Link href="/packages">Packages</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/#home">Home</Link>
          </nav>
        </div>

        <div className="footer-contact-column">
          <h2>Let&apos;s talk</h2>
          <p>Tell us what you want your social presence to achieve.</p>

          <a
            className="footer-contact-card"
            href="mailto:marketing@sandseamedia.com"
          >
            <span className="footer-contact-icon"><MailIcon /></span>
            <span>
              <small>Email us</small>
              <strong>marketing@sandseamedia.com</strong>
            </span>
          </a>

          <Link className="footer-contact-card" href="/contact">
            <span className="footer-contact-icon"><ChatIcon /></span>
            <span>
              <small>Start an inquiry</small>
              <strong>Tell us what you need</strong>
            </span>
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="page-shell footer-bottom-inner">
          <p>© 2026 Follow Me To The Sea. All rights reserved.</p>
          <div>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <a href="#top">
            Back to top
            <ArrowIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
