import { updateSession } from "@/utils/session-middleware"
import { type NextRequest } from "next/server"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.webmanifest (PWA manifest file)
     * - api/paypal/webhook (PayPal webhook endpoint - no session needed)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|api/paypal/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for path:", request.nextUrl.pathname)
  return await updateSession(request)
}
