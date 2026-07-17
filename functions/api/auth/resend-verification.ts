import type { PagesFunction } from '@cloudflare/workers-types';
import { getAuthenticatedUserId } from '../_session';
import { checkRateLimit, tooManyRequests } from './_rate-limit';
import { generateToken, hashToken } from './_tokens';
import {
  isLocalRequest,
  requestOrigin,
  sendEmail,
  type EmailEnv,
} from './_email';

interface Env extends EmailEnv {
  DB: D1Database;
}

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

    const limit = await checkRateLimit(env, 'resend-verification', request, 5, 900);
    if (limit.limited) {
      return tooManyRequests(limit.retryAfterSeconds);
    }

    const user = await env.DB.prepare(
      'SELECT email, email_verified FROM users WHERE id = ?'
    )
      .bind(userId)
      .first<{ email: string; email_verified: number }>();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authenticated.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const responseBody: Record<string, unknown> = { ok: true };

    if (user.email_verified) {
      responseBody['alreadyVerified'] = true;
    } else {
      const token = generateToken();
      const tokenHash = await hashToken(token);
      const now = Date.now();

      await env.DB.prepare(
        `INSERT INTO email_verification_tokens (token_hash, user_id, expires_at, used, created_at)
         VALUES (?, ?, ?, 0, ?)`
      )
        .bind(tokenHash, userId, now + VERIFY_TTL_MS, now)
        .run();

      const link = `${requestOrigin(request)}/verify-email?token=${token}`;
      await sendEmail(env, {
        to: user.email,
        subject: 'Verify your Angular Lab email',
        text: `Confirm your email with this link (valid for 24 hours):\n${link}`,
      });

      if (isLocalRequest(request)) {
        responseBody['devLink'] = link;
      }
    }

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Resend-verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
