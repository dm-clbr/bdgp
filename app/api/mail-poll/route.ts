import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchUnreadVenmoEmails } from '@/lib/imap'
import { sendConfirmationEmail } from '@/lib/resend'

export async function GET(req: NextRequest) {
  // Protect endpoint with cron secret
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payments = await fetchUnreadVenmoEmails()
    const results: { code: string; status: string }[] = []

    for (const payment of payments) {
      if (!payment.bookingCode) {
        results.push({ code: 'unknown', status: 'no_code_found' })
        continue
      }

      // Look up the RSVP by booking code
      const { data: rsvp, error } = await supabaseAdmin
        .from('rsvps')
        .select('*')
        .eq('booking_code', payment.bookingCode)
        .eq('status', 'pending')
        .maybeSingle()

      if (error || !rsvp) {
        results.push({ code: payment.bookingCode, status: 'not_found_or_already_confirmed' })
        continue
      }

      // Mark as confirmed
      const { error: updateError } = await supabaseAdmin
        .from('rsvps')
        .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
        .eq('id', rsvp.id)

      if (updateError) {
        results.push({ code: payment.bookingCode, status: 'update_failed' })
        continue
      }

      // Send confirmation email
      try {
        await sendConfirmationEmail({ ...rsvp, status: 'confirmed', confirmed_at: new Date().toISOString() })
        results.push({ code: payment.bookingCode, status: 'confirmed_and_emailed' })
      } catch (emailErr) {
        console.error('Email send failed:', emailErr)
        results.push({ code: payment.bookingCode, status: 'confirmed_email_failed' })
      }
    }

    return NextResponse.json({ processed: results.length, results })
  } catch (err) {
    console.error('mail-poll error:', err)
    return NextResponse.json({ error: 'Poll failed', detail: String(err) }, { status: 500 })
  }
}
