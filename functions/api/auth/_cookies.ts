const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function isSecure(request: Request): boolean {
  const url = new URL(request.url);
  return url.protocol === 'https:';
}

export function setSessionCookie(
  request: Request,
  sessionId: string,
  expiresAt: number
): string {
  const maxAge = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  const secure = isSecure(request) ? 'Secure;' : '';
  return `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; ${secure} SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie(request: Request): string {
  const secure = isSecure(request) ? 'Secure;' : '';
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; ${secure} SameSite=Lax; Max-Age=0`;
}

export function getSessionId(request: Request): string | undefined {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === SESSION_COOKIE && value) {
      return value;
    }
  }
  return undefined;
}

export { SESSION_MAX_AGE_SECONDS };
