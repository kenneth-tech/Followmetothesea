"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import { ArrowIcon } from "./arrow-icon";
import {
  ORDER_GOAL_GROUPS,
  createOrderDraft,
  toggleOrderPackage,
  validateOrderDraft,
  type OrderDraft,
  type OrderDraftErrors,
} from "./order-draft";

type OrderPopupProps = {
  children: ReactNode;
  initialGoal?: string;
  triggerAriaLabel?: string;
  triggerClassName?: string;
};

export function OrderPopup({
  children,
  initialGoal = "",
  triggerAriaLabel,
  triggerClassName,
}: OrderPopupProps) {
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<OrderDraft>(() =>
    createOrderDraft(initialGoal),
  );
  const [errors, setErrors] = useState<OrderDraftErrors>({});
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function openPopup() {
    setDraft(createOrderDraft(initialGoal));
    setErrors({});
    setCheckoutError("");
    setIsSubmitting(false);
    setIsOpen(true);
  }

  function updateField(field: "email" | "name" | "socialLink", value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function togglePackage(packageName: string) {
    setDraft((current) => ({
      ...current,
      packages: toggleOrderPackage(current.packages, packageName, initialGoal),
    }));
    setErrors((current) => ({ ...current, packages: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateOrderDraft(draft);
    setErrors(result.errors);
    setCheckoutError("");

    if (!result.valid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        body: JSON.stringify(draft),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to start checkout.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        aria-label={triggerAriaLabel}
        className={triggerClassName}
        onClick={openPopup}
        type="button"
      >
        {children}
      </button>

      {isOpen && (
        <div className="order-popup-backdrop">
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className="order-popup"
            role="dialog"
          >
            <button
              aria-label="Close order form"
              className="order-popup-close"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ×
            </button>

            <>
              <p className="order-popup-label">Start your order</p>
              <h2 id={titleId}>Tell us what to boost.</h2>
              <form className="order-popup-form" onSubmit={handleSubmit}>
                  <label className="order-text-field">
                    <span>Name</span>
                    <input
                      autoComplete="name"
                      maxLength={100}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Your full name"
                      type="text"
                      value={draft.name}
                    />
                    {errors.name && <small>{errors.name}</small>}
                  </label>
                  <label className="order-text-field">
                    <span>Email address</span>
                    <input
                      autoComplete="email"
                      maxLength={254}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="you@email.com"
                      type="email"
                      value={draft.email}
                    />
                    {errors.email && <small>{errors.email}</small>}
                  </label>
                  <label className="order-text-field">
                    <span>Link to social media page</span>
                    <input
                      maxLength={300}
                      onChange={(event) =>
                        updateField("socialLink", event.target.value)
                      }
                      placeholder="https://instagram.com/yourpage"
                      type="url"
                      value={draft.socialLink}
                    />
                    {errors.socialLink && <small>{errors.socialLink}</small>}
                  </label>
                  <label>
                    <span>Packages</span>
                    <div
                      aria-label="Choose packages"
                      className="order-package-selector"
                      role="group"
                    >
                      {ORDER_GOAL_GROUPS.map((group) => (
                        <div className="order-package-group" key={group.label}>
                          <p>{group.label}</p>
                          <div className="order-package-options">
                            {group.options.map((option) => (
                              <button
                                aria-checked={draft.packages.includes(
                                  option.value,
                                )}
                                className={`order-package-option${draft.packages.includes(option.value) ? " is-selected" : ""}${initialGoal === option.value ? " is-locked" : ""}`}
                                disabled={initialGoal === option.value}
                                key={option.value}
                                onClick={() => togglePackage(option.value)}
                                role="checkbox"
                                type="button"
                              >
                                <span
                                  aria-hidden="true"
                                  className="order-package-box"
                                />
                                <span>{option.value}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {draft.packages.length > 0 && (
                      <div className="order-package-summary">
                        <span>Selected packages</span>
                        <p>{draft.packages.join(", ")}</p>
                      </div>
                    )}
                    {errors.packages && <small>{errors.packages}</small>}
                  </label>
                {checkoutError && (
                  <p className="order-popup-error" role="alert">
                    {checkoutError}
                  </p>
                )}
                <button
                  className="order-popup-submit"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Redirecting..." : "Continue"} <ArrowIcon />
                </button>
              </form>
            </>
          </div>
        </div>
      )}
    </>
  );
}
