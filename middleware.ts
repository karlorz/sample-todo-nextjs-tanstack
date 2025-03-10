import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Session } from '@auth/core/types'

interface SessionResponse {
  user: Session['user'] | null
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Allow public paths
  if (
    pathname === '/signup' ||
    pathname === '/signin' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/model/') ||
    ['.jpg', '.png', '.svg'].some(ext => pathname.endsWith(ext))
  ) {
    return NextResponse.next()
  }

  // Protected paths
  try {
    const authUrl = new URL('/api/auth/session', req.url)
    const response = await fetch(authUrl, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      }
    })

    if (!response.ok) {
      throw new Error(`Session fetch failed with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Check if data exists and has user property
    if (!data || !data.user) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', encodeURIComponent(req.url))
      return NextResponse.redirect(signInUrl)
    }

    // User is authenticated
    return NextResponse.next()
  } catch (error) {
    console.error('Auth check failed:', error)
    const signInUrl = new URL('/signin', req.url)
    signInUrl.searchParams.set('error', 'AuthCheckFailed')
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
