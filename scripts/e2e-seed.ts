/**
 * TEST-ONLY seed for the Playwright suite. Writes to the isolated PGlite
 * directory in PGLITE_DIR and refuses to run against a real database.
 */
import { getDb, schema } from "../lib/db"
import { hashPassword } from "../lib/auth/password"
import { services } from "../data/services"

async function main() {
  if (process.env.DATABASE_URL || !process.env.PGLITE_DIR?.includes("e2e")) {
    throw new Error("e2e-seed only runs against the isolated e2e PGlite directory")
  }
  const db = await getDb()
  await db.insert(schema.adminUsers).values([
    { email: "admin@e2e.test", name: "E2E Admin", role: "super_admin", passwordHash: await hashPassword("E2e-Admin-Pass-123") },
    { email: "staff@e2e.test", name: "E2E Staff", role: "staff", passwordHash: await hashPassword("E2e-Staff-Pass-123") },
  ])
  // Activation normally goes through the admin UI, which (correctly) refuses services
  // that still contain placeholder copy — so the test activates one directly.
  await db.insert(schema.serviceSettings).values({ slug: services[0].slug, active: true })
  console.log("e2e seed done; service:", services[0].slug)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
