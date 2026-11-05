/** Applies SQL migrations in ./drizzle to the database in DATABASE_URL. */
import path from "node:path"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL is not set. (In local dev, migrations run automatically on first use.)")
    process.exit(1)
  }
  const pool = new Pool({ connectionString: url })
  await migrate(drizzle(pool), { migrationsFolder: path.join(process.cwd(), "drizzle") })
  await pool.end()
  console.log("Migrations applied.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
