# Security Policy

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report it privately through GitHub Security Advisories:

👉 **[Report a vulnerability](https://github.com/Andersseen/angular-lab/security/advisories/new)**

Please include what you can — the affected endpoint or page, the steps to reproduce, and what an
attacker could achieve. A proof of concept is helpful but not required.

You can expect an acknowledgement within a few days. This is a small, self-funded project: there
is no bug bounty, but every valid report gets credited in the fix unless you would rather stay
anonymous.

## Supported versions

Only the currently deployed `main` branch is supported. There are no maintained release branches.

## What is in scope

The parts of Angular Lab that hold or move real data:

- The auth endpoints under `functions/api/auth/` — signup, login, logout, password reset, email
  verification, account deletion.
- Session handling: opaque session IDs in Cloudflare D1, delivered as HTTP-only cookies.
- The progress and activity sync endpoints (`functions/api/progress/`, `functions/api/activity/`).
- The D1 schema and migrations in `migrations/`.
- The playground sandbox — in particular, any way for learner code to escape the iframe and reach
  the app's origin, cookies or storage.

## What is not in scope

- **Code you write in the playground running in your own browser.** That is the entire point of
  the feature. It executes in an iframe with `allow-scripts` and deliberately *without*
  `allow-same-origin`, so it has no access to the app's origin, cookies or `localStorage`. A
  report needs to demonstrate escaping that boundary, not just running JavaScript inside it.
- Missing rate limits on endpoints that carry no secret and mutate nothing.
- Findings from automated scanners with no demonstrated impact.
- Vulnerabilities in Cloudflare's platform itself — report those to
  [Cloudflare](https://www.cloudflare.com/disclosure/).

## Security design notes

For reviewers, the relevant decisions are documented rather than implied:

- Passwords are hashed with Web Crypto **PBKDF2-SHA256**; plaintext is never stored or logged.
- Sessions are **opaque random IDs** stored server-side in D1 — not JWTs — so revocation
  ("log out everywhere") is immediate and real.
- Session cookies are `HttpOnly`, `Secure` and `SameSite`, with sliding expiry.
- Password-reset and email-verification tokens are **single-use** rows in D1 with an expiry.
- Login, signup, reset and resend are rate-limited **per IP** in D1.
- Email delivery is a provider-agnostic seam; in development the link is logged rather than sent.
  No provider is wired yet, which is a deliberate pre-launch gap recorded in `context.md`
  Decision 12.

The full behavioral contract lives in [`specs/auth.md`](specs/auth.md).
