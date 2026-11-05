# Deployment

The app is a standard Next.js server app (dynamic admin, API routes, request-time DB reads). Static export is **not** possible.
Any Node host works (Vercel, Railway, Render, a VPS with Node + a reverse proxy).

## Checklist
1. **Database** — create PostgreSQL, set `DATABASE_URL` (DATABASE_SETUP.md). On serverless hosts use a pooled connection string.
2. **Secrets** — set in the host's environment manager (never in git):
   `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `AUTH_SECRET` (≥32 random chars), contact `NEXT_PUBLIC_*`, `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`.
   In production the app throws if `AUTH_SECRET` is missing and returns 503 on forms if `DATABASE_URL` is missing — it will not fake success.
   `NEXT_PUBLIC_*` values are baked in at build time: change them → rebuild.
3. **Build & migrate** — `npm ci && npm run build`, then `npm run db:migrate` (run from CI or locally against the production URL).
4. **First admin** — `ADMIN_EMAIL=… ADMIN_NAME=… npm run admin:create` (ADMIN_SETUP.md).
5. **Domain & HTTPS** — point DNS, enable TLS (automatic on managed hosts; Let's Encrypt/Caddy on a VPS). Cookies are `Secure` in production, so HTTPS is mandatory. Make sure the proxy forwards `X-Forwarded-For` (used for rate limiting) and `Host`.
6. **Configure** — in `/admin`: add cities/areas, set coverage, activate confirmed services.
7. **Email** — verify the sending domain with Resend, submit a test request, confirm the `notifications` table in the database has a row with status `sent` (there is no admin screen for it yet) and that the email arrived. Until then the log honestly says `skipped_not_configured`.
8. **Smoke test on production** — submit a care request and a contact message, see them in `/admin/leads` and `/admin/messages`; confirm `/admin` redirects when signed out.
9. **Monitoring** — host uptime check on `/`, error logs (server logs print `[api]` errors), DB backups with a tested restore, alert on 5xx. Add Sentry or similar if wanted (not included).

## Operational notes
* Rate limiting and idempotency live in the database, so multiple instances behave consistently.
* `node_modules/next/dist/docs/01-app/02-guides/self-hosting.md` covers self-hosting details (caching, reverse proxy).
* `.env.local` is for local use only and is git-ignored.
