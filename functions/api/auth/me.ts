import type { PagesFunction } from '@cloudflare/workers-types';
import {
  getSessionId,
  setSessionCookie,
  SESSION_MAX_AGE_SECONDS,
} from './_cookies';

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const sessionId = getSessionId(request);
    if (!sessionId) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }

    const now = Date.now();
    const row = await env.DB.prepare(
      `SELECT u.id, u.email, u.name, u.email_verified, s.expires_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > ?`
    )
      .bind(sessionId, now)
      .first<{
        id: string;
        email: string;
        name: string;
        email_verified: number;
        expires_at: number;
      }>();

    if (!row) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    });

    // Sliding expiry: once a session has aged more than a day, extend it back
    // to the full window so active users stay signed in (at most one write/day).
    const fullWindowMs = SESSION_MAX_AGE_SECONDS * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (row.expires_at - now < fullWindowMs - oneDayMs) {
      const newExpiresAt = now + fullWindowMs;
      await env.DB.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?')
        .bind(newExpiresAt, sessionId)
        .run();
      headers.append(
        'Set-Cookie',
        setSessionCookie(request, sessionId, newExpiresAt)
      );
    }

    return new Response(
      JSON.stringify({
        user: {
          id: row.id,
          email: row.email,
          name: row.name,
          emailVerified: row.email_verified === 1,
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Me error:', error);
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
};
