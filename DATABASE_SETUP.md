# Database setup

**Engine:** PostgreSQL (production-grade, transactional, constraints/indexes, widely hosted). ORM: Drizzle.
Schema: `lib/db/schema.ts`; migrations: `drizzle/` (generated SQL, committed).

## Local development
No setup. With no `DATABASE_URL`, the app starts an embedded Postgres (PGlite) in `./.data/pglite` and applies
migrations automatically. Delete `.data/` to reset. Do not run `npm run admin:create` while `npm run dev`
is running (PGlite allows one process at a time) — stop the dev server first.
PGlite is **dev/test only**: in production the app refuses to start a DB without `DATABASE_URL`, and form
endpoints answer 503 rather than pretending to save.

## Production
1. Create a PostgreSQL database (Neon, Supabase, Railway, RDS, or self-hosted). Use a region close to Pakistan if you can.
2. Set `DATABASE_URL` (use the host's TLS/`sslmode=require` URL) in the hosting environment.
3. Apply migrations: `npm run db:migrate`
4. Create the first admin: see ADMIN_SETUP.md.

## Changing the schema
Edit `lib/db/schema.ts` → `npm run db:generate` → review the SQL in `drizzle/` → commit → `npm run db:migrate`.

## Tables
`admin_users`, `admin_sessions`, `leads`, `lead_notes`, `booking_requests`, `contact_messages`, `cities`, `areas`,
`coverage`, `service_settings`, `notifications` (email delivery log: sent / skipped_not_configured / failed),
`audit_logs`, `rate_limits`.
Not yet modelled: FAQs, testimonials, blog posts, team members, site settings (still file-based).

## Data handling
* Forms collect only name, phone, optional email, service/location, schedule preferences, ≤500-char notes.
  **No medical history is requested**; forms tell users not to enter it.
* Raw IP addresses are never stored — only an HMAC used for rate limiting.
* Passwords: bcrypt hashes. Session tokens: only SHA-256 hashes stored.
* **Retention (owner decision needed):** no automatic deletion exists yet. Decide a retention period for
  leads/messages (e.g. delete closed leads after N months) and schedule a purge; document it in the Privacy Policy.

## Backups
Enable automated daily backups + point-in-time recovery at your provider; test a restore before launch.
Self-hosted: `pg_dump -Fc "$DATABASE_URL" > backup-$(date +%F).dump`, stored off-server and encrypted.
