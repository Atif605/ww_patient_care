# SEO launch checklist

## Implemented
- [x] Per-page title, description, canonical, Open Graph, Twitter tags (`lib/seo/metadata.ts`)
- [x] `/sitemap.xml` — static pages + **active** services + defined areas only (`app/sitemap.ts`)
- [x] `/robots.txt` — disallows `/admin` and `/api/`, links the sitemap
- [x] 404 pages (global and in-site) with `noindex`; inactive services return 404 and are excluded from the sitemap
- [x] Admin responses send `X-Robots-Tag: noindex`
- [x] JSON-LD helpers for Organization/LocalBusiness/Service exist in `lib/seo/schema.ts` (Service used on service pages). Only configured, real values are emitted.
- [x] OG image advertised only if `public/images/og-default.jpg` exists

## Before launch (owner / developer)
- [ ] Set real `NEXT_PUBLIC_SITE_URL` (canonical + sitemap use it)
- [ ] Add `public/images/og-default.jpg` (1200×630) and a real logo/favicon
- [ ] Replace placeholder copy on services/areas/FAQ/about; remove `[PLACEHOLDER]` text everywhere (search the repo)
- [ ] Unique, genuine content per area page — **no** location-swapped duplicates; add only areas you serve
- [ ] Verify Organization/LocalBusiness JSON-LD output with Google's Rich Results Test once address/phone are real; no ratings/reviews markup unless real
- [ ] Breadcrumb markup/visible breadcrumbs — **not implemented**
- [ ] Image `alt` text for every real photo added later (decorative images use `alt=""`)
- [ ] Google Search Console: verify domain (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` or DNS), submit `/sitemap.xml`
- [ ] Google Business Profile: claim/verify; NAP (name, address, phone) must match the site exactly
- [ ] Analytics: GA4 ID in env; **consent-gated event tracking is not implemented yet**; never send names, phones, notes or health info
- [ ] Run Lighthouse / PageSpeed on the production URL (mobile) and record results (none recorded yet)
- [ ] Urdu pages + `hreflang` — not implemented
- [ ] Confirm HTTPS, `www`/non-`www` redirect, and that `/admin` is not indexed after deployment
