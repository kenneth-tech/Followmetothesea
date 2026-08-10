# Order Popup Design

## Goal

Add a first-step order popup that opens from purchase-oriented CTAs across the site. The popup gathers the minimum information needed before a future Stripe Checkout step:

- Name
- Link to social media page
- Goal, such as `1K likes`, `5K followers`, or `10K views`

This phase does not create Stripe Checkout sessions yet. It prepares the interaction and data shape so Stripe can be added next.

## Scope

In scope:

- Create a reusable client-side order popup component.
- Open the popup from purchase CTAs, including `Subscribe Now` and homepage quick-action buttons.
- Prefill the `Goal` field when a CTA implies a specific package or target.
- Validate that all three fields are filled before continuing.
- Show a clear placeholder next step after Continue, such as payment setup coming next.
- Keep the existing visual system: dark navy panel, aqua primary action, square-edged controls.

Out of scope for this phase:

- Stripe Checkout session creation.
- Payment confirmation webhooks.
- Order emails.
- Storing orders in a database.
- Collecting or displaying bank details.

## User Flow

1. User clicks a purchase CTA.
2. A modal popup opens over the current page.
3. If the CTA has a known package, the `Goal` field is prefilled.
4. User enters name, social media page link, and goal.
5. User clicks Continue.
6. The popup validates required fields.
7. For this phase, the popup shows a payment placeholder state confirming the form is ready for the next Stripe step.

## CTA Routing

Purchase-oriented CTAs should open the popup instead of navigating directly to `/contact`:

- Homepage quick actions:
  - `Get 1K likes now.`
  - `Get 1K followers now.`
  - `Get 10K views now.`
- Package page:
  - `Subscribe Now` buttons, prefilled with the selected package name.
  - `Request a package`, with an empty or generic goal.
- Other CTAs can remain as navigation if they are informational, such as `Explore packages` or `See all packages`.

## Component Design

Add a reusable client component named `OrderPopup`, responsible for:

- Managing open and close state.
- Rendering the modal shell and form.
- Receiving optional prefill data.
- Validating required fields.
- Showing the post-Continue placeholder state.

The popup should be triggered from client components that wrap or replace current CTA links. Since several current pages are server components, create a small client wrapper for order CTAs rather than converting entire pages to client components.

## Data Shape

The popup should hold this local state:

```ts
type OrderDraft = {
  name: string;
  socialLink: string;
  goal: string;
};
```

Future Stripe integration can pass this draft into an API route that creates a Checkout Session and stores the order metadata.

## Validation

Validation for this phase is intentionally simple:

- `name` must not be empty.
- `socialLink` must not be empty.
- `goal` must not be empty.

The social link field should use `type="url"` so customers provide a usable social page URL before continuing.

## Accessibility

- Modal uses `role="dialog"` and `aria-modal="true"`.
- Close button has an accessible label.
- Inputs have visible labels.
- Continue button remains keyboard accessible.
- Escape key closes the modal.

## Testing And Verification

Minimum verification:

- Lint passes.
- Popup opens from each purchase CTA.
- Package-specific CTAs prefill the correct goal.
- Empty required fields prevent Continue.
- Valid fields show the placeholder next step.
- Existing informational links still navigate normally.
