import { NextResponse } from "next/server"
import type { ZodError } from "zod"
import { DatabaseNotConfiguredError } from "@/lib/db"

export const MAX_BODY_BYTES = 20_000

/** Reads JSON with a size cap. Returns null when invalid/too large. */
export async function readJson(request: Request): Promise<unknown | null> {
  const len = Number(request.headers.get("content-length") ?? "0")
  if (len > MAX_BODY_BYTES) return null
  try {
    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) return null
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function fieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form"
    if (!out[key]) out[key] = issue.message
  }
  return out
}

export function badRequest(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

/** Maps unexpected failures to an honest response — never a fake success. */
export function serverError(error: unknown) {
  if (error instanceof DatabaseNotConfiguredError) {
    console.error("[api]", error.message)
    return NextResponse.json(
      {
        ok: false,
        error:
          "Online requests are temporarily unavailable. Please call or message us instead.",
      },
      { status: 503 }
    )
  }
  console.error("[api] unexpected error", error)
  return NextResponse.json(
    { ok: false, error: "Something went wrong. Your request was NOT saved. Please try again or contact us directly." },
    { status: 500 }
  )
}

/** Same-origin check for browser POSTs (defence-in-depth CSRF protection). */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true // non-browser clients; still rate-limited & validated
  const host = request.headers.get("host")
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
