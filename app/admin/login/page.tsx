import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { LoginForm } from "./LoginForm"

export const metadata = { title: "Sign in" }

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin")
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-xl border border-[var(--color-border)] bg-white p-6">
      <h1 className="mb-1 text-xl font-bold">Staff sign in</h1>
      <p className="mb-5 text-sm text-[var(--color-text-muted)]">
        Authorised team members only.
      </p>
      <LoginForm />
    </div>
  )
}
