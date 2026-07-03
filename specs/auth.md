# Authentication Specification — Angular Lab

## Overview

Angular Lab supports two user states:

1. **Guest** — can browse missions, complete steps, and store progress locally. No account required.
2. **Authenticated user** — can access the dashboard and will eventually have cloud-synced progress, newsletter options, and course access.

Both states are free. Authentication exists to capture user data and enable future features.

## User Flows

### Sign up

1. Guest visits `/signup`.
2. Enters name, email, and password.
3. Submits the form.
4. Backend validates input, hashes password, creates user, creates session, sets cookie.
5. Frontend redirects to `/dashboard`.

### Log in

1. Guest or returning user visits `/login`.
2. Enters email and password.
3. Submits the form.
4. Backend verifies password, creates session, sets cookie.
5. Frontend redirects to `/dashboard`.

### Log out

1. Authenticated user clicks "Log out" in the shell or dashboard.
2. Backend deletes session and clears cookie.
3. Frontend redirects to `/`.

### Guest access

1. A visitor with no session cookie is considered a guest.
2. Guests see "Log in" in the shell.
3. Guests can access `/`, `/missions`, and `/mission/:id`.
4. Guests cannot access `/dashboard`; they are redirected to `/login`.

## Password Policy

- Minimum 8 characters.
- Must contain at least one letter and one number.

## Session Policy

- Sessions expire after 7 days.
- Cookies are HTTP-only, Secure when served over HTTPS, SameSite=Lax, Path=/.
- Sessions are stored in the D1 `sessions` table and can be invalidated server-side.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account and start session |
| POST | `/api/auth/login` | Start session for existing user |
| POST | `/api/auth/logout` | End current session |
| GET | `/api/auth/me` | Return current user or null |

## Error Handling

- Validation errors return 400 with a readable message.
- Duplicate email on signup returns 409 with a generic message.
- Invalid credentials return 401 with a generic message.
- Server errors return 500 with a generic message.

## Data Model

See `migrations/0001_init.sql` for the canonical schema.

## Future Enhancements

- Email verification.
- Password reset.
- Cloud sync of mission progress.
- Newsletter subscription preference.
- Social login (Google/GitHub).
