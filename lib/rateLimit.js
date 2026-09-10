// Simple fixed-window in-memory rate limiter for API routes.
//
// Scope: per-server-instance. On Vercel's serverless platform each warm
// lambda has its own window, so limits are approximate — still enough to
// blunt abuse (card-testing floods, scraping bursts). For hard guarantees,
// swap the store for Upstash Redis later; the call signature stays the same.
//
// Usage in a route handler:
//   const rl = rateLimit(request, { limit: 5, windowMs: 60_000 });
//   if (!rl.ok) return NextResponse.json({ error: "..." }, { status: 429, headers: retryAfter(rl) });
import { NextResponse } from "next/server";

const buckets = new Map(); // key -> { count, resetAt }

// Occasionally sweep expired buckets so the map can't grow unbounded.
const SWEEP_EVERY_MS = 5 * 60 * 1000;
let lastSweep = Date.now();

function sweep(now) {
  if (now - lastSweep < SWEEP_EVERY_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Fixed-window counter keyed by ip + bucket name.
export function rateLimit(request, { limit = 30, windowMs = 60_000, name = "default" }) {
  const now = Date.now();
  sweep(now);

  const key = `${name}:${clientIp(request)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { ok: false, retryAfterSec, resetAt: bucket.resetAt };
  }
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

// Standard 429 response with Retry-After, so well-behaved clients back off.
export function tooManyRequests(rl) {
  return NextResponse.json(
    { error: "Too many requests — please slow down and try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(rl.retryAfterSec),
        "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
      },
    }
  );
}
