# Legal & regulatory checklist (Pakistan) — items requiring owner / lawyer confirmation

> **Not legal advice, and not verified.** No online research of current law was performed in this build, so
> nothing below is stated as established law. Each line is something to **confirm with a Pakistani lawyer and
> the relevant regulator's official publications**. The legal pages in `app/(marketing)/legal/` are unreviewed
> drafts containing placeholders and must not be published as-is.

Classify each answer as: *enacted law* · *regulator guidance* · *draft legislation* · *best practice*.

## 1. Healthcare regulation (depends on where you operate and what you deliver)
- [ ] Which provincial/territory regulator applies to a home-care provider in your city — e.g. Sindh Healthcare Commission (Sindh), Punjab Healthcare Commission (Punjab), Islamabad Healthcare Regulatory Authority (ICT)? Is registration/licensing of a home-nursing / home-care service required? Obtain the current official requirement.
- [ ] If licensed/registered: licence number, validity, display conditions → then fill `config/site.ts › registration.healthcareLicence`. **Do not publish a licence claim until verified.**
- [ ] Which services are clinical (nursing, physiotherapy, wound care, medication) vs non-clinical (attendant, companionship) — each clinical service needs appropriately registered staff.
- [ ] Staff registration: PMDC (doctors), PNMC (nurses), the physiotherapy/allied-health council as applicable — verify numbers and expiry before naming any qualification publicly.
- [ ] Rules on advertising healthcare services and on making outcome/quality claims.
- [ ] Emergency position: the site states it is **not** an emergency service and points to 1122 — confirm this matches what you actually offer.

## 2. Business & tax
- [ ] Company/AOP/sole-proprietor registration (SECP / registrar) and NTN/STRN — what must be disclosed on a commercial website?
- [ ] Employment/contractor status of caregivers, and any required insurance.

## 3. Data protection, online conduct, consumer law
- [ ] Current status of any Pakistani personal-data-protection law — **verify whether any bill is enacted; do not treat a draft as law.**
- [ ] Obligations under the Prevention of Electronic Crimes Act 2016 and electronic-transactions rules relevant to collecting contact data and sending messages.
- [ ] Consumer-protection and advertising rules (provincial consumer protection laws).
- [ ] HIPAA/GDPR do **not** automatically apply; adopt a privacy standard deliberately.
- [ ] Marketing consent: the forms already record a *separate, optional* marketing opt-in; decide how opt-out is honoured.
- [ ] Retention period for leads/messages and deletion on request (not automated yet — see DATABASE_SETUP.md).

## 4. Pages to finalise (drafts exist for first four; the rest are missing)
- [ ] Privacy Policy — must describe: data collected (name, phone, email, request details, notes), purposes, processors (hosting, DB, email provider, analytics), retention, rights/contact route.
- [ ] Terms and Conditions (payment terms placeholder present)
- [ ] Healthcare Disclaimer (non-clinical vs clinical distinction)
- [ ] Cookie Policy (must match what is actually set; currently no analytics cookies are set)
- [ ] Refund & Cancellation Policy · Patient & Family Rights · Complaints Policy · Service Agreement summary — **not created**
- [ ] Replace every "Last Updated: [PLACEHOLDER]" with the real date after review.

## 5. Claims discipline (already enforced in code)
No guaranteed recovery/outcome claims; no invented credentials, partnerships, reviews or prices; attendants are
not presented as nurses; testimonials disabled until genuine.
