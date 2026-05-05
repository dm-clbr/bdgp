import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const TOTAL_SPOTS = 8

function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'BDGP-'
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('rsvps')
      .select('name')
      .eq('status', 'confirmed')
      .order('confirmed_at', { ascending: true })

    if (error) throw error

    const confirmed = data?.length ?? 0
    return NextResponse.json({
      confirmed,
      total: TOTAL_SPOTS,
      remaining: Math.max(0, TOTAL_SPOTS - confirmed),
      names: (data ?? []).map((r) => r.name as string),
    })
  } catch {
    return NextResponse.json({ confirmed: 0, total: TOTAL_SPOTS, remaining: TOTAL_SPOTS, names: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, shirt_size, shoe_size } = body

    if (!name || !email || !phone || !shirt_size || !shoe_size) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Check remaining spots
    const { count } = await supabaseAdmin
      .from('rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed')

    if ((count ?? 0) >= TOTAL_SPOTS) {
      return NextResponse.json({ error: 'No spots remaining.' }, { status: 409 })
    }

    // Generate unique booking code
    let booking_code = generateBookingCode()
    let attempts = 0
    while (attempts < 10) {
      const { data: existing } = await supabaseAdmin
        .from('rsvps')
        .select('id')
        .eq('booking_code', booking_code)
        .maybeSingle()
      if (!existing) break
      booking_code = generateBookingCode()
      attempts++
    }

    const { data, error } = await supabaseAdmin
      .from('rsvps')
      .insert({ name, email, phone, shirt_size, shoe_size, booking_code, status: 'pending' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ booking_code: data.booking_code }, { status: 201 })
  } catch (err) {
    console.error('RSVP POST error:', err)
    return NextResponse.json({ error: 'Failed to save RSVP.' }, { status: 500 })
  }
}
