'use server'

// --- DELETE THE OLD IMPORT LINES ---
// import { supabaseAdmin } from '@/lib/supabaseAdmin' <--- DELETE THIS LINE

// --- KEEP ONLY THIS CORRECT IMPORT ---
import { supabaseAdmin } from '@/lib/supabaseClient' 

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

export async function login(previousState, formData) {
  const username = formData.get('username')
  const password = formData.get('password')

  // 1. Fetch User (using Admin client to bypass RLS)
  const { data: user, error } = await supabaseAdmin 
    .from('rent_accounts')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !user) {
    return { error: 'User not found' }
  }

  // 2. Security Checks
  if (!user.is_active) return { error: 'Account disabled' }
  if (new Date() > new Date(user.expires_at)) return { error: 'Rental expired' }
  if (password !== user.password) return { error: 'Wrong password' }

  // 3. GENERATE NEW SESSION ID
  const newSessionId = crypto.randomUUID(); // Creates a random string like "a1b2-c3d4..."

  // 4. SAVE IT TO DATABASE (This invalidates any previous logins!)
  const { error: updateError } = await supabaseAdmin
    .from('rent_accounts')
    .update({ session_id: newSessionId })
    .eq('id', user.id)

  if (updateError) return { error: 'Login failed (Database error)' }

  // 5. SAVE IT TO COOKIE
  const cookieStore = await cookies();
  cookieStore.set('rental_session', JSON.stringify({ 
    username: user.username, 
    expiresAt: user.expires_at,
    sessionId: newSessionId // <--- We store the specific ticket here
  }), { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 
  })

  redirect('/play')
}

// Keep the logout function as is
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('rental_session')
  redirect('/')
}