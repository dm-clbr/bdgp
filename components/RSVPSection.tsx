'use client'

import { useState, useEffect } from 'react'

const TOTAL_SPOTS = 8

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}
const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SHOE_SIZES = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '14']

type FormState = 'form' | 'success' | 'full'

interface SpotData {
  confirmed: number
  total: number
  remaining: number
  names: string[]
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(184,151,58,0.3)',
  color: '#F7F3EC',
  padding: '0.85rem 1rem',
  fontFamily: 'inherit',
  fontSize: 14,
  letterSpacing: '0.05em',
  outline: 'none',
  borderRadius: 2,
  width: '100%',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23B8973A' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
}

export default function RSVPSection() {
  const [spots, setSpots] = useState<SpotData>({ confirmed: 0, total: TOTAL_SPOTS, remaining: TOTAL_SPOTS, names: [] })
  const [formState, setFormState] = useState<FormState>('form')
  const [bookingCode, setBookingCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    shirt_size: '',
    shoe_size: '',
  })

  useEffect(() => {
    fetch('/api/rsvp')
      .then((r) => r.json())
      .then((data: SpotData) => {
        setSpots(data)
        if (data.remaining === 0) setFormState('full')
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.shirt_size || !form.shoe_size) {
      alert('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setBookingCode(data.booking_code)
      setFormState('success')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const venmoAppUrl = `venmo://paycharge?txn=pay&recipients=donmcginnis&amount=6000&note=${bookingCode}`
  const venmoWebUrl = `https://account.venmo.com/pay?recipients=donmcginnis&amount=6000&note=${bookingCode}`

  const handleVenmoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = venmoAppUrl
    setTimeout(() => {
      window.open(venmoWebUrl, '_blank')
    }, 1500)
  }

  return (
    <div
      style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #1A1A14, #0E1209)',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Spot circles */}
        <div className="section-label" style={{ justifyContent: 'center' }}>RSVP</div>
        <h2
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontWeight: 400,
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: '#F7F3EC',
            marginBottom: '0.75rem',
            lineHeight: 1.3,
          }}
        >
          Secure your spot
        </h2>
        <p style={{ color: 'rgba(247,243,236,0.72)', fontSize: 15, lineHeight: 1.8, marginBottom: '2rem' }}>
          A $6,000 Venmo payment to <strong style={{ color: '#D4AF5A' }}>@donmcginnis</strong> is
          required to reserve your place.
        </p>

        {/* Spot indicators */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {Array.from({ length: TOTAL_SPOTS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 500,
                flexShrink: 0,
                ...(i < spots.confirmed
                  ? { background: '#B8973A', color: '#1A1A14' }
                  : { border: '1px dashed rgba(184,151,58,0.4)', background: 'transparent' }),
              }}
            >
              {i < spots.confirmed ? initials(spots.names[i] ?? '•') : ''}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(247,243,236,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2.5rem' }}>
          {spots.confirmed} of {TOTAL_SPOTS} reserved
        </p>

        {/* Form state */}
        {formState === 'form' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              style={inputStyle}
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              style={inputStyle}
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <select
                  style={selectStyle}
                  value={form.shirt_size}
                  onChange={(e) => setForm({ ...form, shirt_size: e.target.value })}
                  required
                >
                  <option value="" disabled>Shirt Size</option>
                  {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ position: 'relative' }}>
                <select
                  style={selectStyle}
                  value={form.shoe_size}
                  onChange={(e) => setForm({ ...form, shoe_size: e.target.value })}
                  required
                >
                  <option value="" disabled>Shoe Size</option>
                  {SHOE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'transparent',
                border: '1px solid #B8973A',
                color: '#D4AF5A',
                padding: '1rem 2rem',
                fontFamily: 'inherit',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                borderRadius: 2,
                opacity: loading ? 0.6 : 1,
                transition: 'background 0.25s, color 0.25s',
                marginTop: '0.5rem',
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#B8973A'
                  e.currentTarget.style.color = '#1A1A14'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#D4AF5A'
              }}
            >
              {loading ? 'Saving...' : 'Continue to Payment →'}
            </button>
          </form>
        )}

        {/* Success state */}
        {formState === 'success' && (
          <div
            style={{
              padding: '2rem',
              border: '1px solid rgba(184,151,58,0.25)',
              borderRadius: 2,
              background: 'rgba(255,255,255,0.03)',
              textAlign: 'left',
            }}
          >
            <p style={{ color: '#D4AF5A', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Almost there!
            </p>
            <p style={{ marginBottom: '0.75rem', fontSize: 14, color: 'rgba(247,243,236,0.85)' }}>
              Complete your <strong style={{ color: '#D4AF5A' }}>$6,000</strong> payment on Venmo to{' '}
              <strong style={{ color: '#D4AF5A' }}>@donmcginnis</strong> to lock in your spot.
            </p>
            <p style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(247,243,236,0.6)' }}>
              Include this code in your payment note:{' '}
              <strong style={{ color: '#D4AF5A', letterSpacing: '0.1em' }}>{bookingCode}</strong>
            </p>
            <a
              href={venmoAppUrl}
              onClick={handleVenmoClick}
              style={{
                display: 'inline-block',
                background: '#3D95CE',
                color: '#fff',
                padding: '0.9rem 2.5rem',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textDecoration: 'none',
                borderRadius: 4,
                marginBottom: '1rem',
              }}
            >
              Pay $6,000 on Venmo →
            </a>
            <p style={{ fontSize: 12, color: 'rgba(247,243,236,0.4)', marginTop: '1rem' }}>
              After payment, Donny will confirm your spot via text and you&apos;ll receive a confirmation email.
            </p>
          </div>
        )}

        {/* Full state */}
        {formState === 'full' && (
          <div
            style={{
              padding: '2rem',
              border: '1px solid rgba(184,151,58,0.3)',
              borderRadius: 2,
              background: 'rgba(184,151,58,0.05)',
            }}
          >
            <p style={{ color: '#D4AF5A', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Trip is Full
            </p>
            <p style={{ fontSize: 14, color: 'rgba(247,243,236,0.7)' }}>
              All 8 spots have been reserved. Contact Donny directly if you&apos;d like to be added to the
              waitlist.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
