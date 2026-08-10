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
  const [continued, setContinued] = useState(false);

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
    setContinued(false);
    setIsOpen(true);
  }

  function updateField(field: keyof OrderDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function selectGoal(goal: string) {
    updateField("goal", goal);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateOrderDraft(draft);
    setErrors(result.errors);

    if (result.valid) {
      setContinued(true);
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

            {continued ? (
              <div className="order-popup-next-step">
                <p className="order-popup-label">Order details received</p>
                <h2 id={titleId}>Payment is next.</h2>
                <p>
                  Your order details are ready. Stripe Checkout will be added in
                  the next step so you can continue to secure payment.
                </p>
                <button onClick={() => setIsOpen(false)} type="button">
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="order-popup-label">Start your order</p>
                <h2 id={titleId}>Tell us what to boost.</h2>
                <form className="order-popup-form" onSubmit={handleSubmit}>
                  <label>
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
                  <label>
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
                    <span>Goal</span>
                    <div
                      aria-label="Choose a package goal"
                      className="order-goal-selector"
                      role="group"
                    >
                      {ORDER_GOAL_GROUPS.map((group) => (
                        <div className="order-goal-group" key={group.label}>
                          <p>{group.label}</p>
                          <div className="order-goal-options">
                            {group.options.map((option) => (
                              <button
                                aria-pressed={draft.goal === option.value}
                                className={`order-goal-option${draft.goal === option.value ? " is-selected" : ""}`}
                                key={option.value}
                                onClick={() => selectGoal(option.value)}
                                type="button"
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.goal && <small>{errors.goal}</small>}
                  </label>
                  <button className="order-popup-submit" type="submit">
                    Continue <ArrowIcon />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
