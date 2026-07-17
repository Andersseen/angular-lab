import type { PagesFunction } from '@cloudflare/workers-types';
import { hashToken } from './_tokens';

interface VerifyBody {
  token?: string;
}

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as VerifyBody;
    const token = body.token?.trim() ?? '';

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'This verification link is invalid or has expired.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tokenHash = await hashToken(token);
    const now = Date.now();

    const row = await env.DB.prepare(
      `SELECT user_id FROM email_verification_tokens
       WHERE token_hash = ? AND used = 0 AND expires_at > ?`
    )
      .bind(tokenHash, now)
      .first<{ user_id: string }>();

    if (!row) {
      return new Response(
        JSON.stringify({ error: 'This verification link is invalid or has expired.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await env.DB.batch([
      env.DB.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').bind(
        row.user_id
      ),
      env.DB.prepare(
        'UPDATE email_verification_tokens SET used = 1 WHERE token_hash = ?'
      ).bind(tokenHash),
    ]);

    return new Response(
      JSON.stringify({ ok: true, message: 'Your email is verified.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Verify-email error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
