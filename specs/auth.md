# Authentication Specification — Angular Lab

## Overview

Angular Lab supports two user states:

1. **Guest** — can browse missions, complete steps, and store progress locally. No account required.
2. **Authenticated user** — can access the dashboard and has cloud-synced progress.

Both states are free. Authentication exists to capture user data and enable future features.

## User Flows

### Sign up

1. Guest visits `/signup`.
2. Enters name, email, and password.
3. Submits the form.
4. Backend validates input, hashes password, creates user, creates session, sets cookie, and sends a verification email.
5. Frontend redirects to `/dashboard`. The account is usable immediately (verification is a soft-block).

### Log in

1. Guest or returning user visits `/login`.
2. Enters email and password.
3. Submits the form.
4. Backend verifies password, creates session, sets cookie.
5. Frontend redirects to `/dashboard`.

### Log out

1. Authenticated user clicks "Log out" in the shell or dashboard.
2. Backend deletes the current session and clears the cookie.
3. Frontend redirects to `/`.

### Log out everywhere

1. From dashboard settings, the user chooses "Log out of all devices".
2. Backend deletes **every** session for that user and clears the current cookie.
3. All other devices lose access on their next request.

### Password reset

1. From `/login`, the user follows "Forgot password?" to `/forgot-password`.
2. Enters their email and submits.
3. Backend **always** responds with the same generic confirmation (no account enumeration). If the email matches a user, it stores a one-time reset token (hashed, with expiry) and emails a link to `/reset-password?token=…`.
4. The user opens the link, enters a new password on `/reset-password`.
5. Backend validates the token and the new password, updates the password, marks the token used, and **invalidates all existing sessions** for that user.
6. The user logs in again with the new password.

### Email verification

1. On signup, the backend emails a link to `/verify-email?token=…`.
2. Until verified, the app shows a dismissible banner prompting the user to verify; access is **not** blocked (soft-block).
3. Opening the link marks the account verified.
4. The user can request a new verification email (rate limited) from the banner.

### Account deletion

1. From dashboard settings, the user chooses "Delete account" and confirms.
2. Backend deletes the user together with all their sessions, progress, and pending tokens, then clears the cookie.
3. The action is irreversible.

### Guest access

1. A visitor with no session cookie is considered a guest.
2. Guests see "Log in" in the shell.
3. Guests can access `/`, `/missions`, and `/mission/:id`.
4. Guests cannot access `/dashboard`; they are redirected to `/login`.

## Password Policy

- Minimum 8 characters.
- Must contain at least one letter and one number.
- The same policy applies to signup and to password reset.

## Session Policy

- Sessions expire after 7 days.
- Cookies are HTTP-only, Secure when served over HTTPS, SameSite=Lax, Path=/.
- Sessions are stored in the D1 `sessions` table and can be invalidated server-side.
- **Sliding expiry:** an active session is extended back to the full 7-day window (at most once per day) so returning users stay logged in.
- **Cleanup:** expired sessions are opportunistically deleted during login.
- A password reset and "log out everywhere" both delete all of a user's sessions.

## Rate Limiting

- Login, signup, password-reset requests, and verification resends are rate limited **per client IP** using a fixed window.
- The client IP comes from the `CF-Connecting-IP` header.
- Exceeding the limit returns **429** with a `Retry-After` header and a generic message.
- Counters live in the D1 `auth_rate_limits` table and expire with their window.

## Tokens

- Reset and verification tokens are random, single-use, and time-limited (reset: 1 hour; verification: 24 hours).
- Only a SHA-256 **hash** of each token is stored; the raw token exists only in the emailed link.
- Using a token marks it consumed; expired or used tokens are rejected with a generic message.

## Email Delivery

- Transactional email is sent through a provider-agnostic `sendEmail` seam.
- **Local/dev:** the message (including the action link) is logged; on `localhost` the reset/verification endpoints also return the link in the response so the flow can be exercised end to end without an email provider.
- **Production:** wire a real sender (Cloudflare Email Service) behind the same seam; verified sending domain + SPF/DKIM/DMARC required.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account, start session, send verification email |
| POST | `/api/auth/login` | Start session for existing user (rate limited) |
| POST | `/api/auth/logout` | End current session |
| POST | `/api/auth/logout-all` | End all sessions for the current user |
| GET | `/api/auth/me` | Return current user (with `emailVerified`) or null |
| POST | `/api/auth/request-reset` | Send a password-reset email (always 200; rate limited) |
| POST | `/api/auth/reset` | Set a new password from a reset token |
| POST | `/api/auth/verify-email` | Mark the account verified from a token |
| POST | `/api/auth/resend-verification` | Send a new verification email (rate limited) |
| POST | `/api/auth/delete-account` | Delete the current user and all their data |
| GET/PUT | `/api/progress` | Read/upsert mission progress (see `specs/progress.md`) |

## Error Handling

- Validation errors return 400 with a readable message.
- Duplicate email on signup returns 409 with a generic message.
- Invalid credentials return 401 with a generic message.
- Rate-limited requests return 429 with a generic message and `Retry-After`.
- Password-reset requests never reveal whether an email exists.
- Server errors return 500 with a generic message.

## Data Model

See `migrations/0001_init.sql` (users, sessions) and `migrations/0004_auth_hardening.sql`
(`email_verified` column, `password_reset_tokens`, `email_verification_tokens`,
`auth_rate_limits`) for the canonical schema.

## Future Enhancements

- Real production email provider wiring (Cloudflare Email Service).
- Newsletter subscription preference.
- Social login (Google/GitHub).
