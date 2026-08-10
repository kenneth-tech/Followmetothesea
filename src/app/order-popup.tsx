"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useId,
  useState,
  type FocusEvent,
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
  const [isGoalPickerOpen, setIsGoalPickerOpen] = useState(false);

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
    setIsGoalPickerOpen(false);
    setIsOpen(true);
  }

  function updateField(field: keyof OrderDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function selectGoal(goal: string) {
    updateField("goal", goal);
    setIsGoalPickerOpen(false);
  }

  function handleGoalPickerBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setIsGoalPickerOpen(false);
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
                      className="order-goal-picker"
                      onBlur={handleGoalPickerBlur}
                    >
                      <button
                        aria-expanded={isGoalPickerOpen}
                        aria-haspopup="listbox"
                        className={`order-goal-trigger${draft.goal ? " has-value" : ""}${isGoalPickerOpen ? " is-open" : ""}`}
                        onClick={() =>
                          setIsGoalPickerOpen((current) => !current)
                        }
                        type="button"
                      >
                        <span>{draft.goal || "Select a package"}</span>
                        <span aria-hidden="true" className="order-goal-chevron" />
                      </button>

                      {isGoalPickerOpen && (
                        <div className="order-goal-menu" role="listbox">
                          {ORDER_GOAL_GROUPS.map((group) => (
                            <div
                              className="order-goal-group"
                              key={group.label}
                              role="group"
                            >
                              <p>{group.label}</p>
                              {group.options.map((goal) => (
                                <button
                                  aria-selected={draft.goal === goal}
                                  className={`order-goal-option${draft.goal === goal ? " is-selected" : ""}`}
                                  key={goal}
                                  onClick={() => selectGoal(goal)}
                                  role="option"
                                  type="button"
                                >
                                  <span>{goal}</span>
                                  {draft.goal === goal && (
                                    <span aria-hidden="true">Selected</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
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
