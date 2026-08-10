# Order Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable order popup that collects name, social media page URL, and goal before the future Stripe Checkout step.

**Architecture:** Add a small tested validation helper, a client-side `OrderPopup` component, and replace purchase CTAs with an `OrderCta` client wrapper that opens the popup with optional goal prefill. Keep server pages as server components where possible by introducing local client components for the CTA behavior.

**Tech Stack:** Next.js App Router, React 19 client components, CSS in `src/app/globals.css`, Node built-in test runner for helper validation.

## Global Constraints

- This phase does not create Stripe Checkout sessions yet.
- The popup gathers `name`, `socialLink`, and `goal`.
- `socialLink` uses `type="url"`.
- The modal uses `role="dialog"` and `aria-modal="true"`.
- Escape key closes the modal.
- Purchase CTAs open the popup instead of navigating directly to `/contact`.
- Existing informational links still navigate normally.

---

### Task 1: Add Testable Order Draft Validation

**Files:**
- Create: `src/app/order-draft.js`
- Create: `src/app/order-draft.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `createOrderDraft(initialGoal?: string): { name: string; socialLink: string; goal: string }`
- Produces: `validateOrderDraft(draft): { valid: boolean; errors: { name?: string; socialLink?: string; goal?: string } }`
- Produces: `npm run test:order-popup`

- [ ] **Step 1: Write the failing test**

Create `src/app/order-draft.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createOrderDraft, validateOrderDraft } from "./order-draft.js";

test("createOrderDraft prefills the goal and starts other fields empty", () => {
  assert.deepEqual(createOrderDraft("1K Followers"), {
    name: "",
    socialLink: "",
    goal: "1K Followers",
  });
});

test("validateOrderDraft reports required field errors", () => {
  assert.deepEqual(validateOrderDraft(createOrderDraft()), {
    valid: false,
    errors: {
      name: "Enter your name.",
      socialLink: "Enter a social media page link.",
      goal: "Enter your goal.",
    },
  });
});

test("validateOrderDraft accepts a complete draft", () => {
  assert.deepEqual(
    validateOrderDraft({
      name: "Jane Doe",
      socialLink: "https://instagram.com/example",
      goal: "1K Likes",
    }),
    {
      valid: true,
      errors: {},
    },
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/app/order-draft.test.mjs`

Expected: FAIL because `src/app/order-draft.js` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `src/app/order-draft.js`:

```js
export function createOrderDraft(initialGoal = "") {
  return {
    name: "",
    socialLink: "",
    goal: initialGoal,
  };
}

export function validateOrderDraft(draft) {
  const errors = {};

  if (!draft.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!draft.socialLink.trim()) {
    errors.socialLink = "Enter a social media page link.";
  }

  if (!draft.goal.trim()) {
    errors.goal = "Enter your goal.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
```

- [ ] **Step 4: Add script and run green test**

Modify `package.json` scripts:

```json
"test:order-popup": "node --test src/app/order-draft.test.mjs"
```

Run: `npm run test:order-popup`

Expected: PASS.

---

### Task 2: Build The Order Popup Component

**Files:**
- Create: `src/app/order-popup.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `createOrderDraft(initialGoal?: string)` and `validateOrderDraft(draft)` from `src/app/order-draft.js`
- Produces: `OrderPopup({ initialGoal, triggerLabel, triggerClassName, triggerAriaLabel, children })`

- [ ] **Step 1: Create client component**

Create `src/app/order-popup.tsx`:

```tsx
"use client";

import { FormEvent, ReactNode, useEffect, useId, useState } from "react";
import { ArrowIcon } from "./arrow-icon";
import { createOrderDraft, validateOrderDraft } from "./order-draft";

type OrderDraft = {
  name: string;
  socialLink: string;
  goal: string;
};

type OrderErrors = {
  name?: string;
  socialLink?: string;
  goal?: string;
};

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
  const [errors, setErrors] = useState<OrderErrors>({});
  const [continued, setContinued] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraft(createOrderDraft(initialGoal));
    setErrors({});
    setContinued(false);
  }, [initialGoal, isOpen]);

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

  function updateField(field: keyof OrderDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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
        onClick={() => setIsOpen(true)}
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
                  Your order details are ready. Stripe Checkout will be added
                  in the next step so you can continue to secure payment.
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
                      onChange={(event) => updateField("name", event.target.value)}
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
                    <input
                      maxLength={120}
                      onChange={(event) => updateField("goal", event.target.value)}
                      placeholder="1K likes, 5K followers, 10K views"
                      type="text"
                      value={draft.goal}
                    />
                    {errors.goal && <small>{errors.goal}</small>}
                  </label>
                  <button type="submit">
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
```

- [ ] **Step 2: Add CSS**

Add modal and trigger styles to `src/app/globals.css` near the contact form styles:

```css
.order-popup-backdrop {
  align-items: center;
  background: rgba(2,10,20,.72);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: 200;
}

.order-popup {
  background: var(--navy);
  border: 1px solid rgba(127,255,212,.28);
  box-shadow: 0 24px 80px rgba(0,0,0,.34);
  color: white;
  max-width: 560px;
  padding: 34px;
  position: relative;
  width: min(100%, 560px);
}

.order-popup-close {
  align-items: center;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 24px;
  height: 38px;
  justify-content: center;
  position: absolute;
  right: 18px;
  top: 18px;
  width: 38px;
}

.order-popup-label {
  color: var(--aqua);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .18em;
  margin: 0 0 14px;
  text-transform: uppercase;
}

.order-popup h2 {
  font-family: var(--font-display), sans-serif;
  font-size: clamp(34px, 5vw, 52px);
  line-height: 1;
  margin: 0 42px 28px 0;
}

.order-popup-form {
  display: grid;
  gap: 20px;
}

.order-popup-form label {
  border-bottom: 1px solid rgba(255,255,255,.18);
  display: grid;
  gap: 8px;
  padding-bottom: 12px;
}

.order-popup-form label span {
  color: rgba(255,255,255,.55);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.order-popup-form input {
  background: transparent;
  border: 0;
  color: white;
  font: inherit;
  font-size: 16px;
  outline: 0;
  padding: 4px 0;
  width: 100%;
}

.order-popup-form input::placeholder {
  color: rgba(255,255,255,.28);
}

.order-popup-form small {
  color: #ff9d9d;
  font-size: 12px;
}

.order-popup-form button,
.order-popup-next-step button {
  align-items: center;
  background: var(--aqua);
  border: 0;
  color: var(--navy);
  cursor: pointer;
  display: inline-flex;
  font-size: 11px;
  font-weight: 800;
  gap: 18px;
  justify-content: center;
  letter-spacing: .1em;
  min-height: 48px;
  padding: 0 22px;
  text-transform: uppercase;
  width: fit-content;
}

.order-popup-form button svg {
  fill: none;
  height: 18px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.5;
  width: 18px;
}

.order-popup-next-step p:not(.order-popup-label) {
  color: rgba(255,255,255,.68);
  line-height: 1.7;
  margin: 0 0 24px;
}
```

- [ ] **Step 3: Run verification**

Run: `npm run lint`

Expected: PASS.

---

### Task 3: Wire Purchase CTAs To The Popup

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/packages/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `OrderPopup` from `src/app/order-popup.tsx`

- [ ] **Step 1: Replace purchase links on homepage**

In `src/app/page.tsx`, import `OrderPopup`. Replace homepage quick action `<Link href="/contact">` buttons with:

```tsx
<OrderPopup triggerClassName="action-button primary" initialGoal="1K Likes">
  <span>Get 1K likes now.</span>
  <ArrowIcon />
</OrderPopup>
```

Use goals `1K Followers` and `10K Views` for the other quick buttons.

- [ ] **Step 2: Replace package Subscribe buttons**

In `src/app/packages/page.tsx`, import `OrderPopup`. Replace each `Subscribe Now` `<Link href="/contact">` with:

```tsx
<OrderPopup
  triggerAriaLabel={`Subscribe to ${option.name}`}
  triggerClassName="package-subscribe-button"
  initialGoal={option.name}
>
  Subscribe Now
</OrderPopup>
```

Replace the package hero `Request a package` link with an `OrderPopup` using `initialGoal=""` and the existing visual class behavior.

- [ ] **Step 3: Replace About Contact CTA**

In `src/app/about/page.tsx`, keep `Explore packages` as a normal link. Replace `Contact us` with `OrderPopup` using `initialGoal=""` because it is a CTA button that starts customer action.

- [ ] **Step 4: Add button reset styles where needed**

Because `OrderPopup` triggers render as `<button>`, add CSS so `.action-button`, `.package-subscribe-button`, `.packages-hero-copy > button`, and `.about-cta button` visually match the existing links.

- [ ] **Step 5: Run verification**

Run:

```bash
npm run test:order-popup
npm run lint
npm run build
```

Expected: all commands exit 0.
