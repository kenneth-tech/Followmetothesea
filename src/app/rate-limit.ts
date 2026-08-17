export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

type RateLimitOptions = {
  limit: number;
  now?: () => number;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

export const CONTACT_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
};

export const CHECKOUT_RATE_LIMIT = {
  limit: 10,
  windowMs: 10 * 60 * 1000,
};

export function createRateLimiter({
  limit,
  now = Date.now,
  windowMs,
}: RateLimitOptions) {
  const buckets = new Map<string, RateLimitBucket>();

  return {
    check(key: string): RateLimitResult {
      const currentTime = now();
      const existingBucket = buckets.get(key);
      const bucket =
        existingBucket && existingBucket.resetAt > currentTime
          ? existingBucket
          : { count: 0, resetAt: currentTime + windowMs };

      if (bucket.count >= limit) {
        buckets.set(key, bucket);
        return {
          allowed: false,
          limit,
          remaining: 0,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((bucket.resetAt - currentTime) / 1000),
          ),
        };
      }

      bucket.count += 1;
      buckets.set(key, bucket);

      return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - bucket.count),
        retryAfterSeconds: 0,
      };
    },
  };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function buildRateLimitedResponse(result: RateLimitResult) {
  return Response.json(
    { error: "Too many requests. Please try again shortly." },
    {
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
      },
      status: 429,
    },
  );
}

export const contactRateLimiter = createRateLimiter(CONTACT_RATE_LIMIT);
export const checkoutRateLimiter = createRateLimiter(CHECKOUT_RATE_LIMIT);
