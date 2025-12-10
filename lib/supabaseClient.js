import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 1. Standard Client (Safe for Browser)
// This uses the 'anon' key. It respects RLS rules.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. Admin Client (Server ONLY)
// This uses the 'service_role' key. It BYPASSES all RLS rules.
// We check if the key exists to prevent crashes in the browser where the secret key is hidden.
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null