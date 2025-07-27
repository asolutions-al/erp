import { DOMAIN } from "@/contants/env"
import { getAuthUrl } from "@/lib/utils"
import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              domain: DOMAIN, // https://github.com/supabase/supabase/issues/473#issuecomment-2543434925
              ...options,
            })
          )
        },
      },
    }
  )

  // SESSION VALIDATION //
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ROUTE PROTECTION //
  const isAtProtectedRoutes = !["/auth", "/invitation"].some((route) =>
    pathname.startsWith(route)
  )

  if (!user && isAtProtectedRoutes)
    return NextResponse.redirect(
      getAuthUrl({ returnTo: pathname, page: "/login" })
    )

  return response
}
