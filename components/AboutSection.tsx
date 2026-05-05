export default function AboutSection() {
  return (
    <section
      style={{
        padding: '5rem 2rem',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <div className="section-label">About the Trip</div>
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
        Four days on the Oregon coast
      </h2>
      <p style={{ color: 'rgba(247,243,236,0.72)', fontSize: 15, lineHeight: 1.8 }}>
        Join us for an exclusive golf experience at one of the world&apos;s most celebrated links
        destinations. Nestled on the rugged cliffs of the Pacific, Bandon Dunes Golf Resort offers
        courses crafted by the game&apos;s greatest architects — a pilgrimage for anyone who loves the
        way golf was meant to be played.
      </p>
      <p style={{ color: 'rgba(247,243,236,0.72)', fontSize: 15, lineHeight: 1.8, marginTop: '1rem' }}>
        This is a caddie-only, walking experience. No carts. No distractions. Just the wind, the
        fairways, and great company.
      </p>
    </section>
  )
}
