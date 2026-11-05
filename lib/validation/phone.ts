/**
 * Pakistani mobile numbers.
 * Accepts 03XXXXXXXXX, 3XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX, 00923XXXXXXXXX
 * (spaces, dashes and brackets ignored). Returns canonical +923XXXXXXXXX or null.
 */
export function normalizePkMobile(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, "")
  if (!/^\+?\d+$/.test(digits)) return null

  let national: string
  if (/^\+?92\d{10}$/.test(digits)) national = digits.replace(/^\+?92/, "")
  else if (/^0092\d{10}$/.test(digits)) national = digits.slice(4)
  else if (/^0\d{10}$/.test(digits)) national = digits.slice(1)
  else return null

  // Mobile numbers: 3XX XXXXXXX (operator codes 30x–34x)
  return /^3[0-4]\d{8}$/.test(national) ? `+92${national}` : null
}
