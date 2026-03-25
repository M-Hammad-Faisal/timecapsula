'use client'

export default function GlobalError({ error: _error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "'Lora', Georgia, serif",
          background: '#080c14',
          color: '#f2e8d5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#e8a84c',
            marginBottom: '1.5rem',
          }}
        >
          ✦ &nbsp; Something went wrong &nbsp; ✦
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            marginBottom: '1rem',
            lineHeight: 1.1,
          }}
        >
          An unexpected <em style={{ color: '#e8a84c', fontStyle: 'italic' }}>error</em> occurred.
        </h1>
        <p
          style={{
            color: '#c8b898',
            fontSize: '0.95rem',
            maxWidth: '480px',
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}
        >
          Your capsules are safe. Try refreshing — if the issue persists, email{' '}
          <a href="mailto:hello@timecapsula.website" style={{ color: '#e8a84c' }}>
            hello@timecapsula.website
          </a>
          .
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              background: '#e8a84c',
              color: '#1a1005',
              border: 'none',
              padding: '0.85rem 2rem',
              fontFamily: "'Lora', serif",
              fontSize: '0.95rem',
              cursor: 'pointer',
              borderRadius: '2px',
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              background: 'transparent',
              color: '#c8b898',
              border: '1px solid rgba(232,168,76,0.25)',
              padding: '0.85rem 2rem',
              fontFamily: "'Lora', serif",
              fontSize: '0.95rem',
              cursor: 'pointer',
              borderRadius: '2px',
              textDecoration: 'none',
            }}
          >
            Back to home
          </a>
        </div>
      </body>
    </html>
  )
}
