import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── Admin routes: protect with Supabase Auth ─────────────────────────────
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // If on login page already, let them through
    if (pathname === '/admin') {
      if (user) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return response
    }

    // Otherwise protect all /admin/* routes
    if (!user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
  }

  // ─── All other routes: next-intl i18n middleware ───────────────────────────
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Admin routes
    '/admin',
    '/admin/:path*',
    // Locale routes (next-intl)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
