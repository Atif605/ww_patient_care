"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { normalizePkMobile } from "@/lib/validation/phone"

interface Values {
  name: string
  phone: string
  email: string
  subject: string
  message: string
  privacyAccepted: boolean
  website: string
}
type Errors = Partial<Record<keyof Values, string>>

const EMPTY: Values = { name: "", phone: "", email: "", subject: "", message: "", privacyAccepted: false, website: "" }

function validate(v: Values): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = "Please enter your full name"
  if (!normalizePkMobile(v.phone)) e.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567 or +92 300 1234567"
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Please enter a valid email address"
  if (v.subject.trim().length < 3) e.subject = "Please add a subject"
  if (v.message.trim().length < 10) e.message = "Please write a short message"
  if (!v.privacyAccepted) e.privacyAccepted = "You must acknowledge the privacy notice to continue"
  return e
}

export function ContactForm() {
  const [v, setV] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [reference, setReference] = useState("")
  const key = useRef("")
  const startedAt = useRef(0)
  const doneRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    key.current = crypto.randomUUID()
    startedAt.current = Date.now()
  }, [])
  useEffect(() => {
    if (reference) doneRef.current?.focus()
  }, [reference])

  const set = <K extends keyof Values>(k: K, value: Values[K]) => {
    setV((p) => ({ ...p, [k]: value }))
    setErrors((p) => ({ ...p, [k]: undefined }))
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate(v)
    setErrors(e)
    if (Object.keys(e).length) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: key.current,
          name: v.name,
          phone: v.phone,
          email: v.email || undefined,
          subject: v.subject,
          message: v.message,
          privacyAccepted: v.privacyAccepted,
          website: v.website,
          startedAt: startedAt.current,
          locale: "en",
        }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.ok && data.reference) {
        setReference(data.reference)
      } else if (res.status === 422 && data?.fields) {
        setErrors(data.fields)
      } else {
        setSubmitError(data?.error ?? "We could not send your message. Please try again or contact us directly.")
      }
    } catch {
      setSubmitError("We could not reach the server. Your message was NOT sent. Please check your connection or contact us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  if (reference) {
    return (
      <div role="status" className="rounded-xl border border-[var(--color-success)] bg-[var(--color-success)]/10 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-[var(--color-success)]" aria-hidden="true" />
        <h2 ref={doneRef} tabIndex={-1} className="mb-2 text-xl font-bold outline-none">Message received</h2>
        <p className="mb-2 text-sm text-[var(--color-text-muted)]">Your reference number:</p>
        <p className="mb-4 font-mono text-lg font-bold tracking-wider" data-testid="reference">{reference}</p>
        <p className="text-sm text-[var(--color-text-muted)]">Our team will review your message and get back to you. We cannot promise an exact response time.</p>
      </div>
    )
  }

  const list = Object.entries(errors).filter(([, m]) => m)
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {list.length > 0 && (
        <div role="alert" className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-3 text-sm text-[var(--color-danger)]">
          <p className="font-medium">Please fix the following:</p>
          <ul className="list-disc pl-5">{list.map(([k, m]) => <li key={k}>{m}</li>)}</ul>
        </div>
      )}
      {submitError && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-3 text-sm text-[var(--color-danger)]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{submitError}</p>
        </div>
      )}

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="ct-website">Leave this field empty</label>
        <input id="ct-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <Input label="Full name *" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Mobile number *" type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" value={v.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
        <Input label="Email (optional)" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
      </div>
      <Input label="Subject *" maxLength={120} value={v.subject} onChange={(e) => set("subject", e.target.value)} error={errors.subject} />
      <Textarea label="Message *" maxLength={1500} className="min-h-[120px]" value={v.message} onChange={(e) => set("message", e.target.value)} error={errors.message} placeholder="Please do not include detailed medical information." />

      <p className="rounded-lg bg-[var(--color-bg-muted)] p-3 text-xs text-[var(--color-text-muted)]">
        <strong className="text-[var(--color-text)]">Not for emergencies:</strong> call{" "}
        <a href="tel:1122" className="underline">1122</a> or go to the nearest hospital.
      </p>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={v.privacyAccepted} onChange={(e) => set("privacyAccepted", e.target.checked)} aria-invalid={!!errors.privacyAccepted} />
          <span>I have read the <Link href="/legal/privacy-policy" target="_blank" className="text-[var(--color-primary)] underline">Privacy Policy</Link> and agree to be contacted about my message. *</span>
        </label>
        {errors.privacyAccepted && <p className="mt-1 pl-7 text-sm text-[var(--color-danger)]">{errors.privacyAccepted}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting} aria-busy={submitting}>
        {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Sending…</>) : "Send message"}
      </Button>
    </form>
  )
}
