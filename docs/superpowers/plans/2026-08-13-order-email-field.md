# Order Email Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collect customer email in the order popup, pass it through checkout, store it with orders, and include it in paid package admin notifications.

**Architecture:** Extend the existing `OrderDraft` and `CheckoutOrderDraft` types with `email`. Add required email validation in client and server helpers, submit the field through the existing checkout API, include it in Stripe Checkout/metadata, persist it to Supabase, and render it in paid order notification emails.

**Tech Stack:** Next.js 16 App Router, React 19, Stripe Checkout, Supabase JS, Node test runner.

## Global Constraints

- Keep the email field server-validated; client validation is not trusted alone.
- Save customer email in Stripe metadata and Supabase orders.
- Use Stripe `customer_email` to prefill Checkout.
- Existing Supabase rows require the new column to be nullable or added before stricter constraints.

---

### Task 1: Tests

**Files:**
- Modify: `src/app/order-draft.test.ts`
- Modify: `src/app/order-checkout.test.ts`
- Modify: `src/app/order-storage.test.ts`
- Modify: `src/app/notification-email.test.ts`

- [ ] **Step 1:** Add tests that expect email in draft creation, validation, Stripe metadata, Supabase order record, and paid notification HTML/text.
- [ ] **Step 2:** Run `npm run test:order-popup` and confirm failures for missing email behavior.

### Task 2: Implementation

**Files:**
- Modify: `src/app/order-draft.ts`
- Modify: `src/app/order-popup.tsx`
- Modify: `src/app/order-checkout.ts`
- Modify: `src/app/api/checkout/route.ts`
- Modify: `src/app/order-storage.ts`
- Modify: `src/app/notification-email.ts`
- Modify: `docs/supabase-orders.sql`

- [ ] **Step 1:** Extend draft/order types with `email`.
- [ ] **Step 2:** Add popup email input under name.
- [ ] **Step 3:** Validate email format in client and server helpers.
- [ ] **Step 4:** Pass email to Stripe `customer_email` and metadata.
- [ ] **Step 5:** Save and retrieve `customer_email` from Supabase.
- [ ] **Step 6:** Include customer email in paid order email templates.

### Task 3: Verification

- [ ] **Step 1:** Run `npm run test:order-popup`.
- [ ] **Step 2:** Run `npm run lint`.
- [ ] **Step 3:** Run `npm run build`.
