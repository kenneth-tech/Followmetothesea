# Admin Email Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send admin notification emails for contact inquiries and for paid Stripe package checkouts.

**Architecture:** Keep the current Supabase-first contact and checkout recording flow. Add a shared Resend REST email helper, send contact notifications after contact inserts, and add a Stripe webhook that verifies signatures, marks paid orders in Supabase, and sends paid-order notifications.

**Tech Stack:** Next.js 16 App Router route handlers, Stripe Node SDK, Supabase JS, Resend REST API via `fetch`, Node test runner.

## Global Constraints

- Do not expose secret keys to the client; all notification keys stay server-side.
- Paid package notifications must be sent only from verified Stripe webhooks when `payment_status` is `paid`.
- Contact inquiry notification failure must not lose the saved Supabase inquiry.
- Stripe webhook signature verification must use the raw request body.

---

### Task 1: Notification Email Helper

**Files:**
- Create: `src/app/notification-email.ts`
- Create: `src/app/notification-email.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `getNotificationEmailConfig(env?: Record<string, string | undefined>): NotificationEmailConfig | null`
- Produces: `buildContactNotificationText(draft: ContactInquiryDraft, submittedAt?: Date): string`
- Produces: `buildPaidOrderNotificationText(order: PaidOrderNotificationDetails, paidAt?: Date): string`
- Produces: `sendAdminNotification(message: AdminNotificationMessage): Promise<AdminNotificationResult>`

- [ ] **Step 1: Write tests for env config and email text**
- [ ] **Step 2: Run tests and verify they fail because the helper does not exist**
- [ ] **Step 3: Implement helper using Resend REST API**
- [ ] **Step 4: Run tests and verify they pass**

### Task 2: Contact Route Notification

**Files:**
- Modify: `src/app/api/contact/route.ts`

**Interfaces:**
- Consumes: `sendContactInquiryNotification(draft: ContactInquiryDraft): Promise<AdminNotificationResult>`

- [ ] **Step 1: Call notification helper after `recordContactInquiry(draft)`**
- [ ] **Step 2: Log notification failures without returning a form error**

### Task 3: Paid Stripe Webhook

**Files:**
- Modify: `src/app/order-storage.ts`
- Modify: `src/app/order-storage.test.ts`
- Create: `src/app/api/stripe/webhook/route.ts`

**Interfaces:**
- Produces: `markCheckoutSessionPaid(stripeCheckoutSessionId: string, stripePaymentIntentId: string | null): Promise<PaidOrderNotificationDetails | null>`
- Consumes: `sendPaidOrderNotification(order: PaidOrderNotificationDetails, idempotencyKey?: string): Promise<AdminNotificationResult>`

- [ ] **Step 1: Test paid-order update payload helpers**
- [ ] **Step 2: Implement order status types and update helper**
- [ ] **Step 3: Add webhook route using `request.text()` and `stripe.webhooks.constructEvent`**
- [ ] **Step 4: Send notification only for `checkout.session.completed` where `payment_status === "paid"`**

### Task 4: Verification

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Include notification tests in the existing test command**
- [ ] **Step 2: Run `npm run test:order-popup`**
- [ ] **Step 3: Run `npm run lint`**
- [ ] **Step 4: Run `npm run build`**
