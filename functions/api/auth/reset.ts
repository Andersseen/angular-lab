import type { PagesFunction } from '@cloudflare/workers-types';
import { hashPassword } from './_crypto';
import { hashToken } from './_tokens';
import { validatePassword } from './_validation';

interface ResetBody {
  token?: string;
  password?: string;
}

interface Env {
  DB: D1Database;
}

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as ResetBody;
    const token = body.token?.trim() ?? '';
    const password = body.password ?? '';

    if (!token) {
      return badRequest('This reset link is invalid or has expired.');
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return badRequest(passwordError);
    }

    const tokenHash = await hashToken(token);
    const now = Date.now();

    const row = await env.DB.prepare(
      `SELECT user_id FROM password_reset_tokens
       WHERE token_hash = ? AND used = 0 AND expires_at > ?`
    )
      .bind(tokenHash, now)
      .first<{ user_id: string }>();

    if (!row) {
      return badRequest('This reset link is invalid or has expired.');
    }

    const passwordHash = await hashPassword(password);

    // Update the password, consume the token, and invalidate every session
    // so a compromised session cannot survive a reset.
    await env.DB.batch([
      env.DB.prepare(
        'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?'
      ).bind(passwordHash, now, row.user_id),
      env.DB.prepare(
        'UPDATE password_reset_tokens SET used = 1 WHERE token_hash = ?'
      ).bind(tokenHash),
      env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(row.user_id),
    ]);

    return new Response(
      JSON.stringify({ ok: true, message: 'Your password has been updated.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Reset error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
