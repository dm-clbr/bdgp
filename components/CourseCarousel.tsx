'use client'

const courses = [
  { name: 'Bandon Dunes', rank: '#4 World', year: '1999' },
  { name: 'Pacific Dunes', rank: '#6 World', year: '2001' },
  { name: 'Bandon Trails', rank: '#22 World', year: '2005' },
  { name: 'Old Macdonald', rank: '#48 World', year: '2010' },
  { name: 'Bandon Preserve', rank: 'Par 3', year: '2012' },
  { name: 'Sheep Ranch', rank: '#11 World', year: '2020' },
]

function CourseItem({ name, rank, year }: { name: string; rank: string; year: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        whiteSpace: 'nowrap',
        padding: '0 1.75rem',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontStyle: 'italic',
          fontSize: '1.1rem',
          color: '#F7F3EC',
          letterSpacing: '0.03em',
        }}
      >
        {name}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: '#1A1A14',
            background: '#B8973A',
            padding: '2px 8px',
            borderRadius: 2,
          }}
        >
          {rank}
        </span>
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'rgba(247,243,236,0.4)',
            textTransform: 'uppercase',
          }}
        >
          {year}
        </span>
      </div>
    </div>
  )
}

function Dot() {
  return (
    <div
      style={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: 'rgba(184,151,58,0.25)',
        flexShrink: 0,
      }}
    />
  )
}

export default function CourseCarousel() {
  const items = [...courses, ...courses] // duplicate for seamless loop

  return (
    <div
      style={{
        padding: '2.5rem 0',
        background: 'rgba(0,0,0,0.25)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(184,151,58,0.25)',
        borderBottom: '1px solid rgba(184,151,58,0.25)',
      }}
    >
      <div
        className="animate-ticker"
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          gap: '0',
        }}
      >
        {items.map((course, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <CourseItem {...course} />
            <Dot />
          </span>
        ))}
      </div>
    </div>
  )
}
