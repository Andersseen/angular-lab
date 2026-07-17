/**
 * One-time token helpers for password reset and email verification.
 * The raw token travels only in the emailed link; the database stores its
 * SHA-256 hash so a database leak cannot be used to reset accounts.
 */

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** A 256-bit random token as a hex string. */
export function generateToken(): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

/** SHA-256 hash of a token, hex encoded — what we store and look up by. */
export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}
