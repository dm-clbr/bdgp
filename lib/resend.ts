import { Resend } from 'resend'
import { render } from '@react-email/render'
import ConfirmationEmail from '@/emails/ConfirmationEmail'
import type { RSVP } from './supabase'

export const resendClient = new Resend(process.env.RESEND_API_KEY!)

export async function sendConfirmationEmail(rsvp: RSVP) {
  const html = await render(
    ConfirmationEmail({
      name: rsvp.name,
      bookingCode: rsvp.booking_code,
      shirtSize: rsvp.shirt_size,
      shoeSize: rsvp.shoe_size,
    })
  )

  await resendClient.emails.send({
    from: process.env.EMAIL_FROM!,
    to: rsvp.email,
    subject: "You're confirmed — BDGP Bandon Dunes, Sept 14–17",
    html,
  })
}
