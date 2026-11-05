# Business setup — what the owner must provide before launch

Nothing below has been invented. Until supplied, the site hides the item or shows an honest
"not open yet" state. Edit values in `config/site.ts`, `config/content.ts`, `data/*.ts`, `.env.local`.

## Identity & contact
- [ ] Legal business name and brand name (currently from `PROJECT_NOTES.md`: "Worldwide Home Patient Care Services" / "WW Patient Care" — confirm)
- [ ] Logo file (`public/images/logo.svg` is referenced by the header — supply the real one) and favicon
- [ ] Phone, WhatsApp (international format), public email → `NEXT_PUBLIC_PHONE/WHATSAPP/EMAIL`
- [ ] Office address (only if you want it public) → `config/site.ts › address.full`
- [ ] Operating hours → `config/site.ts › hours`
- [ ] Social profile URLs (real ones only) → `NEXT_PUBLIC_*_URL`
- [ ] Default social-share image `public/images/og-default.jpg` (1200×630). Without it, no OG image is advertised.

## Registration & credentials (shown only if you enter them)
- [ ] Business registration / NTN → `config/site.ts › registration`
- [ ] Healthcare commission licence number — **only if actually issued** (see LEGAL_COMPLIANCE_CHECKLIST.md)
- [ ] Staff qualifications you can document (PNMC / PMDC numbers etc.)

## Services
- [ ] Confirm which services you really provide; edit `data/services.ts` (remove every `[PLACEHOLDER…]`, state what is / isn't included and which staff deliver it)
- [ ] Activate each in `/admin/services` (blocked while placeholder text remains)
- [ ] Pricing, if you want it public (PKR; hourly/daily/weekly/monthly/quotation) — **pricing module not built yet**

## Coverage
- [ ] Real cities and localities you serve, per service → `/admin/coverage`
- [ ] Unique, genuine copy for each public area page in `data/areas.ts` (no copy-paste doorway pages)

## Content
- [ ] Mission / vision / values / story / team text → `config/content.ts` (true statements only)
- [ ] Real FAQ answers → `data/faqs.ts` (items with placeholders are hidden on the home page)
- [ ] Testimonials — only with written permission; then set `features.testimonials = true`
- [ ] Real photographs (licensed or your own). The decorative grey block in "Why choose us" is a placeholder for one.

## Operations
- [ ] PostgreSQL `DATABASE_URL`, `AUTH_SECRET` (see DEPLOYMENT.md)
- [ ] Email provider account + verified domain → `EMAIL_*`
- [ ] Who monitors the admin inbox / dashboard and how quickly (the site makes **no** response-time promise)
- [ ] Domain, hosting account, Google Search Console / Business Profile / GA4 access
