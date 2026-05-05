import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'

export interface VenmoPayment {
  messageUid: number
  bookingCode: string | null
  subject: string
  from: string
}

const BOOKING_CODE_REGEX = /BDGP-[A-Z0-9]{4}/

export async function fetchUnreadVenmoEmails(): Promise<VenmoPayment[]> {
  const client = new ImapFlow({
    host: 'imap.mail.yahoo.com',
    port: 993,
    secure: true,
    auth: {
      user: process.env.YAHOO_EMAIL!,
      pass: process.env.YAHOO_APP_PASSWORD!,
    },
    logger: false,
  })

  const payments: VenmoPayment[] = []

  await client.connect()

  try {
    const lock = await client.getMailboxLock('INBOX')
    try {
      // Search for unread emails from Venmo
      const searchResult = await client.search({
        seen: false,
        from: 'venmo@venmo.com',
      })
      const uids = Array.isArray(searchResult) ? searchResult : []

      if (uids.length === 0) return payments

      for await (const message of client.fetch(uids, { envelope: true, source: true })) {
        if (!message.source) continue
        const parsed = await simpleParser(message.source)
        const subject = parsed.subject ?? ''
        const text = typeof parsed.text === 'string' ? parsed.text : ''
        const html = typeof parsed.html === 'string' ? parsed.html : ''
        const body = text || html

        // Only process payment received emails
        if (!subject.toLowerCase().includes('you received')) continue

        const match = body.match(BOOKING_CODE_REGEX) ?? subject.match(BOOKING_CODE_REGEX)
        const bookingCode = match ? match[0] : null

        payments.push({
          messageUid: message.uid,
          bookingCode,
          subject,
          from: String(parsed.from?.text ?? ''),
        })

        // Mark as read to avoid re-processing
        await client.messageFlagsAdd({ uid: message.uid }, ['\\Seen'])
      }
    } finally {
      lock.release()
    }
  } finally {
    await client.logout()
  }

  return payments
}
