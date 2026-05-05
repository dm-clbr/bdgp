'use client'

import { useState, useEffect, useCallback } from 'react'
import type { RSVP } from '@/lib/supabase'

const dark = '#1A1A14'
const gold = '#B8973A'
const goldLight = '#D4AF5A'
const cream = '#F7F3EC'
const border = 'rgba(184,151,58,0.25)'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchRsvps = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/rsvps')
      if (res.status === 401) { setAuthed(false); return }
      const data = await res.json()
      setRsvps(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchRsvps()
  }, [authed, fetchRsvps])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthed(true)
    } else {
      setLoginError('Incorrect password.')
    }
  }

  const handleAction = async (id: string, action: 'confirm' | 'unconfirm' | 'resend_email') => {
    setActionLoading(id + action)
    try {
      const res = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      if (res.ok) await fetchRsvps()
      else alert('Action failed.')
    } finally {
      setActionLoading(null)
    }
  }

  if (!authed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: dark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            border: `1px solid ${border}`,
            padding: '2.5rem',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.03)',
            width: '100%',
            maxWidth: 360,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: goldLight, marginBottom: '1.5rem' }}>
            BDGP Admin
          </div>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${border}`,
              color: cream,
              padding: '0.85rem 1rem',
              fontFamily: 'inherit',
              fontSize: 14,
              borderRadius: 2,
              marginBottom: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {loginError && <p style={{ color: '#e57373', fontSize: 13, marginBottom: '1rem' }}>{loginError}</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'transparent',
              border: `1px solid ${gold}`,
              color: goldLight,
              padding: '0.85rem',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    )
  }

  const confirmed = rsvps.filter((r) => r.status === 'confirmed').length
  const pending = rsvps.filter((r) => r.status === 'pending').length

  return (
    <div style={{ minHeight: '100vh', background: dark, color: cream, padding: '2rem', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: `1px solid ${border}` }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: goldLight, margin: 0 }}>
              BDGP Admin
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(247,243,236,0.4)', margin: '0.25rem 0 0', letterSpacing: '0.1em' }}>
              Bandon Dunes 2026 · RSVP Management
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: 13 }}>
            <span style={{ color: goldLight }}><strong>{confirmed}</strong> confirmed</span>
            <span style={{ color: 'rgba(247,243,236,0.5)' }}><strong>{pending}</strong> pending</span>
            <span style={{ color: 'rgba(247,243,236,0.5)' }}><strong>{8 - confirmed}</strong> remaining</span>
          </div>
        </div>

        <button
          onClick={fetchRsvps}
          style={{ marginBottom: '1.5rem', background: 'transparent', border: `1px solid ${border}`, color: goldLight, padding: '0.5rem 1.25rem', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {['Name', 'Email', 'Phone', 'Shirt', 'Shoe', 'Code', 'Status', 'Created', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: gold,
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rsvps.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'rgba(247,243,236,0.3)', fontSize: 13 }}>
                    {loading ? 'Loading…' : 'No RSVPs yet.'}
                  </td>
                </tr>
              )}
              {rsvps.map((rsvp) => (
                <tr
                  key={rsvp.id}
                  style={{
                    borderBottom: '1px solid rgba(184,151,58,0.08)',
                    background: rsvp.status === 'confirmed' ? 'rgba(184,151,58,0.04)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem', color: cream }}>{rsvp.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(247,243,236,0.7)' }}>{rsvp.email}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(247,243,236,0.7)' }}>{rsvp.phone}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(247,243,236,0.7)' }}>{rsvp.shirt_size}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(247,243,236,0.7)' }}>{rsvp.shoe_size}</td>
                  <td style={{ padding: '0.85rem 1rem', color: goldLight, letterSpacing: '0.1em', fontFamily: 'monospace' }}>{rsvp.booking_code}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: 2,
                        background: rsvp.status === 'confirmed' ? 'rgba(184,151,58,0.2)' : 'rgba(255,255,255,0.06)',
                        color: rsvp.status === 'confirmed' ? goldLight : 'rgba(247,243,236,0.5)',
                      }}
                    >
                      {rsvp.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(247,243,236,0.4)', fontSize: 12 }}>
                    {new Date(rsvp.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {rsvp.status !== 'confirmed' ? (
                        <button
                          onClick={() => handleAction(rsvp.id, 'confirm')}
                          disabled={actionLoading === rsvp.id + 'confirm'}
                          style={actionBtnStyle('#B8973A', '#1A1A14')}
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(rsvp.id, 'unconfirm')}
                          disabled={actionLoading === rsvp.id + 'unconfirm'}
                          style={actionBtnStyle('transparent', 'rgba(247,243,236,0.4)', '1px solid rgba(184,151,58,0.2)')}
                        >
                          Unconfirm
                        </button>
                      )}
                      {rsvp.status === 'confirmed' && (
                        <button
                          onClick={() => handleAction(rsvp.id, 'resend_email')}
                          disabled={actionLoading === rsvp.id + 'resend_email'}
                          style={actionBtnStyle('transparent', goldLight, `1px solid ${border}`)}
                        >
                          Resend Email
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function actionBtnStyle(bg: string, color: string, border = 'none'): React.CSSProperties {
  return {
    background: bg,
    color,
    border,
    padding: '0.4rem 0.75rem',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: 2,
    fontFamily: 'inherit',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  }
}
