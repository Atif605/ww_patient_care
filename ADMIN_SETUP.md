# Admin setup & access control

Dashboard: `/admin` (never linked from the public site; excluded from robots.txt and sent `noindex`).
There is **no public registration and no default account or password.**

## Create the first administrator
After the database is migrated and `AUTH_SECRET` is set:

```bash
ADMIN_EMAIL=owner@yourdomain.com ADMIN_NAME="Owner Name" npm run admin:create
```
You are prompted for the password with hidden input (min 12 chars with upper, lower, digit). It is never
passed on the command line. `ADMIN_ROLE` defaults to `super_admin`; others: `admin`, `staff`, `content`.
Run it on a trusted machine against the production `DATABASE_URL`, then remove that variable from your shell.

## Roles (enforced server-side on every page, action and export)
| Role | Leads/Bookings/Messages | Coverage & Services | Audit log | Users |
|---|---|---|---|---|
| Super Admin | ✔ | ✔ | ✔ | (reserved) |
| Admin | ✔ | ✔ | ✔ | – |
| Staff / Lead Manager | ✔ | – | – | – |
| Content Manager | – | – | – | – (content CMS not built yet) |

User-management UI is not built: add further users with `admin:create` (different `ADMIN_EMAIL`/`ADMIN_ROLE`).
To disable a user, set `active = false` in `admin_users` (their sessions stop working immediately).

## Security measures
* Sessions: 32-byte random token in an httpOnly, SameSite=Lax, Secure (production) cookie; 8-hour expiry; checked against the DB on every request; sign-out deletes the server-side session.
* Login throttling: 5 failed attempts / 15 min per account and 10 per IP; successful login clears counters.
* Mutations are Server Actions (Next.js enforces same-origin Origin checks); the CSV export is GET, authenticated and permission-checked, and neutralises spreadsheet-formula injection.
* Audit log of logins (success/failure), status changes, notes, booking decisions, coverage/service edits, exports.
* `proxy.ts` is only an optimistic redirect; real authorisation never depends on it.

## Daily use
Leads → open a lead → set status (New, Contacted, Follow-up, Assessment Scheduled, Converted, Not Converted, Closed), assign, add internal notes. Bookings are **requests**: Confirm / Propose another time / Reject / Cancel; the customer is emailed only after a confirm/propose and only if email delivery is configured and they gave an address.

## Not yet available
Password-reset flow (reset by an admin re-running a hash update in the DB), MFA, admin settings screen, CMS editors. Treat these as roadmap items.
