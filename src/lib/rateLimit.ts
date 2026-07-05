import { supabaseAdmin } from "@/lib/supabaseAdmin"

export function clientKey(req: Request, scope: string): string {
  const xff = req.headers.get("x-forwarded-for") || ""
  const ip = xff.split(",")[0].trim() || "unknown"
  return `${scope}:${ip}`
}

// In-memory limiter (per serverless instance). Fine for low-sensitivity, high-volume
// endpoints like order submission where the real protection is server-side revalidation.
type Bucket = { count: number; resetAt: number }
const store = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucket = store.get(key)
  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count++
  return { ok: true, retryAfter: 0 }
}

// Durable, atomic limiter backed by Supabase, shared across ALL serverless instances.
// Used for auth endpoints (login / register / admin login) where cross-instance
// brute-force protection matters. Fails OPEN: if the store is unreachable, requests
// are allowed so a limiter outage can never lock people out.
export async function rateLimitDurable(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; retryAfter: number }> {
  try {
    const { data, error } = await supabaseAdmin.rpc("rate_limit_hit", {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    })
    if (error || !data) return { ok: true, retryAfter: 0 }
    const row = data as { ok: boolean; retry_after: number }
    return { ok: Boolean(row.ok), retryAfter: Number(row.retry_after ?? 0) }
  } catch {
    return { ok: true, retryAfter: 0 }
  }
}