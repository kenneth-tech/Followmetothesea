"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "./arrow-icon";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

type MobileMenuProps = {
  logo: ReactNode;
};

export function MobileMenu({ logo }: MobileMenuProps) {
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-label="Open navigation menu"
        className="mobile-menu-trigger"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <button
              aria-label="Close navigation menu"
              className="mobile-menu-backdrop"
              onClick={() => setIsOpen(false)}
              type="button"
            />

            <aside
              aria-label="Mobile navigation"
              aria-modal="true"
              className="mobile-side-menu"
              role="dialog"
            >
              <div className="mobile-side-menu-header">
                {logo}
                <button
                  aria-label="Close navigation menu"
                  className="mobile-menu-close"
                  onClick={() => setIsOpen(false)}
                  ref={closeButtonRef}
                  type="button"
                >
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile primary navigation">
                {navigation.map((item) => (
                  <Link
                    aria-current={pathname === item.href ? "page" : undefined}
                    href={item.href}
                    key={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.label}</span>
                    <ArrowIcon />
                  </Link>
                ))}
              </nav>

              <div className="mobile-side-menu-footer">
                <small>Follow Me To The Sea</small>
                <p>Build a stronger-looking social media presence.</p>
              </div>
            </aside>
          </>,
          document.body,
        )}
    </>
  );
}
