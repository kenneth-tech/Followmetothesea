import Image from "next/image";

type BrandedLoadingOverlayProps = {
  isLeaving?: boolean;
};

export function BrandedLoadingOverlay({
  isLeaving = false,
}: BrandedLoadingOverlayProps) {
  return (
    <div
      className={`loading-screen${isLeaving ? " is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Follow Me To The Sea"
    >
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-ripples" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="loader-content">
        <div className="loader-mark" aria-hidden="true">
          <Image
            src="/logo/icon fm.png"
            alt=""
            width={108}
            height={108}
            priority
          />
        </div>
        <div className="loader-progress" aria-hidden="true">
          <i />
        </div>
        <small>Building your presence</small>
      </div>
    </div>
  );
}
