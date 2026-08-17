import assert from "node:assert/strict";
import test from "node:test";

import { createRateLimiter, getClientIp } from "./rate-limit.ts";

test("createRateLimiter allows requests until the configured limit", () => {
  const limiter = createRateLimiter({
    limit: 2,
    now: () => 1_000,
    windowMs: 60_000,
  });

  assert.deepEqual(limiter.check("contact:127.0.0.1"), {
    allowed: true,
    limit: 2,
    remaining: 1,
    retryAfterSeconds: 0,
  });
  assert.deepEqual(limiter.check("contact:127.0.0.1"), {
    allowed: true,
    limit: 2,
    remaining: 0,
    retryAfterSeconds: 0,
  });
  assert.deepEqual(limiter.check("contact:127.0.0.1"), {
    allowed: false,
    limit: 2,
    remaining: 0,
    retryAfterSeconds: 60,
  });
});

test("createRateLimiter resets after the configured window", () => {
  let now = 1_000;
  const limiter = createRateLimiter({
    limit: 1,
    now: () => now,
    windowMs: 60_000,
  });

  assert.equal(limiter.check("checkout:127.0.0.1").allowed, true);
  assert.equal(limiter.check("checkout:127.0.0.1").allowed, false);

  now = 61_001;

  assert.deepEqual(limiter.check("checkout:127.0.0.1"), {
    allowed: true,
    limit: 1,
    remaining: 0,
    retryAfterSeconds: 0,
  });
});

test("getClientIp reads the first forwarded IP address", () => {
  const request = new Request("https://www.followmetothesea.com/api/contact", {
    headers: {
      "x-forwarded-for": "203.0.113.10, 198.51.100.20",
    },
  });

  assert.equal(getClientIp(request), "203.0.113.10");
});
