type PackageIconProps = {
  type: "follower" | "like" | "view";
};

export function PackageIcon({ type }: PackageIconProps) {
  if (type === "follower") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="13" cy="11" r="4.5" />
        <path d="M4.5 26c.6-5.2 3.4-8 8.5-8s7.9 2.8 8.5 8" />
        <path d="M25 9v8M21 13h8" />
      </svg>
    );
  }

  if (type === "like") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 26.5 6.8 18C1 12.7 4.5 5.5 10.2 5.5c2.6 0 4.6 1.5 5.8 3.4 1.2-1.9 3.2-3.4 5.8-3.4C27.5 5.5 31 12.7 25.2 18Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M3.5 16s4.6-7.5 12.5-7.5S28.5 16 28.5 16 23.9 23.5 16 23.5 3.5 16 3.5 16Z" />
      <circle cx="16" cy="16" r="3.5" />
    </svg>
  );
}
