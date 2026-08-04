"use client";

import { useEffect, useState } from "react";
import { BrandedLoadingOverlay } from "./branded-loading-overlay";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const leaveTimer = window.setTimeout(
      () => setIsLeaving(true),
      reduceMotion ? 50 : 1150,
    );
    const hideTimer = window.setTimeout(
      () => setIsVisible(false),
      reduceMotion ? 100 : 1550,
    );

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      document.body.style.overflow = "";
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return <BrandedLoadingOverlay isLeaving={isLeaving} />;
}
