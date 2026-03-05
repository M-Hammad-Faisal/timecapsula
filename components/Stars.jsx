'use client'

// ── Shared Stars component ─────────────────────────────────────────────────
// Used by: timecapsula (home), LoginPage, PrivacyPage, TermsPage.
// CSS for .stars-bg and .star-dot lives in app/globals.css.

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: (Math.random() * 3 + 2).toFixed(1),
  delay: (Math.random() * 5).toFixed(1),
  minOp: (Math.random() * 0.2 + 0.05).toFixed(2),
  maxOp: (Math.random() * 0.6 + 0.3).toFixed(2),
}))

export default function Stars() {
  return (
    <div className="stars-bg">
      {STARS.map(s => (
        <div
          key={s.id}
          className="star-dot"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--d': `${s.duration}s`,
            '--delay': `${s.delay}s`,
            '--min-op': s.minOp,
            '--max-op': s.maxOp,
          }}
        />
      ))}
    </div>
  )
}
