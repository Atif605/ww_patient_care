"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Loader2, PhoneCall } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { siteConfig, isConfigured } from "@/config/site"
import { getPhoneUrl, getWhatsAppUrl } from "@/lib/utils/format"
import { normalizePkMobile } from "@/lib/validation/phone"
import { addDays, todayInTimezone } from "@/lib/utils/date"

/**
 * Multi-step care request. Collects only what is needed to follow up —
 * NO medical history. Success is shown only after the server has stored
 * the request and returned a reference.
 */

type Availability = "available" | "needs_confirmation" | "not_covered"
interface Coverage {
  services: { slug: string; title: string }[]
  cities: {
    slug: string
    name: string
    areas: { slug: string; name: string; serviceSlugs: string[] }[]
  }[]
}
interface Values {
  serviceSlug: string
  citySlug: string
  areaSlug: string
  frequency: "" | "one_time" | "recurring"
  schedule: string
  startDate: string
  notes: string
  assessmentDate: string
  assessmentWindow: "" | "morning" | "afternoon" | "evening"
  name: string
  phone: string
  email: string
  callbackTime: "anytime" | "morning" | "afternoon" | "evening"
  privacyAccepted: boolean
  marketingConsent: boolean
  website: string
}
type Errors = Partial<Record<keyof Values, string>>

const STEPS = ["Service", "Location", "Requirements", "Your details", "Privacy"] as const

const EMPTY: Values = {
  serviceSlug: "",
  citySlug: "",
  areaSlug: "",
  frequency: "",
  schedule: "",
  startDate: "",
  notes: "",
  assessmentDate: "",
  assessmentWindow: "",
  name: "",
  phone: "",
  email: "",
  callbackTime: "anytime",
  privacyAccepted: false,
  marketingConsent: false,
  website: "",
}

const FIELD_STEP: Partial<Record<keyof Values, number>> = {
  serviceSlug: 0,
  citySlug: 1,
  areaSlug: 1,
  frequency: 2,
  schedule: 2,
  startDate: 2,
  notes: 2,
  assessmentDate: 2,
  assessmentWindow: 2,
  name: 3,
  phone: 3,
  email: 3,
  callbackTime: 3,
  privacyAccepted: 4,
  marketingConsent: 4,
}

function validateStep(step: number, v: Values): Errors {
  const e: Errors = {}
  const today = todayInTimezone(siteConfig.timezone)
  const max = addDays(today, siteConfig.booking.maxAdvanceDays)
  if (step === 0 && !v.serviceSlug) e.serviceSlug = "Please select a service"
  if (step === 1) {
    if (!v.citySlug) e.citySlug = "Please select a city"
    if (!v.areaSlug) e.areaSlug = "Please select an area"
  }
  if (step === 2) {
    if (!v.frequency) e.frequency = "Please choose one-time or recurring care"
    if (v.startDate && (v.startDate < today || v.startDate > max)) {
      e.startDate = v.startDate < today ? "Date cannot be in the past" : "Please choose a nearer date"
    }
    if (v.assessmentDate) {
      if (v.assessmentDate < today || v.assessmentDate > max) {
        e.assessmentDate = v.assessmentDate < today ? "Date cannot be in the past" : "Please choose a nearer date"
      }
      if (!v.assessmentWindow) e.assessmentWindow = "Please choose a preferred time window"
    }
  }
  if (step === 3) {
    if (v.name.trim().length < 2) e.name = "Please enter your full name"
    if (!normalizePkMobile(v.phone)) {
      e.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567 or +92 300 1234567"
    }
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Please enter a valid email address"
  }
  if (step === 4 && !v.privacyAccepted) e.privacyAccepted = "You must acknowledge the privacy notice to continue"
  return e
}

const AVAIL_COPY: Record<Availability, { tone: string; text: string }> = {
  available: {
    tone: "border-[var(--color-success)] bg-[var(--color-success)]/10",
    text: "This service is available in your area. Submit your request and our team will follow up to arrange an assessment.",
  },
  needs_confirmation: {
    tone: "border-amber-500 bg-amber-50",
    text: "Availability in this area needs to be confirmed by our team. You can still submit your request and we will let you know.",
  },
  not_covered: {
    tone: "border-[var(--color-danger)] bg-[var(--color-danger)]/10",
    text: "We do not currently serve this service in this area. You can still submit a request so we can contact you if this changes.",
  },
}

function Contacts() {
  const hasPhone = isConfigured(siteConfig.phone)
  const hasWa = isConfigured(siteConfig.whatsapp)
  if (!hasPhone && !hasWa) return null
  return (
    <div className="flex flex-wrap gap-3">
      {hasPhone && (
        <Button href={getPhoneUrl(siteConfig.phone)} variant="outline">
          <PhoneCall className="mr-2 h-4 w-4" aria-hidden="true" /> Call {siteConfig.phone}
        </Button>
      )}
      {hasWa && (
        <Button href={getWhatsAppUrl(siteConfig.whatsapp, "Hello, I have a question about care services.")} variant="whatsapp">
          WhatsApp us
        </Button>
      )}
    </div>
  )
}

export function RequestCareForm() {
  const params = useSearchParams()
  const [coverage, setCoverage] = useState<Coverage | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [step, setStep] = useState(0)
  const [raw, setV] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [availResult, setAvailResult] = useState<{ key: string; value: Availability } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [done, setDone] = useState<{ reference: string; availability: Availability; hasBooking: boolean; duplicate: boolean } | null>(null)

  const idempotencyKey = useRef<string>("")
  const startedAt = useRef<number>(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const startedTracked = useRef(false)

  useEffect(() => {
    idempotencyKey.current = crypto.randomUUID()
    startedAt.current = Date.now()
    fetch("/api/availability")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Coverage) => setCoverage(data))
      .catch(() => setLoadError(true))
  }, [])

  // Preselect service from ?service= (only if it is active) — derived, not stored.
  const requested = params.get("service")
  const preselect = coverage?.services.some((x) => x.slug === requested) ? (requested as string) : ""
  const v: Values = { ...raw, serviceSlug: raw.serviceSlug || preselect }

  useEffect(() => {
    headingRef.current?.focus()
  }, [step, done])

  const city = coverage?.cities.find((c) => c.slug === v.citySlug)
  const todayStr = useMemo(() => todayInTimezone(siteConfig.timezone), [])
  const maxStr = useMemo(() => addDays(todayStr, siteConfig.booking.maxAdvanceDays), [todayStr])

  // Live availability check (server-computed from configured coverage).
  const availKey = `${v.citySlug}|${v.areaSlug}|${v.serviceSlug}`
  useEffect(() => {
    if (!v.citySlug || !v.areaSlug || !v.serviceSlug) return
    const q = new URLSearchParams({ citySlug: v.citySlug, areaSlug: v.areaSlug, serviceSlug: v.serviceSlug })
    let cancelled = false
    fetch(`/api/availability?${q}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !cancelled && setAvailResult({ key: availKey, value: d.availability }))
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [availKey, v.citySlug, v.areaSlug, v.serviceSlug])
  const avail = availResult?.key === availKey ? availResult.value : null

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    if (!startedTracked.current) startedTracked.current = true
    setV((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const next = () => {
    const e = validateStep(step, v)
    setErrors(e)
    if (Object.keys(e).length === 0) setStep((s) => s + 1)
  }

  const submit = async () => {
    const e = validateStep(4, v)
    setErrors(e)
    if (Object.keys(e).length) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/request-care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: idempotencyKey.current,
          serviceSlug: v.serviceSlug,
          citySlug: v.citySlug,
          areaSlug: v.areaSlug,
          frequency: v.frequency,
          schedule: v.schedule || undefined,
          startDate: v.startDate || undefined,
          notes: v.notes || undefined,
          assessmentDate: v.assessmentDate || undefined,
          assessmentWindow: v.assessmentWindow || undefined,
          name: v.name,
          phone: v.phone,
          email: v.email || undefined,
          callbackTime: v.callbackTime,
          privacyAccepted: v.privacyAccepted,
          marketingConsent: v.marketingConsent,
          website: v.website,
          startedAt: startedAt.current,
          locale: "en",
        }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.ok && data.reference) {
        setDone(data)
        return
      }
      if (res.status === 422 && data?.fields) {
        const fe = data.fields as Record<string, string>
        const mapped: Errors = {}
        let first = 99
        for (const [k, msg] of Object.entries(fe)) {
          mapped[k as keyof Values] = msg
          first = Math.min(first, FIELD_STEP[k as keyof Values] ?? 99)
        }
        setErrors(mapped)
        if (first < 99) setStep(first)
        return
      }
      setSubmitError(data?.error ?? "We could not save your request. Please try again or contact us directly.")
    } catch {
      setSubmitError("We could not reach the server. Your request was NOT saved. Please check your connection or contact us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  /* ─── Confirmation ─── */
  if (done) {
    return (
      <div role="status" className="rounded-xl border border-[var(--color-success)] bg-[var(--color-success)]/10 p-6 sm:p-8">
        <CheckCircle2 className="mb-3 h-10 w-10 text-[var(--color-success)]" aria-hidden="true" />
        <h2 ref={headingRef} tabIndex={-1} className="mb-2 text-2xl font-bold outline-none">
          {done.duplicate ? "We already have your request" : "Request received"}
        </h2>
        <p className="mb-4 text-[var(--color-text-muted)]">Your reference number:</p>
        <p className="mb-4 inline-block rounded-lg bg-white px-4 py-2 font-mono text-xl font-bold tracking-wider" data-testid="reference">
          {done.reference}
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-5 text-sm text-[var(--color-text)]">
          <li>Please keep this reference if you contact us about your request.</li>
          <li>Our team will review it and contact you on the number you provided. We cannot promise an exact response time.</li>
          <li>This is a <strong>request</strong>{done.hasBooking ? " (including your preferred assessment time)" : ""}. It is not a confirmed appointment or confirmed service.</li>
          {done.availability === "not_covered" && <li>We do not currently serve this service in your area; we have recorded your interest.</li>}
          {done.availability === "needs_confirmation" && <li>We still need to confirm service availability in your area.</li>}
        </ul>
        <Contacts />
        <p className="mt-6 text-xs text-[var(--color-text-muted)]">
          Medical emergency? Call <a className="underline" href="tel:1122">1122</a> or go to the nearest hospital.
        </p>
      </div>
    )
  }

  /* ─── Unavailable states ─── */
  if (loadError) {
    return (
      <div role="alert" className="space-y-4 rounded-xl border border-[var(--color-border)] p-6">
        <p>Online requests are temporarily unavailable. Please contact us directly:</p>
        <Contacts />
        <Link href="/contact" className="text-[var(--color-primary)] underline">Contact page</Link>
      </div>
    )
  }
  if (!coverage) {
    return <p role="status" className="py-12 text-center text-[var(--color-text-muted)]"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden="true" />Loading form…</p>
  }
  if (coverage.services.length === 0 || coverage.cities.length === 0) {
    return (
      <div className="space-y-4 rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-bold">Online requests are not open yet</h2>
        <p className="text-[var(--color-text-muted)]">
          We are still finalising which services and areas we cover. Please contact us directly to discuss your needs.
        </p>
        <Contacts />
        <Link href="/contact" className="inline-block text-[var(--color-primary)] underline">Go to the contact page</Link>
      </div>
    )
  }

  const errorList = Object.entries(errors).filter(([, m]) => m)

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (step < 4) next()
        else void submit()
      }}
      className="space-y-6"
    >
      <ol className="flex flex-wrap gap-2 text-xs sm:text-sm" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? "step" : undefined}
            className={`rounded-full px-3 py-1 ${i === step ? "bg-[var(--color-primary)] text-white" : i < step ? "bg-[var(--color-accent-soft)] text-[var(--color-text)]" : "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]"}`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </h2>

      {errorList.length > 0 && (
        <div role="alert" className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-3 text-sm text-[var(--color-danger)]">
          <p className="font-medium">Please fix the following:</p>
          <ul className="list-disc pl-5">
            {errorList.map(([k, m]) => <li key={k}>{m}</li>)}
          </ul>
        </div>
      )}
      {submitError && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-3 text-sm text-[var(--color-danger)]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="space-y-3">
            <p>{submitError}</p>
            <Contacts />
          </div>
        </div>
      )}

      {/* Honeypot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="rc-website">Leave this field empty</label>
        <input id="rc-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      {step === 0 && (
        <fieldset className="space-y-3">
          <legend className="sr-only">Select a service</legend>
          {coverage.services.map((s) => (
            <label key={s.slug} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${v.serviceSlug === s.slug ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border)]"}`}>
              <input type="radio" name="service" value={s.slug} checked={v.serviceSlug === s.slug} onChange={() => set("serviceSlug", s.slug)} className="h-4 w-4" />
              <span className="font-medium">{s.title}</span>
            </label>
          ))}
        </fieldset>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Select
            label="City *"
            placeholder="Select a city"
            value={v.citySlug}
            onChange={(e) => { set("citySlug", e.target.value); set("areaSlug", "") }}
            options={coverage.cities.map((c) => ({ value: c.slug, label: c.name }))}
            error={errors.citySlug}
          />
          <Select
            label="Area / locality *"
            placeholder={city ? "Select an area" : "Select a city first"}
            value={v.areaSlug}
            disabled={!city}
            onChange={(e) => set("areaSlug", e.target.value)}
            options={(city?.areas ?? []).map((a) => ({ value: a.slug, label: a.name }))}
            error={errors.areaSlug}
          />
          {avail && (
            <p role="status" className={`rounded-lg border p-3 text-sm ${AVAIL_COPY[avail].tone}`}>
              {AVAIL_COPY[avail].text}
            </p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Type of request *</legend>
            <div className="flex flex-wrap gap-3">
              {([["one_time", "One-time"], ["recurring", "Recurring / ongoing"]] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-3 text-sm">
                  <input type="radio" name="frequency" checked={v.frequency === val} onChange={() => set("frequency", val)} className="h-4 w-4" />
                  {label}
                </label>
              ))}
            </div>
            {errors.frequency && <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.frequency}</p>}
          </fieldset>
          <Input label="Preferred schedule (optional)" placeholder="e.g. Weekday mornings, or nights only" maxLength={200} value={v.schedule} onChange={(e) => set("schedule", e.target.value)} error={errors.schedule} />
          <Input label="Preferred start date (optional)" type="date" min={todayStr} max={maxStr} value={v.startDate} onChange={(e) => set("startDate", e.target.value)} error={errors.startDate} />
          <fieldset className="space-y-3 rounded-lg border border-[var(--color-border)] p-4">
            <legend className="px-1 text-sm font-medium">Assessment / callback request (optional)</legend>
            <p className="text-xs text-[var(--color-text-muted)]">This is a request only. Our team will confirm a time with you.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Preferred date" type="date" min={todayStr} max={maxStr} value={v.assessmentDate} onChange={(e) => set("assessmentDate", e.target.value)} error={errors.assessmentDate} />
              <Select
                label="Preferred time"
                placeholder="Select a time window"
                value={v.assessmentWindow}
                onChange={(e) => set("assessmentWindow", e.target.value as Values["assessmentWindow"])}
                options={[{ value: "morning", label: "Morning" }, { value: "afternoon", label: "Afternoon" }, { value: "evening", label: "Evening" }]}
                error={errors.assessmentWindow}
              />
            </div>
          </fieldset>
          <Textarea label="Anything else we should know? (optional)" placeholder="e.g. Prefer a female caregiver. Please do NOT enter medical history here — we will discuss that on a call." maxLength={500} value={v.notes} onChange={(e) => set("notes", e.target.value)} error={errors.notes} className="min-h-[96px]" />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Input label="Full name *" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
          <Input label="Mobile number *" type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567 or +92 300 1234567" value={v.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
          <Input label="Email (optional)" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
          <Select
            label="Best time to call"
            value={v.callbackTime}
            onChange={(e) => set("callbackTime", e.target.value as Values["callbackTime"])}
            options={[{ value: "anytime", label: "Any time" }, { value: "morning", label: "Morning" }, { value: "afternoon", label: "Afternoon" }, { value: "evening", label: "Evening" }]}
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-4 text-sm leading-relaxed">
            <p className="mb-2">We use the details you provide only to respond to your request, contact you about care services, and keep a record of your enquiry. See our <Link href="/legal/privacy-policy" className="text-[var(--color-primary)] underline" target="_blank">Privacy Policy</Link>.</p>
            <p><strong>Not for emergencies.</strong> In a medical emergency call <a href="tel:1122" className="underline">1122</a> or go to the nearest hospital.</p>
          </div>
          <div>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4" checked={v.privacyAccepted} onChange={(e) => set("privacyAccepted", e.target.checked)} aria-invalid={!!errors.privacyAccepted} />
              <span>I have read the Privacy Policy and agree that the details I entered may be used to contact me about this request. *</span>
            </label>
            {errors.privacyAccepted && <p className="mt-1 pl-7 text-sm text-[var(--color-danger)]">{errors.privacyAccepted}</p>}
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 h-4 w-4" checked={v.marketingConsent} onChange={(e) => set("marketingConsent", e.target.checked)} />
            <span>(Optional) I agree to receive occasional updates and information from {siteConfig.shortName}. I can withdraw at any time.</span>
          </label>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={submitting}>Back</Button>
        ) : <span />}
        {step < 4 ? (
          <Button type="submit">Continue</Button>
        ) : (
          <Button type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Submitting…</>) : "Submit request"}
          </Button>
        )}
      </div>
    </form>
  )
}
