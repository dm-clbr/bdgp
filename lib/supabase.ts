import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type RSVPStatus = 'pending' | 'confirmed' | 'waitlisted'

export interface RSVP {
  id: string
  name: string
  email: string
  phone: string
  shirt_size: string
  shoe_size: string
  booking_code: string
  status: RSVPStatus
  created_at: string
  confirmed_at: string | null
}
