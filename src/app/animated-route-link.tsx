"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { BrandedLoadingOverlay } from "./branded-loading-overlay";

type AnimatedRouteLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export function AnimatedRouteLink({
  children,
  className,
  href,
}: AnimatedRouteLinkProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const navigationTimer = window.setTimeout(
      () => router.push(href),
      reduceMotion ? 100 : 1250,
    );

    return () => {
      window.clearTimeout(navigationTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [href, isLoading, router]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const isModifiedClick =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    if (isModifiedClick || isLoading) {
      return;
    }

    event.preventDefault();
    setIsLoading(true);
  }

  return (
    <>
      <Link className={className} href={href} onClick={handleClick}>
        {children}
      </Link>
      {isLoading && <BrandedLoadingOverlay />}
    </>
  );
}
