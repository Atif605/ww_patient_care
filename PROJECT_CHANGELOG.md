# Project changelog

## 2026-10-31 — backend, admin and honesty pass

### Audit findings (before)
Production build **failed** (5 type errors) and lint had 12 errors. Both API routes were fakes (sleep 1 s,
return success, store nothing). Request-care and contact pages contained "[Form Placeholder]" boxes; the old
form components were unused. No database, auth, sitemap, robots or 404. Invented social URLs, **sample
testimonials enabled**, an unverified "registered nurses" claim on About, and placeholder text visible on
public pages.

### Fixed / replaced
* Build/type/lint errors (Zod 4 API, polymorphic Button, icon typing, unescaped entities).
* Fake APIs → real persisted endpoints (`/api/request-care`, `/api/contact`, new `/api/availability`) with server validation, PK phone normalisation, honeypot, minimum-fill-time, rate limiting, idempotency, duplicate suppression, same-origin check, honest 4xx/5xx/503 responses.
* Placeholder form boxes → working 5-step Request Care form + confirmation with reference; working contact form.
* Removed invented social URLs, sample testimonials, the nurse claim; About now renders only owner-supplied text; placeholder contact details hidden in header/footer/contact page.
* Services gated by an admin-controlled active flag (default off, blocked while placeholder text remains); sitemap and pages follow it.

### Added
* PostgreSQL schema + migration (Drizzle), PGlite dev fallback.
* Admin dashboard: login, overview, leads (search/filters/status/assign/notes/CSV export), bookings (confirm/propose/reject/cancel), contact messages, services, coverage (cities/areas/per-service), audit log; roles; sessions; login throttling; CLI admin creation.
* Availability checker widget and server-side coverage logic.
* Email integration (Resend) with branded templates and an honest delivery log — inactive until configured.
* `proxy.ts` (optimistic admin gate + noindex), security headers, robots, sitemap, 404 pages, OG-image existence guard.
* Header breakpoint fix for tablet widths.
* Tests: Vitest (32) and Playwright (17). Docs set (README, BUSINESS_SETUP, DATABASE_SETUP, ADMIN_SETUP, LEGAL_COMPLIANCE_CHECKLIST, SEO_LAUNCH_CHECKLIST, DEPLOYMENT, TEST_REPORT).

### Preserved
Existing routes, design tokens, UI primitives, section components, SEO/schema helpers, navigation config.

### Dependencies added
drizzle-orm, pg, @electric-sql/pglite, bcryptjs (runtime); drizzle-kit, vitest, tsx, @playwright/test, type packages (dev). `@types/node` bumped to 24.

### Still to do
Urdu/RTL; CMS editors (FAQ, testimonials, blog, team, homepage) and admin settings/user management; pricing module; missing pages (care team, how care works, careers, referral partners, rights, complaints, service agreement, refund policy); blog system; consent-gated analytics events; breadcrumbs; password reset/MFA; data-retention job; accessibility and Lighthouse audits; legal review; real design assets.
