import type { PagesFunction } from '@cloudflare/workers-types';
import { hashPassword, generateSessionId } from './_crypto';
import { setSessionCookie, SESSION_MAX_AGE_SECONDS } from './_cookies';
import { checkRateLimit, tooManyRequests } from './_rate-limit';
import { generateToken, hashToken } from './_tokens';
import {
  isLocalRequest,
  requestOrigin,
  sendEmail,
  type EmailEnv,
} from './_email';

interface SignupBody {
  email?: string;
  password?: string;
  name?: string;
}

interface Env extends EmailEnv {
  DB: D1Database;
}

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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
    const limit = await checkRateLimit(env, 'signup', request, 5, 900);
    if (limit.limited) {
      return tooManyRequests(limit.retryAfterSeconds);
    }

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

    // Send an email-verification link. Access is not blocked until verified.
    const verifyToken = generateToken();
    const verifyHash = await hashToken(verifyToken);
    await env.DB.prepare(
      `INSERT INTO email_verification_tokens (token_hash, user_id, expires_at, used, created_at)
       VALUES (?, ?, ?, 0, ?)`
    )
      .bind(verifyHash, userId, now + VERIFY_TTL_MS, now)
      .run();

    const verifyLink = `${requestOrigin(request)}/verify-email?token=${verifyToken}`;
    await sendEmail(env, {
      to: email,
      subject: 'Verify your Angular Lab email',
      text: `Welcome to Angular Lab! Confirm your email with this link (valid for 24 hours):\n${verifyLink}`,
    });

    const responseBody: Record<string, unknown> = {
      user: { id: userId, email, name, emailVerified: false },
    };
    if (isLocalRequest(request)) {
      responseBody['devLink'] = verifyLink;
    }

    return new Response(JSON.stringify(responseBody), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setSessionCookie(request, sessionId, expiresAt),
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
