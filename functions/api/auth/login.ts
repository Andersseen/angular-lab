import type { PagesFunction } from '@cloudflare/workers-types';
import { verifyPassword, generateSessionId } from './_crypto';
import { setSessionCookie, SESSION_MAX_AGE_SECONDS } from './_cookies';

interface LoginBody {
  email?: string;
  password?: string;
}

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await env.DB.prepare(
      'SELECT id, email, name, password_hash FROM users WHERE email = ?'
    )
      .bind(email)
      .first<{ id: string; email: string; name: string; password_hash: string }>();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sessionId = generateSessionId();
    const now = Date.now();
    const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;

    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
    )
      .bind(sessionId, user.id, expiresAt, now)
      .run();

    return new Response(
      JSON.stringify({
        user: { id: user.id, email: user.email, name: user.name },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': setSessionCookie(request, sessionId, expiresAt),
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
