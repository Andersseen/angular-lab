/**
 * Provider-agnostic transactional email seam.
 *
 * Local/dev: the message is logged, and `isLocalRequest` lets endpoints echo
 * the action link back in the response so the flow is testable without an
 * email provider.
 *
 * Production: wire a real sender (Cloudflare Email Service) inside `sendEmail`,
 * gated on the appropriate binding/secret. See specs/auth.md ("Email Delivery").
 */

export interface EmailMessage {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

export interface EmailEnv {
  /** Optional "from" address for a configured production sender. */
  readonly EMAIL_FROM?: string;
}

export async function sendEmail(
  env: EmailEnv,
  message: EmailMessage
): Promise<void> {
  // Production sender goes here (Cloudflare Email Service), gated on its
  // binding/secret. Until configured, we log so local flows work end to end.
  console.log(
    `[email] to=${message.to} subject="${message.subject}"\n${message.text}`
  );
}

/** True when the request is served from localhost (local dev / E2E). */
export function isLocalRequest(request: Request): boolean {
  const host = new URL(request.url).hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

/** Absolute origin of the current request, for building action links. */
export function requestOrigin(request: Request): string {
  return new URL(request.url).origin;
}
