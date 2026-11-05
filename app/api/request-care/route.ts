import { NextResponse } from "next/server"
import { badRequest, fieldErrors, isSameOrigin, readJson, serverError } from "@/lib/api"
import { clientKey, rateLimit } from "@/lib/security/rate-limit"
import { createCareRequest } from "@/lib/submissions"
import { careRequestSchema } from "@/lib/validation/schemas"

export const dynamic = "force-dynamic"

const MIN_FILL_MS = 3_000

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) return badRequest("Forbidden", 403)

    const body = await readJson(request)
    if (!body) return badRequest("Invalid request")

    const allowed = await rateLimit("care", clientKey(request.headers), 5, 15 * 60)
    if (!allowed) {
      return badRequest("Too many requests. Please wait a few minutes or call us.", 429)
    }

    const parsed = careRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) },
        { status: 422 }
      )
    }
    const input = parsed.data

    // Spam checks: honeypot + implausibly fast submission. Rejected, never faked as success.
    if (input.website) return badRequest("Request could not be processed")
    if (input.startedAt && Date.now() - input.startedAt < MIN_FILL_MS) {
      return badRequest("Please review your details and submit again.")
    }

    const result = await createCareRequest(input)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return serverError(error)
  }
}
