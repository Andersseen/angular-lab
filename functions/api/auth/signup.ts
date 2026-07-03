import type { PagesFunction } from '@cloudflare/workers-types';
import { hashPassword, generateSessionId } from './_crypto';
import { setSessionCookie, SESSION_MAX_AGE_SECONDS } from './_cookies';

interface SignupBody {
  email?: string;
  password?: string;
  name?: string;
}

interface Env {
  DB: D1Database;
}

function validateInput(body: SignupBody): string | null {
  const email = body.email?.trim() ?? '';
  const password = body.password ?? '';
  const name = body.name?.trim() ?? '';

  if (!email || !password || !name) {
    return 'Email, password, and name are required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.';
  }

  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must be at least 8 characters and include a letter and a number.';
  }

  if (name.length < 2) {
    return 'Name must be at least 2 characters.';
  }

  return null;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as SignupBody;
    const validationError = validateInput(body);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const email = body.email!.trim().toLowerCase();
    const password = body.password!;
    const name = body.name!.trim();

    const existing = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    )
      .bind(email)
      .first<{ id: string }>();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Unable to create account. Please try again.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO users (id, email, name, password_hash, password_salt, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(userId, email, name, passwordHash, '', now, now)
      .run();

    const sessionId = generateSessionId();
    const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;

    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
    )
      .bind(sessionId, userId, expiresAt, now)
      .run();

    return new Response(
      JSON.stringify({
        user: { id: userId, email, name },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': setSessionCookie(request, sessionId, expiresAt),
        },
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
