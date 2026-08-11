import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Follow Me To The Sea home">
      <Image
        className="brand-logo"
        src="/Logo/new.png"
        alt="Follow Me To The Sea"
        width={707}
        height={353}
        priority
      />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header page-shell">
      <Logo />

      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/">Home</Link>
        <Link href="/packages">Packages</Link>
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      <MobileMenu logo={<Logo />} />
    </header>
  );
}
