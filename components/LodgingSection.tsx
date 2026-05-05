export default function LodgingSection() {
  return (
    <section style={{ padding: '5rem 2rem', maxWidth: 900, margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        <div>
          <div className="section-label">Lodging</div>
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
            The Bandon Manor
          </h2>
          <p style={{ color: 'rgba(247,243,236,0.72)', fontSize: 15, lineHeight: 1.8 }}>
            Our home for the trip — a private manor offering an intimate and refined retreat steps
            from the courses.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Private exclusive-use property for the group',
              'Full-service staff and concierge',
              'Private dining and evening gatherings',
              'Walking distance to the clubhouse',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: 14,
                  color: 'rgba(247,243,236,0.65)',
                }}
              >
                <span style={{ color: '#B8973A', flexShrink: 0, marginTop: 2 }}>—</span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            aspectRatio: '4/3',
            backgroundImage: "url('/manor.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 2,
            border: '1px solid rgba(184,151,58,0.25)',
          }}
        />
      </div>
    </section>
  )
}
