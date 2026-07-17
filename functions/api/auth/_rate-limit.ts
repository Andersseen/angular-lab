import type { D1Database } from '@cloudflare/workers-types';

/** Best-effort client IP, from Cloudflare's connecting-IP header. */
export function clientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

export interface RateLimitResult {
  readonly limited: boolean;
  readonly retryAfterSeconds: number;
}

/**
 * Fixed-window per-IP rate limit backed by D1. Counts requests for an
 * `action` within a `windowSeconds` window and reports `limited` once the
 * count exceeds `max`. Buckets expire with their window and are cleaned up
 * opportunistically.
 */
export async function checkRateLimit(
  env: { DB: D1Database },
  action: string,
  request: Request,
  max: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowIndex = Math.floor(now / windowMs);
  const bucket = `${action}:${clientIp(request)}:${windowIndex}`;
  const expiresAt = (windowIndex + 1) * windowMs;

  await env.DB.prepare(
    `INSERT INTO auth_rate_limits (bucket, count, expires_at)
     VALUES (?, 1, ?)
     ON CONFLICT(bucket) DO UPDATE SET count = count + 1`
  )
    .bind(bucket, expiresAt)
    .run();

  const row = await env.DB.prepare(
    'SELECT count FROM auth_rate_limits WHERE bucket = ?'
  )
    .bind(bucket)
    .first<{ count: number }>();

  // Opportunistic cleanup so the table cannot grow unbounded.
  await env.DB.prepare('DELETE FROM auth_rate_limits WHERE expires_at < ?')
    .bind(now)
    .run();

  return {
    limited: (row?.count ?? 1) > max,
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAt - now) / 1000)),
  };
}

/** Standard 429 response with a Retry-After header. */
export function tooManyRequests(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}
