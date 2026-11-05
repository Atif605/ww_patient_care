import { defineConfig } from "@playwright/test"

const PORT = 3100

// Run via `npm run test:e2e` — it resets and seeds the isolated PGlite DB first.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 25_000 },
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, headless: true },
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}/admin/login`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: { PGLITE_DIR: ".data/e2e/pglite" },
  },
})
