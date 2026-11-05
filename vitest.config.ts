import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: { PGLITE_DIR: "memory://", NODE_ENV: "test" },
    testTimeout: 30000,
    hookTimeout: 60000,
  },
})
