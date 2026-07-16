import type { D1Database } from '@cloudflare/workers-types';
import { getSessionId } from './auth/_cookies';

/**
 * Resolves the authenticated user id from the session cookie.
 * Returns undefined when there is no valid (unexpired) session.
 */
export async function getAuthenticatedUserId(
  request: Request,
  env: { DB: D1Database }
): Promise<string | undefined> {
  const sessionId = getSessionId(request);
  if (!sessionId) {
    return undefined;
  }

  const row = await env.DB.prepare(
    `SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?`
  )
    .bind(sessionId, Date.now())
    .first<{ user_id: string }>();

  return row?.user_id;
}
