import bcrypt from "bcryptjs"

const COST = 12
// Used to keep login timing similar when the email does not exist.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", COST)

export const hashPassword = (plain: string) => bcrypt.hash(plain, COST)

export async function verifyPassword(plain: string, hash?: string): Promise<boolean> {
  const ok = await bcrypt.compare(plain, hash ?? DUMMY_HASH)
  return hash ? ok : false
}

/** Min 12 chars, with upper, lower and a digit. */
export function passwordProblem(pw: string): string | null {
  if (pw.length < 12) return "Password must be at least 12 characters"
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw)) {
    return "Password needs upper-case, lower-case and a number"
  }
  return null
}
