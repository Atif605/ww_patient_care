import { describe, expect, it } from "vitest"
import { normalizePkMobile } from "@/lib/validation/phone"

describe("normalizePkMobile", () => {
  it.each([
    ["03001234567", "+923001234567"],
    ["0300 1234567", "+923001234567"],
    ["0300-123-4567", "+923001234567"],
    ["+923001234567", "+923001234567"],
    ["+92 300 1234567", "+923001234567"],
    ["923331234567", "+923331234567"],
    ["00923451234567", "+923451234567"],
  ])("accepts %s", (input, expected) => {
    expect(normalizePkMobile(input)).toBe(expected)
  })

  it.each(["", "abc", "0300123456", "030012345678", "+911234567890", "02112345678", "03501234567", "+92300123456"])(
    "rejects %s",
    (input) => {
      expect(normalizePkMobile(input)).toBeNull()
    }
  )
})
