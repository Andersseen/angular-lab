import type { PagesFunction } from '@cloudflare/workers-types';
import { getAuthenticatedUserId } from '../_session';
import { clearSessionCookie } from './_cookies';

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Not authenticated.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Explicit cascade — D1 does not enforce foreign keys by default, so we
    // remove every owned row before the user.
    await env.DB.batch([
      env.DB.prepare('DELETE FROM progress WHERE user_id = ?').bind(userId),
      env.DB.prepare('DELETE FROM activity_days WHERE user_id = ?').bind(userId),
      env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId),
      env.DB
        .prepare('DELETE FROM password_reset_tokens WHERE user_id = ?')
        .bind(userId),
      env.DB
        .prepare('DELETE FROM email_verification_tokens WHERE user_id = ?')
        .bind(userId),
      env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearSessionCookie(request),
      },
    });
  } catch (error) {
    console.error('Delete-account error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
