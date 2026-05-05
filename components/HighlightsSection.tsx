const highlights = [
  {
    title: 'Six Courses',
    desc: 'Bandon Dunes, Sheep Ranch, Pacific Dunes, Bandon Preserve, Old Macdonald & Bandon Trails',
  },
  {
    title: 'Private Manor',
    desc: 'Exclusive stay at The Bandon Manor — private lodging for the full group throughout the trip',
  },
  {
    title: 'Private Dinners',
    desc: 'Curated private dining experiences each evening of the trip',
  },
  {
    title: 'Caddie Services',
    desc: 'Professional caddies for every round — carry bags only, walk the links as intended',
  },
  {
    title: 'BDGP Gear Kit',
    desc: 'Custom branded polo, hoodie, t-shirt, golf balls, and shoes — yours to keep',
  },
]

const gearItems = [
  { label: 'BDGP Polo Shirt', note: 'Size collected at RSVP' },
  { label: 'BDGP Hoodie', note: 'Size collected at RSVP' },
  { label: 'BDGP T-Shirt', note: 'Size collected at RSVP' },
  { label: 'BDGP Golf Balls', note: 'Personalized set' },
  { label: 'BDGP Shoes', note: 'Size collected at RSVP' },
]

export default function HighlightsSection() {
  return (
    <>
      {/* Highlights grid */}
      <section style={{ padding: '5rem 2rem', maxWidth: 900, margin: '0 auto' }}>
        <div className="section-label">Trip Highlights</div>
        <h2
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontWeight: 400,
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: '#F7F3EC',
            marginBottom: '1.25rem',
            lineHeight: 1.3,
          }}
        >
          Everything included
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginTop: '2.5rem',
          }}
        >
          {highlights.map((h) => (
            <div
              key={h.title}
              style={{
                border: '1px solid rgba(184,151,58,0.25)',
                padding: '1.75rem 1.5rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
              }}
            >
              <h3
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#D4AF5A',
                  marginBottom: '0.5rem',
                }}
              >
                {h.title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(247,243,236,0.6)', lineHeight: 1.6 }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gear Kit section */}
      <div className="gold-divider" />
      <section style={{ padding: '5rem 2rem', maxWidth: 900, margin: '0 auto' }}>
        <div className="section-label">BDGP Gear Kit</div>
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
          Your kit awaits
        </h2>
        <p style={{ color: 'rgba(247,243,236,0.72)', fontSize: 15, lineHeight: 1.8, marginBottom: '2.5rem' }}>
          Every guest receives a full set of BDGP branded gear, custom-sized to you.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}
        >
          {gearItems.map((item) => (
            <div
              key={item.label}
              style={{
                border: '1px solid rgba(184,151,58,0.25)',
                padding: '1.5rem 1.25rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#D4AF5A',
                  marginBottom: '0.4rem',
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(247,243,236,0.4)', letterSpacing: '0.05em' }}>
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
