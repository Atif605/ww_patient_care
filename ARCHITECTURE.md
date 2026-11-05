@'
# Architecture — Worldwide Home Patient Care Services Website

> This is the single source of truth for technical decisions on the
> wwpatientcare.com project. Any change to stack, structure, or SEO strategy
> should be recorded here.

**Document version:** 1.0
**Last updated:** [PLACEHOLDER: date]
**Status:** Phase 1 complete — awaiting Phase 2 (Project Initialization)

---

## 1. Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG for SEO, image/font optimization, API routes, scalable |
| Language | TypeScript | Type safety, better DX, fewer runtime errors |
| Styling | Tailwind CSS | Utility-first, tiny production CSS, consistent design system |
| Forms | React Hook Form + Zod | Performant forms + shared client/server validation |
| Icons | Lucide React | Lightweight, tree-shakeable, accessible |
| Email (later) | Resend or Nodemailer | Transactional email for inquiry notifications |
| Analytics | GA4 via next/script | Loaded conditionally by env var, no PII sent |
| Hosting | Vercel (recommended) | Zero-config Next.js hosting, free tier sufficient |
| Future CMS | Sanity or Payload | When blog/team management needs a UI |
| Future i18n | next-intl | Add Urdu/English routing without refactor |

**Explicitly NOT used in v1 (to keep bundle small and secure):**
- No UI component libraries (MUI, Ant, Chakra)
- No state managers (Redux, Zustand)
- No animation libraries (Framer Motion)
- No CSS-in-JS (styled-components, Emotion)
- No database (until booking/accounts are added)
- No auth (until portal is added)

---

## 2. Sitemap

### Public Pages
/ Home
/about About Us
/services Services overview
/services/home-nursing-care Home Nursing Care
/services/patient-care-at-home Patient Care at Home
/services/elderly-care Elderly Care
/services/post-hospitalization-care Post-Hospitalization Care
/services/bedridden-patient-care Bedridden Patient Care
/services/caregiver-services Caregiver Services
/areas-we-serve Areas We Serve (hub)
/areas-we-serve/karachi Karachi (city root)
/areas-we-serve/[area] Individual areas (only verified)
/request-care Request a Care Service
/contact Contact
/faq FAQ
/blog Blog index
/blog/[slug] Individual article
/privacy-policy Privacy Policy
/terms Terms & Conditions
/healthcare-disclaimer Healthcare Disclaimer
/cookie-policy Cookie Policy
/sitemap.xml Auto-generated
/robots.txt Auto-generated


### Pages Requiring Business Confirmation

- Physiotherapy at Home (if physiotherapists available)
- Doctor Consultation at Home (if licensed physicians available)
- ICU / Critical Care at Home (legally sensitive)
- Additional area pages (only areas genuinely served)

---

## 3. Folder Structure
wwpatientcare/
├── app/
│ ├── (marketing)/
│ │ ├── page.tsx Home
│ │ ├── about/page.tsx
│ │ ├── services/
│ │ │ ├── page.tsx
│ │ │ └── [slug]/page.tsx
│ │ ├── areas-we-serve/
│ │ │ ├── page.tsx
│ │ │ └── [area]/page.tsx
│ │ ├── request-care/page.tsx
│ │ ├── contact/page.tsx
│ │ ├── faq/page.tsx
│ │ ├── blog/
│ │ │ ├── page.tsx
│ │ │ └── [slug]/page.tsx
│ │ └── legal/
│ │ ├── privacy-policy/page.tsx
│ │ ├── terms/page.tsx
│ │ ├── healthcare-disclaimer/page.tsx
│ │ └── cookie-policy/page.tsx
│ ├── api/
│ │ ├── request-care/route.ts
│ │ └── contact/route.ts
│ ├── layout.tsx
│ ├── not-found.tsx
│ ├── robots.ts
│ ├── sitemap.ts
│ └── globals.css
├── components/
│ ├── layout/ Header, Footer, Nav, MobileMenu, SkipLink
│ ├── ui/ Button, Card, Input, Select, Textarea, Badge
│ ├── sections/ Hero, ServicesGrid, WhyChooseUs, HowItWorks
│ ├── forms/ RequestCareForm, ContactForm
│ ├── seo/ JsonLd, Breadcrumbs
│ └── widgets/ WhatsAppButton, CallButton
├── config/
│ ├── site.ts NAP, hours, social, nav
│ ├── features.ts Feature flags
│ └── navigation.ts
├── content/
│ └── blog/ *.mdx
├── data/
│ ├── services.ts
│ ├── areas.ts
│ ├── faqs.ts
│ └── testimonials.ts
├── lib/
│ ├── seo/
│ │ ├── metadata.ts
│ │ └── schema.ts
│ ├── validation/
│ │ └── forms.ts
│ ├── utils/
│ │ ├── cn.ts
│ │ └── format.ts
│ └── analytics/
│ └── events.ts
├── public/
│ ├── images/
│ ├── icons/
│ └── favicon.ico
├── types/
│ └── index.ts
├── .env.example
├── .env.local (gitignored)
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── ARCHITECTURE.md
├── PROJECT_NOTES.md
└── README.md


---

## 4. Design System

### Colors

| Token | Value | Use |
|---|---|---|
| --color-primary | #0B4F8A | Medical navy - headers, primary CTA |
| --color-primary-dark | #083A66 | Hover, footer |
| --color-accent | #0E9F8E | Healing teal - secondary CTA |
| --color-accent-soft | #E6F5F2 | Section backgrounds |
| --color-bg | #FFFFFF | Page background |
| --color-bg-muted | #F5F7FA | Alternating sections |
| --color-text | #1A2B3C | Body text |
| --color-text-muted | #5A6B7B | Secondary text |
| --color-border | #E2E8F0 | Dividers |
| --color-success | #16A34A | Confirmations |
| --color-danger | #DC2626 | Errors |

All text/background combinations meet WCAG AA contrast.

### Typography

- Headings: Inter (or Plus Jakarta Sans) - via next/font
- Body: Inter
- Future Urdu: Noto Nastaliq Urdu

### Spacing

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (Tailwind scale)

### Border Radius

- Buttons: 8px
- Cards: 12px
- Inputs: 8px

### Shadows

- shadow-sm - cards
- shadow-md - modals, sticky header on scroll

### Breakpoints

Tailwind defaults: sm 640, md 768, lg 1024, xl 1280, 2xl 1536

---

## 5. SEO Strategy

### On-Page

- Unique title and meta description per page
- One h1 per page, logical heading order
- Canonical URLs on every page
- Open Graph + Twitter/X cards
- Semantic HTML5 landmarks
- Descriptive image alt text

### Structured Data (JSON-LD)

- Organization - global
- LocalBusiness / MedicalBusiness - global + contact
- Service - each service page
- FAQPage - FAQ page + service FAQ blocks
- BreadcrumbList - all inner pages
- Article - blog posts
- Review / AggregateRating - ONLY if real reviews exist

### Technical Files

- app/robots.ts -> /robots.txt
- app/sitemap.ts -> /sitemap.xml
- app/layout.tsx -> global metadata
- lib/seo/metadata.ts -> reusable metadata builder
- lib/seo/schema.ts -> reusable JSON-LD builders

### What We Do NOT Do

- No fake reviews, doctors, addresses, or credentials
- No keyword stuffing
- No doorway pages or thin location pages
- No cloaking, PBNs, or black-hat techniques
- No medical claims that cannot be substantiated

---

## 6. Local SEO

- Clean area hub at /areas-we-serve
- One page per genuinely-served area
- Unique content per area (not template swap)
- Consistent NAP across website + Google Business Profile + social
- Google Business Profile setup checklist in Phase 9

---

## 7. Performance Targets

- Lighthouse Performance >= 95 on mobile
- Lighthouse Accessibility = 100
- Lighthouse Best Practices = 100
- Lighthouse SEO = 100
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- Initial JS bundle < 100KB gzipped on home page
- All images served via next/image as AVIF/WebP

---

## 8. Accessibility (WCAG 2.2 AA)

- Semantic HTML landmarks
- Skip-to-content link
- Keyboard-navigable everything
- Visible focus rings
- Color contrast >= 4.5:1 body, >= 3:1 large
- Associated form labels
- aria-live for form status
- prefers-reduced-motion respected
- Meaningful alt text; alt="" for decorative images

'@ | Out-File -FilePath "ARCHITECTURE.md" -Encoding UTF8
@'

---

## 9. Security

- HTTPS enforced
- Secure headers via next.config.ts:
  - Content-Security-Policy
  - Strict-Transport-Security
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy
- Zod validation on all form inputs (client + server)
- Honeypot + rate limiting on form API routes
- CSRF protection on POST routes
- No secrets in code - all via .env.local
- Public forms collect minimal data (no medical history, no CNIC)

---

## 10. Forms Plan

### /request-care - Request a Care Service

| Field | Type | Required |
|---|---|---|
| Full name | text | YES |
| Phone | tel | YES |
| WhatsApp | tel | NO |
| Email | email | NO |
| Service needed | select | YES |
| Preferred contact time | select | NO |
| Area / location | text | YES |
| Message | textarea | NO |
| Consent | checkbox | YES |
| Honeypot | hidden | - |

**Server route:** POST /api/request-care
1. Validate with Zod
2. Check honeypot
3. Rate-limit by IP
4. Send notification email
5. Return JSON { ok: true } or { ok: false, errors }

**Consent text:** "I agree to be contacted about my inquiry. I understand this form is not for medical emergencies."

---

## 11. WhatsApp & Contact Integration

All values from config/site.ts + .env.local:
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_WHATSAPP=
NEXT_PUBLIC_EMAIL=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=


Components:
- Floating WhatsApp button (dismissible)
- Sticky "Call Now" on mobile
- Header CTA
- Footer NAP block
- Inline CTAs on every service page

All tracked with data-event for GA4 conversions.

---

## 12. Analytics

- GA4 loaded via next/script with strategy="afterInteractive"
- Loaded only if NEXT_PUBLIC_GA_ID is set
- No PII sent to analytics
- Custom events: phone_click, whatsapp_click, form_submit_request_care, form_submit_contact

---

## 13. Content Management Strategy

### v1

- Services, areas, FAQs, testimonials -> typed TS objects in /data/
- Blog posts -> MDX files in /content/blog/
- No CMS, no DB - simplest, fastest, zero cost

### v2

- Migrate /data/ to Sanity or Payload CMS
- Component APIs stay identical - only the data source changes

---

## 14. Legal Pages

Templates for:
- /privacy-policy
- /terms
- /healthcare-disclaimer
- /cookie-policy

All require review by a Pakistani lawyer before publishing.
Each file will include a [LEGAL REVIEW REQUIRED] marker.

---

## 15. Development Phases

| Phase | Goal |
|---|---|
| 1 | Planning & architecture (THIS DOCUMENT) - COMPLETE |
| 2 | Project initialization |
| 3 | Design system |
| 4 | Header / nav / footer |
| 5 | Homepage |
| 6 | Service pages |
| 7 | About / contact / forms |
| 8 | SEO implementation |
| 9 | Local SEO |
| 10 | Performance / a11y / security |
| 11 | Testing |
| 12 | Deployment |
| 13 | Future features |

Each phase delivers: explanation -> files -> commands -> how to test -> expected result -> wait for confirmation.

---

## 16. Environment Variables