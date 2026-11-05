import { execSync } from "node:child_process"
import { rmSync } from "node:fs"

const dir = ".data/e2e"
rmSync(dir, { recursive: true, force: true })
execSync("npx tsx scripts/e2e-seed.ts", {
  stdio: "inherit",
  env: { ...process.env, PGLITE_DIR: `${dir}/pglite` },
})
