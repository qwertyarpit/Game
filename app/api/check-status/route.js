import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// --- ENSURE YOU ONLY HAVE THIS ONE IMPORT ---
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('rental_session')

  if (!session) return NextResponse.json({ valid: false }, { status: 401 })

  try {
    const sessionData = JSON.parse(session.value)
    const username = sessionData.username
    const cookieSessionId = sessionData.sessionId // <--- The ticket in user's pocket

    // 1. Fetch user from DB
    const { data: user, error } = await supabaseAdmin
      .from('rent_accounts')
      .select('is_active, expires_at, session_id') // <--- Get current valid ticket
      .eq('username', username)
      .single()

    if (error || !user) return NextResponse.json({ valid: false }, { status: 401 })

    // 2. CHECK: Is Account Active?
    if (!user.is_active) return NextResponse.json({ valid: false }, { status: 401 })

    // 3. CHECK: Is Time Expired?
    if (new Date() > new Date(user.expires_at)) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    // 4. CHECK: DUPLICATE LOGIN? (The Magic Step)
    // If the DB has a different ID than the cookie, someone else logged in!
    if (user.session_id !== cookieSessionId) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

  } catch (e) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  return NextResponse.json({ valid: true })
}