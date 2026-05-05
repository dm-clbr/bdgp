import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get('admin_auth')
  if (cookie?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, action } = await req.json()

  if (action === 'confirm') {
    const { data: rsvp, error: fetchErr } = await supabaseAdmin
      .from('rsvps')
      .select('*')
      .eq('id', id)
      .single()
    if (fetchErr) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { error } = await supabaseAdmin
      .from('rsvps')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  }

  if (action === 'unconfirm') {
    const { error } = await supabaseAdmin
      .from('rsvps')
      .update({ status: 'pending', confirmed_at: null })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'resend_email') {
    const { data: rsvp, error: fetchErr } = await supabaseAdmin
      .from('rsvps')
      .select('*')
      .eq('id', id)
      .single()
    if (fetchErr) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await sendConfirmationEmail(rsvp)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
