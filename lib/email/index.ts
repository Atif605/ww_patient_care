import { Resend } from "resend"
import { getDb, schema } from "@/lib/db"
import { siteConfig, isConfigured } from "@/config/site"

type Status = "sent" | "skipped_not_configured" | "failed"

export interface SendResult {
  status: Status
}

function providerConfigured(): boolean {
  return (
    isConfigured(process.env.EMAIL_PROVIDER_API_KEY) &&
    isConfigured(process.env.EMAIL_FROM)
  )
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** Branded wrapper shared by every template. All dynamic values are escaped. */
export function renderEmail(opts: {
  heading: string
  lines: string[]
  reference?: string
  footerNote?: string
}): string {
  const contact = [
    isConfigured(siteConfig.phone) ? `Phone: ${esc(siteConfig.phone)}` : null,
    isConfigured(siteConfig.email) ? `Email: ${esc(siteConfig.email)}` : null,
  ]
    .filter(Boolean)
    .join(" &middot; ")
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#1A2B3C;background:#F5F7FA;padding:24px">
<div style="max-width:560px;margin:auto;background:#fff;border-radius:8px;padding:24px;border-top:4px solid #0B4F8A">
<p style="margin:0 0 4px;color:#0B4F8A;font-weight:bold">${esc(siteConfig.name)}</p>
<h1 style="font-size:20px;margin:8px 0 16px">${esc(opts.heading)}</h1>
${opts.reference ? `<p>Reference: <strong>${esc(opts.reference)}</strong></p>` : ""}
${opts.lines.map((l) => `<p style="line-height:1.5">${esc(l)}</p>`).join("\n")}
<p style="font-size:12px;color:#5A6B7B;border-top:1px solid #E2E8F0;padding-top:12px;margin-top:20px">
${opts.footerNote ? esc(opts.footerNote) + "<br>" : ""}
If this is a medical emergency, call 1122 or go to the nearest hospital.
${contact ? `<br>${contact}` : ""}</p>
</div></body></html>`
}

/**
 * Sends one email and ALWAYS records the real outcome in `notifications`.
 * Without a configured provider nothing is sent and the status says so.
 */
export async function sendEmail(args: {
  kind: string
  to: string
  subject: string
  html: string
  reference?: string
}): Promise<SendResult> {
  let status: Status = "skipped_not_configured"
  let error: string | undefined

  if (providerConfigured() && args.to.includes("@")) {
    try {
      const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY)
      const res = await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: args.to,
        subject: args.subject,
        html: args.html,
      })
      if (res.error) {
        status = "failed"
        error = res.error.message
      } else {
        status = "sent"
      }
    } catch (e) {
      status = "failed"
      error = e instanceof Error ? e.message : "unknown error"
    }
  }

  try {
    const db = await getDb()
    await db.insert(schema.notifications).values({
      kind: args.kind,
      recipient: args.to,
      subject: args.subject,
      status,
      error,
      reference: args.reference,
    })
  } catch {
    // Logging must never break a customer's submission.
  }
  return { status }
}

/** Admin alert. Recipient comes from EMAIL_TO. */
export async function notifyAdmin(
  kind: string,
  subject: string,
  lines: string[],
  reference: string
): Promise<SendResult> {
  const to = process.env.EMAIL_TO
  if (!isConfigured(to) || !to) {
    return sendEmail({
      kind,
      to: "(EMAIL_TO not set)",
      subject,
      html: "",
      reference,
    })
  }
  return sendEmail({
    kind,
    to,
    subject,
    html: renderEmail({ heading: subject, lines, reference }),
    reference,
  })
}

/** Customer acknowledgement — only when they supplied an email. */
export async function acknowledgeCustomer(args: {
  kind: string
  to?: string
  subject: string
  heading: string
  lines: string[]
  reference: string
}): Promise<SendResult | null> {
  if (!args.to) return null
  return sendEmail({
    kind: args.kind,
    to: args.to,
    subject: args.subject,
    html: renderEmail({
      heading: args.heading,
      lines: args.lines,
      reference: args.reference,
    }),
    reference: args.reference,
  })
}
