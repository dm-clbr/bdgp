import { supabaseAdmin } from '@/lib/supabase'
import type { ScheduleDay } from '@/lib/supabase'

const fallbackSchedule: ScheduleDay[] = [
  {
    date: 'September 14',
    day: 'Monday',
    rounds: [{ course: 'Bandon Dunes', time: '3:00 PM', players: '8 players' }],
  },
  {
    date: 'September 15',
    day: 'Tuesday',
    rounds: [
      { course: 'Sheep Ranch', time: '9:10 AM', players: '8 players' },
      { course: 'Pacific Dunes', time: '3:10 PM', players: '8 players' },
    ],
  },
  {
    date: 'September 16',
    day: 'Wednesday',
    rounds: [
      { course: 'Bandon Preserve', time: '8:00 AM', players: '8 players' },
      { course: 'Old Macdonald', time: '12:30 PM', players: '8 players' },
    ],
  },
  {
    date: 'September 17',
    day: 'Thursday',
    rounds: [{ course: 'Bandon Trails', time: '9:20 AM', players: '8 players' }],
  },
]

async function getSchedule(): Promise<ScheduleDay[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('schedule_data')
      .select('schedule')
      .eq('id', 'main')
      .single()
    if (error || !data) return fallbackSchedule
    return (data.schedule as ScheduleDay[]) ?? fallbackSchedule
  } catch {
    return fallbackSchedule
  }
}

export default async function TeeTimesSection() {
  const schedule = await getSchedule()

  return (
    <div style={{ padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="section-label">Tee Times</div>
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
          The full schedule
        </h2>
        <p style={{ color: 'rgba(247,243,236,0.72)', fontSize: 15, lineHeight: 1.8 }}>
          All times listed are local (Pacific). Courses are walking-only with caddies.
        </p>
        <div style={{ marginTop: '2.5rem' }}>
          {schedule.map((day) => (
            <div key={day.date} style={{ marginBottom: '2.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1rem',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(184,151,58,0.25)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    color: '#F7F3EC',
                  }}
                >
                  {day.date}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#B8973A',
                    fontWeight: 500,
                  }}
                >
                  {day.day}
                </span>
              </div>
              {day.rounds.map((round) => (
                <div
                  key={round.course + round.time}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'center',
                    padding: '0.7rem 0',
                    borderBottom: '1px solid rgba(184,151,58,0.08)',
                    gap: '1rem',
                  }}
                >
                  <span style={{ fontSize: 14, color: 'rgba(247,243,236,0.85)' }}>{round.course}</span>
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: 13,
                      color: '#D4AF5A',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {round.time}
                  </span>
                  <span style={{ fontSize: 12, color: '#7A7768', letterSpacing: '0.1em' }}>
                    {round.players}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
