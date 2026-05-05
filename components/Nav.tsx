export default function Nav() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        background: 'linear-gradient(to bottom, rgba(26,26,20,0.95), transparent)',
      }}
    >
      <div
        style={{
          fontWeight: 500,
          fontSize: 13,
          letterSpacing: '0.25em',
          color: '#D4AF5A',
          textTransform: 'uppercase',
        }}
      >
        BDGP
      </div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: '0.15em',
          color: 'rgba(247,243,236,0.5)',
          textTransform: 'uppercase',
        }}
      >
        Sept 14–17 · 2026
      </div>
    </nav>
  )
}
