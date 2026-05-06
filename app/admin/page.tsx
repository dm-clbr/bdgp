'use client'

import { useState, useEffect, useCallback } from 'react'
import type { RSVP, ScheduleDay, ScheduleRound } from '@/lib/supabase'

const dark = '#1A1A14'
const gold = '#B8973A'
const goldLight = '#D4AF5A'
const cream = '#F7F3EC'
const border = 'rgba(184,151,58,0.25)'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'rsvps' | 'schedule'>('rsvps')

  // RSVP state
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Schedule state
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([])
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [scheduleSaving, setScheduleSaving] = useState(false)
  const [scheduleSaveMsg, setScheduleSaveMsg] = useState('')

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

  const fetchSchedule = useCallback(async () => {
    setScheduleLoading(true)
    setScheduleSaveMsg('')
    try {
      const res = await fetch('/api/admin/schedule')
      if (res.status === 401) { setAuthed(false); return }
      const data = await res.json()
      setScheduleData(Array.isArray(data) ? data : [])
    } finally {
      setScheduleLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed && activeTab === 'rsvps') fetchRsvps()
  }, [authed, activeTab, fetchRsvps])

  useEffect(() => {
    if (authed && activeTab === 'schedule') fetchSchedule()
  }, [authed, activeTab, fetchSchedule])

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

  // Schedule mutation helpers
  const updateDay = (dayIdx: number, field: keyof Pick<ScheduleDay, 'date' | 'day'>, value: string) => {
    setScheduleData(prev => prev.map((d, i) => i === dayIdx ? { ...d, [field]: value } : d))
  }

  const updateRound = (dayIdx: number, roundIdx: number, field: keyof ScheduleRound, value: string) => {
    setScheduleData(prev => prev.map((d, i) =>
      i === dayIdx
        ? { ...d, rounds: d.rounds.map((r, j) => j === roundIdx ? { ...r, [field]: value } : r) }
        : d
    ))
  }

  const addRound = (dayIdx: number) => {
    setScheduleData(prev => prev.map((d, i) =>
      i === dayIdx ? { ...d, rounds: [...d.rounds, { course: '', time: '', players: '8 players' }] } : d
    ))
  }

  const removeRound = (dayIdx: number, roundIdx: number) => {
    setScheduleData(prev => prev.map((d, i) =>
      i === dayIdx ? { ...d, rounds: d.rounds.filter((_, j) => j !== roundIdx) } : d
    ))
  }

  const addDay = () => {
    setScheduleData(prev => [...prev, { date: '', day: '', rounds: [{ course: '', time: '', players: '8 players' }] }])
  }

  const removeDay = (dayIdx: number) => {
    setScheduleData(prev => prev.filter((_, i) => i !== dayIdx))
  }

  const saveSchedule = async () => {
    setScheduleSaving(true)
    setScheduleSaveMsg('')
    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData),
      })
      setScheduleSaveMsg(res.ok ? 'Saved successfully.' : 'Error saving — try again.')
    } finally {
      setScheduleSaving(false)
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
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${border}` }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: goldLight, margin: 0 }}>
              BDGP Admin
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(247,243,236,0.4)', margin: '0.25rem 0 0', letterSpacing: '0.1em' }}>
              Bandon Dunes 2026
            </p>
          </div>
          {activeTab === 'rsvps' && (
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: 13 }}>
              <span style={{ color: goldLight }}><strong>{confirmed}</strong> confirmed</span>
              <span style={{ color: 'rgba(247,243,236,0.5)' }}><strong>{pending}</strong> pending</span>
              <span style={{ color: 'rgba(247,243,236,0.5)' }}><strong>{8 - confirmed}</strong> remaining</span>
            </div>
          )}
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', marginBottom: '1.75rem', borderBottom: `1px solid ${border}` }}>
          {(['rsvps', 'schedule'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${gold}` : '2px solid transparent',
                color: activeTab === tab ? goldLight : 'rgba(247,243,236,0.4)',
                padding: '0.65rem 1.25rem',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
                marginBottom: -1,
              }}
            >
              {tab === 'rsvps' ? 'RSVPs' : 'Schedule'}
            </button>
          ))}
        </div>

        {/* ── RSVP TAB ── */}
        {activeTab === 'rsvps' && (
          <>
            <button
              onClick={fetchRsvps}
              style={{ marginBottom: '1.5rem', background: 'transparent', border: `1px solid ${border}`, color: goldLight, padding: '0.5rem 1.25rem', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>

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
          </>
        )}

        {/* ── SCHEDULE TAB ── */}
        {activeTab === 'schedule' && (
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                onClick={fetchSchedule}
                disabled={scheduleLoading}
                style={actionBtnStyle('transparent', goldLight, `1px solid ${border}`)}
              >
                {scheduleLoading ? 'Loading…' : 'Reload'}
              </button>
              <button
                onClick={saveSchedule}
                disabled={scheduleSaving || scheduleLoading}
                style={actionBtnStyle(gold, dark)}
              >
                {scheduleSaving ? 'Saving…' : 'Save Changes'}
              </button>
              {scheduleSaveMsg && (
                <span style={{
                  fontSize: 12,
                  color: scheduleSaveMsg.startsWith('Error') ? '#e57373' : goldLight,
                  letterSpacing: '0.05em',
                }}>
                  {scheduleSaveMsg}
                </span>
              )}
            </div>

            {scheduleLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(247,243,236,0.3)', fontSize: 13 }}>
                Loading schedule…
              </div>
            ) : (
              <div>
                {scheduleData.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    style={{
                      marginBottom: '1.5rem',
                      border: `1px solid ${border}`,
                      borderRadius: 4,
                      padding: '1.5rem',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {/* Day header row */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        value={day.date}
                        onChange={(e) => updateDay(dayIdx, 'date', e.target.value)}
                        placeholder="Date (e.g. September 14)"
                        style={inputStyle('200px')}
                      />
                      <input
                        value={day.day}
                        onChange={(e) => updateDay(dayIdx, 'day', e.target.value)}
                        placeholder="Weekday"
                        style={inputStyle('130px')}
                      />
                      <button
                        onClick={() => removeDay(dayIdx)}
                        style={actionBtnStyle('transparent', '#e57373', '1px solid rgba(229,115,115,0.3)')}
                      >
                        Remove Day
                      </button>
                    </div>

                    {/* Column labels */}
                    {day.rounds.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px 36px', gap: '0.5rem', marginBottom: '0.4rem', paddingLeft: '0.75rem' }}>
                        {['Course', 'Tee Time', 'Players', ''].map((label) => (
                          <span key={label} style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: gold }}>
                            {label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rounds */}
                    <div style={{ paddingLeft: '0.75rem' }}>
                      {day.rounds.map((round, roundIdx) => (
                        <div
                          key={roundIdx}
                          style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px 36px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}
                        >
                          <input
                            value={round.course}
                            onChange={(e) => updateRound(dayIdx, roundIdx, 'course', e.target.value)}
                            placeholder="Course name"
                            style={inputStyle()}
                          />
                          <input
                            value={round.time}
                            onChange={(e) => updateRound(dayIdx, roundIdx, 'time', e.target.value)}
                            placeholder="e.g. 9:10 AM"
                            style={inputStyle()}
                          />
                          <input
                            value={round.players}
                            onChange={(e) => updateRound(dayIdx, roundIdx, 'players', e.target.value)}
                            placeholder="e.g. 8 players"
                            style={inputStyle()}
                          />
                          <button
                            onClick={() => removeRound(dayIdx, roundIdx)}
                            title="Remove round"
                            style={{
                              ...actionBtnStyle('transparent', '#e57373', '1px solid rgba(229,115,115,0.3)'),
                              padding: '0.4rem 0',
                              width: 36,
                              textAlign: 'center',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => addRound(dayIdx)}
                        style={{ ...actionBtnStyle('transparent', 'rgba(247,243,236,0.4)', `1px solid rgba(184,151,58,0.15)`), marginTop: '0.5rem' }}
                      >
                        + Add Round
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addDay}
                  style={actionBtnStyle('transparent', goldLight, `1px solid ${border}`)}
                >
                  + Add Day
                </button>
              </div>
            )}
          </div>
        )}

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

function inputStyle(width: string = '100%'): React.CSSProperties {
  return {
    width,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(184,151,58,0.25)',
    color: '#F7F3EC',
    padding: '0.5rem 0.75rem',
    fontFamily: 'inherit',
    fontSize: 13,
    borderRadius: 2,
    outline: 'none',
    boxSizing: 'border-box',
  }
}
