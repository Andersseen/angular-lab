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

    await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?')
      .bind(userId)
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearSessionCookie(request),
      },
    });
  } catch (error) {
    console.error('Logout-all error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
