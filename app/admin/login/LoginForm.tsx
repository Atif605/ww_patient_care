"use client"

import { useActionState } from "react"
import { login, type ActionState } from "../actions"
import { btnCls, inputCls } from "../_ui"

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(login, {})
  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={`${inputCls} w-full`} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={`${inputCls} w-full`} />
      </div>
      <button className={`${btnCls} w-full`} disabled={pending} aria-busy={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  )
}
