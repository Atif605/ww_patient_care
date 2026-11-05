import { randomInt } from "node:crypto"

// No 0/O/1/I/L — easy to read out over the phone.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

/** e.g. WWPC-7K3M9Q — `prefix` distinguishes record types (CR, CM). */
export function generateReference(prefix: "CR" | "CM"): string {
  let code = ""
  for (let i = 0; i < 6; i++) code += ALPHABET[randomInt(ALPHABET.length)]
  return `WWPC-${prefix}-${code}`
}
