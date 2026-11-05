"use client"

import { useEffect, useState } from "react"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"

type Availability = "available" | "needs_confirmation" | "not_covered"
interface Coverage {
  services: { slug: string; title: string }[]
  cities: { slug: string; name: string; areas: { slug: string; name: string }[] }[]
}

const RESULT: Record<Availability, { tone: string; title: string; text: string }> = {
  available: {
    tone: "border-[var(--color-success)] bg-[var(--color-success)]/10",
    title: "Service available",
    text: "This service is available in your area. Send a request and our team will contact you.",
  },
  needs_confirmation: {
    tone: "border-amber-500 bg-amber-50",
    title: "Availability needs confirmation",
    text: "We need to confirm availability for this area. Send a request and we will get back to you.",
  },
  not_covered: {
    tone: "border-[var(--color-danger)] bg-[var(--color-danger)]/10",
    title: "Not currently covered",
    text: "We do not currently offer this service in this area. You can still leave a request so we can contact you if that changes.",
  },
}

export function AvailabilityChecker() {
  const [data, setData] = useState<Coverage | null>(null)
  const [failed, setFailed] = useState(false)
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [service, setService] = useState("")
  const [result, setResult] = useState<Availability | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setFailed(true))
  }, [])

  if (failed) {
    return <p role="alert" className="text-sm">The availability checker is temporarily unavailable. Please contact us directly.</p>
  }
  if (!data) return <p role="status" className="text-sm text-[var(--color-text-muted)]">Loading availability checker…</p>
  if (data.cities.length === 0 || data.services.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        We are still confirming our coverage areas. Please contact us to ask whether we can help in your area.
      </p>
    )
  }

  const areas = data.cities.find((c) => c.slug === city)?.areas ?? []

  async function check(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setResult(null)
    try {
      const q = new URLSearchParams({ citySlug: city, areaSlug: area, serviceSlug: service })
      const res = await fetch(`/api/availability?${q}`)
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error()
      setResult(json.availability)
    } catch {
      setError("We could not check availability right now. Please try again or contact us.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={check} className="space-y-4" aria-label="Check service availability">
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="City" placeholder="Select a city" value={city} onChange={(e) => { setCity(e.target.value); setArea(""); setResult(null) }} options={data.cities.map((c) => ({ value: c.slug, label: c.name }))} required />
        <Select label="Area" placeholder={city ? "Select an area" : "Select a city first"} value={area} disabled={!city} onChange={(e) => { setArea(e.target.value); setResult(null) }} options={areas.map((a) => ({ value: a.slug, label: a.name }))} required />
        <Select label="Service" placeholder="Select a service" value={service} onChange={(e) => { setService(e.target.value); setResult(null) }} options={data.services.map((s) => ({ value: s.slug, label: s.title }))} required />
      </div>
      <Button type="submit" disabled={busy || !city || !area || !service} aria-busy={busy}>
        {busy ? "Checking…" : "Check availability"}
      </Button>
      {error && <p role="alert" className="text-sm text-[var(--color-danger)]">{error}</p>}
      {result && (
        <div role="status" className={`rounded-lg border p-4 ${RESULT[result].tone}`}>
          <p className="font-semibold">{RESULT[result].title}</p>
          <p className="mb-3 text-sm">{RESULT[result].text}</p>
          <Button href={`/request-care?service=${service}`} variant="primary">Request care</Button>
        </div>
      )}
    </form>
  )
}
