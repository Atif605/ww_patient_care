import { mkdirSync } from "node:fs"
import path from "node:path"
import {
  drizzle as drizzlePg,
  type NodePgDatabase,
} from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

export type Db = NodePgDatabase<typeof schema>

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "DATABASE_URL is not set. Production requires a PostgreSQL connection string (see DATABASE_SETUP.md)."
    )
  }
}

const globalForDb = globalThis as unknown as { __wwpcDb?: Promise<Db> }

const MIGRATIONS = path.join(process.cwd(), "drizzle")

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL
  if (url) {
    const pool = new Pool({ connectionString: url, max: 5 })
    return drizzlePg(pool, { schema })
  }
  if (process.env.NODE_ENV === "production") {
    throw new DatabaseNotConfiguredError()
  }

  // Development only: embedded Postgres (PGlite) — real SQL, zero setup,
  // data kept in ./.data/pglite (git-ignored).
  const [{ PGlite }, { drizzle }, { migrate }] = await Promise.all([
    import("@electric-sql/pglite"),
    import("drizzle-orm/pglite"),
    import("drizzle-orm/pglite/migrator"),
  ])
  const dataDir =
    process.env.PGLITE_DIR ?? path.join(process.cwd(), ".data", "pglite")
  if (!dataDir.startsWith("memory://")) mkdirSync(path.dirname(dataDir), { recursive: true })
  const client = new PGlite(dataDir)
  const db = drizzle(client, { schema })
  await migrate(db, { migrationsFolder: MIGRATIONS })
  // PGlite and node-postgres drivers share the same query-builder surface.
  return db as unknown as Db
}

/** Lazily-created singleton. Throws DatabaseNotConfiguredError in production without DATABASE_URL. */
export function getDb(): Promise<Db> {
  if (!globalForDb.__wwpcDb) {
    globalForDb.__wwpcDb = connect().catch((err) => {
      globalForDb.__wwpcDb = undefined
      throw err
    })
  }
  return globalForDb.__wwpcDb
}

export { schema }
