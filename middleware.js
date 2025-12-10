import { NextResponse } from 'next/server'

export function middleware(request) {
  const session = request.cookies.get('rental_session')

  // If not logged in, kick them back to login page
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Check if session is expired
  try {
    const data = JSON.parse(session.value)
    if (new Date() > new Date(data.expiresAt)) {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('rental_session')
      return response
    }
  } catch (e) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Apply this protection to the game page AND the game files
export const config = {
  matcher: [
    '/play',
    '/game/:path*', // Blocks direct access to /game/Build/file.wasm
  ],
}