# WW Patient Care — home-care website (Pakistan)

Next.js 16 (App Router) website for a home patient-care business, with a real backend: care-request and
contact forms stored in PostgreSQL, a service-availability checker driven by configured coverage, booking
*requests*, and a role-based admin dashboard.

> **Status: ready after owner configuration — not yet launch-ready.** See [Known gaps](#known-gaps) and
> [BUSINESS_SETUP.md](BUSINESS_SETUP.md). Next.js 16 differs from older versions — read
> `node_modules/next/dist/docs/` before changing framework-level code (see `AGENTS.md`).

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16.3 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Drizzle ORM. Local dev falls back to embedded Postgres (PGlite) — no setup |
| Admin auth | Server-side sessions (random token, SHA-256 hash stored), bcrypt (cost 12), httpOnly cookie |
| Validation | Zod 4 (shared client/server schemas; server always re-validates) |
| Email | Resend (disabled until configured) |
| Tests | Vitest (API/integration), Playwright (browser journeys) |

## Requirements

Node.js 20+ (developed on 24), npm. A PostgreSQL database for production.

## Install & run

```bash
npm install
cp .env.example .env.local          # then edit
npm run dev                         # http://localhost:3000
```

First admin (no default account exists — see [ADMIN_SETUP.md](ADMIN_SETUP.md)):

```bash
ADMIN_EMAIL=you@yourdomain.com ADMIN_NAME="Your Name" npm run admin:create   # prompts for password
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Develop / production build / serve build |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm test` | Vitest — API validation, idempotency, rate limit, availability, notifications |
| `npm run test:e2e` | Playwright browser journeys against an isolated throw-away database |
| `npm run db:generate` | Generate a migration after editing `lib/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` (production) |
| `npm run admin:create` | Create an admin user |

First-time Playwright setup: `npx playwright install chromium`.

## Structure

```
app/(marketing)/   public pages        app/admin/    dashboard (own layout, noindex)
app/api/           request-care, contact, availability
config/            site.ts (ALL business details), content.ts (About copy), features.ts, navigation.ts
data/              services, areas, FAQs, testimonials (empty until real ones exist)
lib/db             Drizzle schema + client      lib/auth    sessions, permissions
lib/validation     shared Zod schemas, PK phone lib/email   branded templates, delivery log
drizzle/           generated SQL migrations     e2e/, tests/   test suites
```

## How content goes live (important)

* **Services** start *inactive*. An admin activates a service in `/admin/services`; activation is refused
  while its copy in `data/services.ts` still contains `[PLACEHOLDER` text. Inactive services are not in
  the sitemap, the request form or the checker, and their pages return 404.
* **Coverage** (cities → areas → per-service status) is managed in `/admin/coverage`. Anything not
  configured is reported to customers as **not covered**.
* **About page** sections render only when filled in `config/content.ts`.
* **Testimonials** stay disabled (`features.testimonials = false`, empty data).
* Contact details with placeholder values are hidden everywhere.

## Known gaps

Not done in this iteration (honest list — see [TEST_REPORT.md](TEST_REPORT.md) and
[PROJECT_CHANGELOG.md](PROJECT_CHANGELOG.md)):

* **Urdu / RTL and language switcher** — not implemented. Forms and public pages are English only.
* **Admin CMS** for FAQs, testimonials, blog, team and homepage content; **admin settings** screen; admin
  **user management** UI (users are created via CLI).
* **Pages not created:** Care Team, How Care Works, Pricing, Careers, Referral Partners, Patient & Family
  Rights, Complaints Policy, Service Agreement, Cookie/Refund pages beyond the existing drafts. Per-service
  FAQs/limitations are only as rich as `data/services.ts`.
* **Analytics events** (consent-gated GA4) not wired; only the env variables are documented.
* **Design refresh / photography / logo** — existing visual design kept; no real imagery supplied.
* **Legal pages** are unreviewed drafts with placeholders; see [LEGAL_COMPLIANCE_CHECKLIST.md](LEGAL_COMPLIANCE_CHECKLIST.md).
* Accessibility: built in (labels, focus, error summaries, skip link) but **no automated a11y audit
  (axe/Lighthouse) was run**.

## Documentation

[BUSINESS_SETUP](BUSINESS_SETUP.md) · [DATABASE_SETUP](DATABASE_SETUP.md) · [ADMIN_SETUP](ADMIN_SETUP.md) ·
[LEGAL_COMPLIANCE_CHECKLIST](LEGAL_COMPLIANCE_CHECKLIST.md) · [SEO_LAUNCH_CHECKLIST](SEO_LAUNCH_CHECKLIST.md) ·
[DEPLOYMENT](DEPLOYMENT.md) · [TEST_REPORT](TEST_REPORT.md) · [PROJECT_CHANGELOG](PROJECT_CHANGELOG.md)
