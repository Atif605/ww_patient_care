/**
 * Creates an admin user. There is NO default account.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" npm run admin:create
 *
 * The password is read from a hidden prompt (or ADMIN_PASSWORD for CI use) —
 * never from a command-line argument, so it stays out of shell history.
 * ADMIN_ROLE defaults to super_admin: super_admin | admin | staff | content
 */
import { createInterface } from "node:readline"
import { Writable } from "node:stream"
import { getDb, schema } from "../lib/db"
import { hashPassword, passwordProblem } from "../lib/auth/password"
import type { AdminRole } from "../lib/db/schema"

const ROLES: AdminRole[] = ["super_admin", "admin", "staff", "content"]

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    let muted = false
    const out = new Writable({
      write(chunk, _enc, cb) {
        if (!muted) process.stdout.write(chunk)
        cb()
      },
    })
    const rl = createInterface({ input: process.stdin, output: out, terminal: true })
    rl.question(question, (answer) => {
      rl.close()
      process.stdout.write("\n")
      resolve(answer)
    })
    muted = true
  })
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const name = process.env.ADMIN_NAME?.trim()
  const role = (process.env.ADMIN_ROLE ?? "super_admin") as AdminRole
  if (!email || !name) {
    console.error('Set ADMIN_EMAIL and ADMIN_NAME, e.g. ADMIN_EMAIL=a@b.com ADMIN_NAME="Jane" npm run admin:create')
    process.exit(1)
  }
  if (!ROLES.includes(role)) {
    console.error(`ADMIN_ROLE must be one of: ${ROLES.join(", ")}`)
    process.exit(1)
  }

  const password = process.env.ADMIN_PASSWORD ?? (await promptHidden("Password (min 12 chars): "))
  const problem = passwordProblem(password)
  if (problem) {
    console.error(problem)
    process.exit(1)
  }

  const db = await getDb()
  await db.insert(schema.adminUsers).values({
    email,
    name,
    role,
    passwordHash: await hashPassword(password),
  })
  await db.insert(schema.auditLogs).values({
    action: "admin.created_via_cli",
    entity: "admin_user",
    entityId: email,
    detail: { role },
  })
  console.log(`Created ${role} account for ${email}.`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
