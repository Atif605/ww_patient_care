# Test report

Run on 2026-10-31, Windows 10, Node 24.16, Next.js 16.3.4. Labels: PASS · FAIL · NOT TESTED · BLOCKED BY MISSING CONFIGURATION.

## Automated results (all executed; outputs observed)
| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **PASS** — 0 errors, 0 warnings (baseline was 12 errors + 4 warnings) |
| Type check | `npm run typecheck` | **PASS** (baseline: 5 type errors that also broke `next build`) |
| Production build | `npm run build` | **PASS** — 26 routes |
| API / integration (Vitest, real in-memory Postgres) | `npm test` | **PASS** — 32 tests |
| Browser journeys (Playwright, Chromium, isolated DB) | `npm run test:e2e` | **PASS** — 17 tests |

### Vitest covers
PK phone normalisation (valid/invalid forms) · availability = `available` only for configured coverage, `not_covered` for inactive service/unknown area · request-care: stores lead + reference, idempotency, duplicate suppression (same phone+service), invalid phone → 422 with field errors, privacy required, past/too-far dates rejected, booking stored as *requested*, uncovered areas stored as future-interest leads, honeypot + too-fast rejected, rate limit (429), cross-origin POST (403) · contact: store, validation, `<script>` kept as inert text · notification log never says `sent` when email is unconfigured.

### Playwright covers
No-coverage state shows "not open yet" (no fake form) · unauthenticated `/admin` redirect and export blocked · wrong password rejected · admin login → add city/area, activate, set coverage and **verify persistence after reload** · activation of placeholder-content service refused (UI shows it) · availability checker reflects coverage · full 5-step Request Care with client validation → real `WWPC-CR-…` reference and "not a confirmed appointment" text · contact form → `WWPC-CM-…` reference · lead visible in admin, status change persisted (filter), internal note, message visible, audit entry · **staff role denied** coverage/audit (redirect `?denied=1`) · sign-out ends session · **no horizontal overflow** on `/ /services /areas-we-serve /contact /request-care /faq` at 320, 375, 390, 768, 1024, 1440 px · robots/sitemap/404/security headers/admin `noindex`/canonical.

## Bugs found and fixed during testing
* Header overflowed at 768 px (7-link nav + phone button) → nav now from `lg`, full phone button from `xl`.
* Successful logins counted toward the 5-attempt lockout → success now clears counters.
* PGlite crashed when `.data/` did not exist → directory created.
* Honeypot hit returned 422 instead of the generic 400 → schema relaxed so the spam check runs.
* Several Playwright failures were test races (hydration, substring button match) — fixed in the tests, not by loosening assertions on app behaviour.

## Not tested / limited
| Area | Status |
|---|---|
| Email delivery (Resend) | **BLOCKED BY MISSING CONFIGURATION** — only the "skipped, logged" path is tested; no email was sent |
| Production database (`DATABASE_URL`), `db:migrate` on a hosted Postgres | **BLOCKED BY MISSING CONFIGURATION** — tested on PGlite only (same SQL migrations) |
| Booking confirm / propose / reject UI + customer email | **NOT TESTED** (code written; no automated test) |
| Admin: service toggle success path, lead CSV export content, messages status update | **NOT TESTED** (export only checked unauthenticated) |
| CSRF / XSS / SQLi | Partial: Origin check on public POSTs tested; React escaping + parameterised Drizzle queries by design; script-tag storage tested; no pen-test, no `npm audit` review |
| Accessibility | **NOT TESTED** with axe/Lighthouse/screen reader; keyboard-only run-through not performed; contrast not measured |
| Lighthouse / Core Web Vitals | **NOT TESTED** |
| Mobile menu, 404 page visuals, legal pages content | **NOT TESTED** (only responsiveness/overflow and routes) |
| Urdu / RTL / language switching | **Not implemented** |
| Real-device and cross-browser (Safari, Firefox) | **NOT TESTED** (Chromium only) |
| Load / concurrency | **NOT TESTED** (idempotency/race logic covered only by a sequential test) |
