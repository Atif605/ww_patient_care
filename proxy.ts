import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Optimistic gate only: sends cookie-less visitors to the login page and
 * marks admin responses non-indexable. Real authentication and authorisation
 * are enforced on the server in every admin page, action and route handler.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === "/admin/login"
  const hasSession = request.cookies.has("wwpc_admin")

  if (!isLogin && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  const res = NextResponse.next()
  res.headers.set("X-Robots-Tag", "noindex, nofollow")
  res.headers.set("Cache-Control", "no-store")
  return res
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
