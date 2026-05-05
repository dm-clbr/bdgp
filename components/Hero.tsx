export default function Hero() {
  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '5rem',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(26,26,20,0.2) 0%, rgba(26,26,20,0.15) 40%, rgba(26,26,20,0.85) 80%, rgba(26,26,20,1) 100%)',
        }}
      />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#D4AF5A',
            marginBottom: '1rem',
          }}
        >
          You&apos;re Invited
        </p>
        <img
          src="/logo/SVG/big-logo.svg"
          alt="Bandon Dunes Golf Partners"
          style={{
            width: 'clamp(280px, 55vw, 720px)',
            height: 'auto',
            marginBottom: '2rem',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(247,243,236,0.7)',
            }}
          >
            Bandon, Oregon
          </span>
          <div
            style={{
              width: 1,
              height: 20,
              background: '#B8973A',
              opacity: 0.5,
            }}
          />
          <span
            style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(247,243,236,0.7)',
            }}
          >
            Sept 14–17, 2026
          </span>
        </div>
      </div>
    </div>
  )
}
