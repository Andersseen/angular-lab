import type { PagesFunction } from '@cloudflare/workers-types';
import { checkRateLimit, tooManyRequests } from './_rate-limit';
import { generateToken, hashToken } from './_tokens';
import {
  isLocalRequest,
  requestOrigin,
  sendEmail,
  type EmailEnv,
} from './_email';

interface RequestResetBody {
  email?: string;
}

interface Env extends EmailEnv {
  DB: D1Database;
}

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const limit = await checkRateLimit(env, 'request-reset', request, 5, 900);
  if (limit.limited) {
    return tooManyRequests(limit.retryAfterSeconds);
  }

  // Always the same response, whether or not the email exists (no enumeration).
  const genericBody: Record<string, unknown> = {
    ok: true,
    message: 'If that email is registered, a reset link is on its way.',
  };

  try {
    const body = (await request.json()) as RequestResetBody;
    const email = body.email?.trim().toLowerCase() ?? '';

    if (email) {
      const user = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
        .bind(email)
        .first<{ id: string }>();

      if (user) {
        const token = generateToken();
        const tokenHash = await hashToken(token);
        const now = Date.now();

        await env.DB.prepare(
          `INSERT INTO password_reset_tokens (token_hash, user_id, expires_at, used, created_at)
           VALUES (?, ?, ?, 0, ?)`
        )
          .bind(tokenHash, user.id, now + RESET_TTL_MS, now)
          .run();

        const link = `${requestOrigin(request)}/reset-password?token=${token}`;
        await sendEmail(env, {
          to: email,
          subject: 'Reset your Angular Lab password',
          text: `Reset your password with this link (valid for 1 hour):\n${link}\n\nIf you did not request this, you can ignore this email.`,
        });

        // On localhost only, echo the link so the flow is testable end to end.
        if (isLocalRequest(request)) {
          genericBody['devLink'] = link;
        }
      }
    }

    return new Response(JSON.stringify(genericBody), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Request-reset error:', error);
    // Still generic to avoid leaking anything.
    return new Response(JSON.stringify(genericBody), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
