import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components'

interface ConfirmationEmailProps {
  name: string
  bookingCode: string
  shirtSize: string
  shoeSize: string
}

const gold = '#B8973A'
const goldLight = '#D4AF5A'
const dark = '#1A1A14'
const cream = '#F7F3EC'
const muted = '#7A7768'
const border = 'rgba(184,151,58,0.25)'

export default function ConfirmationEmail({
  name,
  bookingCode,
  shirtSize,
  shoeSize,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re confirmed for BDGP Bandon Dunes, Sept 14–17, 2026</Preview>
      <Body style={{ background: dark, margin: 0, padding: 0, fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: 580, margin: '0 auto', padding: '2rem 1rem' }}>

          {/* Header */}
          <Section style={{ textAlign: 'center', paddingBottom: '2rem' }}>
            <Text
              style={{
                fontSize: 11,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: goldLight,
                margin: 0,
              }}
            >
              BDGP
            </Text>
            <Text
              style={{
                fontSize: 10,
                letterSpacing: '0.15em',
                color: 'rgba(247,243,236,0.4)',
                textTransform: 'uppercase',
                margin: '0.25rem 0 0',
              }}
            >
              Bandon Dunes Golf Partners · September 2026
            </Text>
          </Section>

          <Hr style={{ borderColor: border, marginBottom: '2rem' }} />

          {/* Confirmation hero */}
          <Section style={{ textAlign: 'center', paddingBottom: '2rem' }}>
            <Text
              style={{
                fontSize: 10,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: gold,
                margin: '0 0 0.75rem',
              }}
            >
              You&apos;re Confirmed
            </Text>
            <Heading
              as="h1"
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: cream,
                margin: '0 0 0.5rem',
                lineHeight: 1.2,
                fontStyle: 'italic',
              }}
            >
              Welcome, {name}
            </Heading>
            <Text style={{ color: 'rgba(247,243,236,0.65)', fontSize: 15, margin: 0 }}>
              Your spot at Bandon Dunes is locked in. See you on the links.
            </Text>
          </Section>

          {/* Receipt */}
          <Section
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${border}`,
              borderRadius: 4,
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <Row>
              <Column>
                <Text style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: muted, margin: '0 0 0.25rem' }}>
                  Payment Received
                </Text>
                <Text style={{ fontSize: 22, fontWeight: 600, color: goldLight, margin: 0 }}>
                  $6,000
                </Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: muted, margin: '0 0 0.25rem' }}>
                  Booking Code
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 600, color: goldLight, letterSpacing: '0.1em', margin: 0 }}>
                  {bookingCode}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Trip details */}
          <Section style={{ marginBottom: '1.5rem' }}>
            <Text
              style={{
                fontSize: 10,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: gold,
                margin: '0 0 1rem',
              }}
            >
              Trip Details
            </Text>
            {[
              ['Dates', 'September 14–17, 2026'],
              ['Location', 'Bandon Dunes Golf Resort, Bandon, Oregon'],
              ['Lodging', 'The Bandon Manor — private exclusive-use property'],
              ['Format', 'Caddie-only, walking rounds'],
            ].map(([label, value]) => (
              <Row key={label} style={{ marginBottom: '0.75rem' }}>
                <Column style={{ width: 120 }}>
                  <Text style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                    {label}
                  </Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 14, color: cream, margin: 0 }}>{value}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: border, marginBottom: '1.5rem' }} />

          {/* Schedule */}
          <Section style={{ marginBottom: '1.5rem' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: gold, margin: '0 0 1rem' }}>
              Tee Times
            </Text>
            {[
              ['Mon Sep 14', 'Bandon Dunes', '3:00 PM'],
              ['Tue Sep 15', 'Sheep Ranch', '9:10 AM'],
              ['Tue Sep 15', 'Pacific Dunes', '3:10 PM'],
              ['Wed Sep 16', 'Bandon Preserve', '8:00 AM'],
              ['Wed Sep 16', 'Old Macdonald', '12:30 PM'],
              ['Thu Sep 17', 'Bandon Trails', '9:20 AM'],
            ].map(([date, course, time]) => (
              <Row
                key={date + course}
                style={{
                  borderBottom: '1px solid rgba(184,151,58,0.1)',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                }}
              >
                <Column style={{ width: 100 }}>
                  <Text style={{ fontSize: 11, color: muted, margin: 0 }}>{date}</Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 13, color: cream, margin: 0 }}>{course}</Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ fontSize: 13, color: goldLight, margin: 0 }}>{time}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: border, marginBottom: '1.5rem' }} />

          {/* Gear kit */}
          <Section style={{ marginBottom: '1.5rem' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: gold, margin: '0 0 1rem' }}>
              Your BDGP Gear Kit
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(247,243,236,0.65)', margin: '0 0 1rem' }}>
              Your custom-sized gear will be ready for you at check-in.
            </Text>
            {[
              ['BDGP Polo Shirt', `Size: ${shirtSize}`],
              ['BDGP Hoodie', `Size: ${shirtSize}`],
              ['BDGP T-Shirt', `Size: ${shirtSize}`],
              ['BDGP Golf Balls', 'Personalized set'],
              ['BDGP Shoes', `Size: ${shoeSize}`],
            ].map(([item, detail]) => (
              <Row key={item} style={{ marginBottom: '0.5rem' }}>
                <Column style={{ width: 16 }}>
                  <Text style={{ color: gold, fontSize: 12, margin: 0 }}>—</Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 13, color: cream, margin: 0 }}>
                    {item} <span style={{ color: muted, fontSize: 12 }}>· {detail}</span>
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: border, marginBottom: '1.5rem' }} />

          {/* Footer */}
          <Section style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 13, color: 'rgba(247,243,236,0.65)', margin: '0 0 0.5rem' }}>
              Questions? Reach Donny at{' '}
              <a href="mailto:dymcginnis@yahoo.com" style={{ color: goldLight }}>
                dymcginnis@yahoo.com
              </a>
            </Text>
            <Text
              style={{
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: muted,
                margin: '1rem 0 0',
              }}
            >
              Bandon Dunes Golf Partners · BDGP · September 2026
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
