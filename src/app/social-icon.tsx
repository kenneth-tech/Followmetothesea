type SocialIconProps = {
  platform: "instagram" | "facebook" | "tiktok";
};

export function SocialIcon({ platform }: SocialIconProps) {
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle className="social-icon-dot" cx="17.5" cy="6.7" r="1" />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 21v-8h3l.5-3H14V8.2c0-1 .4-1.7 1.8-1.7H18V3.8c-.7-.1-1.6-.2-2.7-.2-2.7 0-4.5 1.7-4.5 4.7V10H8v3h2.8v8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.2 4v10.7a4.7 4.7 0 1 1-4-4.6v3.2a1.7 1.7 0 1 0 1 1.6V4Z" />
      <path d="M14.2 4c.5 2.7 2.1 4.3 4.8 4.7v3.1c-2-.1-3.5-.7-4.8-1.7" />
    </svg>
  );
}
