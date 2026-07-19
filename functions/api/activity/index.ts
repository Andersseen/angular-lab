import type { PagesFunction } from '@cloudflare/workers-types';
import { getAuthenticatedUserId } from '../_session';

interface Env {
  DB: D1Database;
}

interface ActivityPayload {
  days: unknown;
}

/** Practice days are only ever read backwards from today; see specs/engagement.md. */
const MAX_RETAINED_DAYS = 400;
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function unauthorized(): Response {
  return json({ error: 'Authentication required.' }, 401);
}

function validateDays(days: unknown): string | undefined {
  if (!Array.isArray(days)) {
    return 'days must be an array of YYYY-MM-DD strings.';
  }
  if (days.length > MAX_RETAINED_DAYS) {
    return `days must contain at most ${MAX_RETAINED_DAYS} entries.`;
  }
  if (!days.every((day) => typeof day === 'string' && DAY_PATTERN.test(day))) {
    return 'days must be an array of YYYY-MM-DD strings.';
  }
  return undefined;
}

async function listDays(env: Env, userId: string): Promise<string[]> {
  const { results } = await env.DB.prepare(
    `SELECT day FROM activity_days WHERE user_id = ? ORDER BY day DESC LIMIT ?`
  )
    .bind(userId, MAX_RETAINED_DAYS)
    .all<{ day: string }>();

  return (results ?? []).map((row) => row.day);
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return unauthorized();
    }

    return json({ days: await listDays(env, userId) });
  } catch (error) {
    console.error('Activity GET error:', error);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return unauthorized();
    }

    let payload: ActivityPayload;
    try {
      payload = (await request.json()) as ActivityPayload;
    } catch {
      return json({ error: 'Invalid JSON body.' }, 400);
    }

    const validationError = validateDays(payload.days);
    if (validationError) {
      return json({ error: validationError }, 400);
    }

    const days = [...new Set(payload.days as string[])];
    if (days.length > 0) {
      // Additive and idempotent: a day already recorded is left untouched.
      await env.DB.batch(
        days.map((day) =>
          env.DB
            .prepare(
              'INSERT OR IGNORE INTO activity_days (user_id, day) VALUES (?, ?)'
            )
            .bind(userId, day)
        )
      );

      // Keep a bounded window rather than a permanent audit log.
      await env.DB.prepare(
        `DELETE FROM activity_days
         WHERE user_id = ?
           AND day NOT IN (
             SELECT day FROM activity_days WHERE user_id = ? ORDER BY day DESC LIMIT ?
           )`
      )
        .bind(userId, userId, MAX_RETAINED_DAYS)
        .run();
    }

    return json({ days: await listDays(env, userId) });
  } catch (error) {
    console.error('Activity PUT error:', error);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};
