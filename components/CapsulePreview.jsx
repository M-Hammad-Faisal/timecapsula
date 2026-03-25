'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

const styles = `
  .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; position: relative; z-index: 1; }

  .capsule-card {
    max-width: 560px; width: 100%;
    background: var(--cosmos); border: 1px solid rgba(232,168,76,0.2);
    border-radius: 8px; overflow: hidden;
    animation: fadeUp 0.8s ease forwards;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .card-header {
    background: linear-gradient(135deg, #0d1525, #111d35);
    padding: 2.5rem; text-align: center;
    border-bottom: 1px solid rgba(232,168,76,0.15);
  }
  .card-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--amber); margin-bottom: 1.5rem; }

  .envelope-wrap { margin: 0 auto 1.5rem; width: fit-content; animation: float 4s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  .card-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--parchment); margin-bottom: 0.5rem; line-height: 1.2; }
  .card-title em { font-style: italic; color: var(--amber); }
  .card-subtitle { color: var(--parchment-dim); font-size: 0.9rem; font-style: italic; }

  .card-body { padding: 2rem 2.5rem; }

  .info-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 1rem; }
  .info-row:last-of-type { border-bottom: none; }
  .info-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--amber); flex-shrink: 0; padding-top: 2px; }
  .info-value { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--parchment); text-align: right; }

  .sealed-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(232,168,76,0.08); border: 1px solid rgba(232,168,76,0.25);
    border-radius: 2px; padding: 0.5rem 1rem; margin: 1.5rem 0;
    font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.15em; text-transform: uppercase; color: var(--amber);
    width: 100%; justify-content: center;
  }
  .delivered-badge {
    background: rgba(100,200,100,0.08); border-color: rgba(100,200,100,0.25); color: #7dc97d;
  }

  .countdown { text-align: center; padding: 1.5rem 0 0; }
  .countdown-num { font-family: 'Playfair Display', serif; font-size: 4rem; font-weight: 700; color: var(--amber); line-height: 1; }
  .countdown-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--parchment-dim); margin-top: 0.25rem; }

  .divider { height: 1px; background: linear-gradient(to right,transparent,rgba(232,168,76,0.2),transparent); margin: 1.5rem 0; }

  .cta-section { text-align: center; padding: 0 2.5rem 2.5rem; }
  .cta-text { color: var(--parchment-dim); font-size: 0.9rem; font-style: italic; margin-bottom: 1.5rem; line-height: 1.6; }
  .btn-primary {
    background: var(--amber); color: var(--ink); border: none;
    padding: 0.9rem 2.5rem; font-family: 'Lora', serif; font-size: 0.95rem;
    cursor: pointer; border-radius: 2px; letter-spacing: 0.05em;
    transition: all 0.2s; box-shadow: 0 0 30px rgba(232,168,76,0.2);
    display: inline-block; text-decoration: none;
  }
  .btn-primary:hover { background: var(--gold); transform: translateY(-2px); }

  .logo-footer { font-family: 'Playfair Display', serif; font-size: 0.9rem; color: rgba(232,168,76,0.4); margin-top: 2rem; letter-spacing: 0.05em; }
  .logo-footer em { font-style: italic; }

  .loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .loading-text { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--amber); letter-spacing: 0.2em; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  .not-found { text-align: center; }
  .not-found-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.4; }
  .not-found-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--parchment-dim); }
  .share-hint { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.08em; color: rgba(232,168,76,0.55); background: rgba(232,168,76,0.04); border-bottom: 1px solid rgba(232,168,76,0.1); padding: 0.7rem 1.5rem; text-align: center; line-height: 1.5; }
`

// Stars — computed once at module level
const PREVIEW_STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: (Math.random() * 3 + 2).toFixed(1),
  delay: (Math.random() * 5).toFixed(1),
  minOp: (Math.random() * 0.2 + 0.05).toFixed(2),
  maxOp: (Math.random() * 0.5 + 0.2).toFixed(2),
}))

function Stars() {
  return (
    <div className="stars-bg">
      {PREVIEW_STARS.map(s => (
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

export default function CapsulePreview() {
  const params = useParams()
  const [capsule, setCapsule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetch_ = async () => {
      const res = await fetch(`/api/capsules/${params.id}`)
      const data = await res.json()
      if (!res.ok || !data.capsule) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setCapsule(data.capsule)
      setLoading(false)
    }
    if (params?.id) fetch_()
  }, [params?.id])

  const daysUntil = date =>
    Math.max(0, Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)))
  const formatDate = date =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  if (loading)
    return (
      <>
        <style>{styles}</style>
        <Stars />
        <div className="loading">
          <p className="loading-text">✦ &nbsp; unsealing preview &nbsp; ✦</p>
        </div>
      </>
    )

  if (notFound)
    return (
      <>
        <style>{styles}</style>
        <Stars />
        <div className="page">
          <div className="not-found">
            <div className="not-found-icon">🔒</div>
            <h2 className="not-found-title">This capsule is private or doesn't exist.</h2>
          </div>
        </div>
      </>
    )

  const days = daysUntil(capsule.deliver_at)

  return (
    <>
      <style>{styles}</style>
      <Stars />
      <div className="page">
        <div className="capsule-card">
          <div className="card-header">
            <p className="card-eyebrow">✦ &nbsp; time capsule &nbsp; ✦</p>
            <div className="envelope-wrap">
              <svg width="80" height="56" viewBox="0 0 220 154" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="216"
                  height="150"
                  rx="4"
                  fill="rgba(232,168,76,0.08)"
                  stroke="rgba(232,168,76,0.4)"
                  strokeWidth="1.5"
                />
                <path
                  d="M2 12 L110 80 L218 12"
                  stroke="rgba(232,168,76,0.5)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path d="M2 152 L75 82" stroke="rgba(232,168,76,0.3)" strokeWidth="1" />
                <path d="M218 152 L145 82" stroke="rgba(232,168,76,0.3)" strokeWidth="1" />
                <circle cx="110" cy="77" r="6" fill="rgba(232,168,76,0.6)" />
              </svg>
            </div>
            <h2 className="card-title">
              A message is <em>waiting</em>
              <br />
              to be opened.
            </h2>
            <p className="card-subtitle">Sealed with care. Delivered across time.</p>
          </div>

          <div className="card-body">
            <p className="share-hint">
              ✦ Send this link to your recipient so they can see their capsule is waiting.
            </p>
            <div className="info-row">
              <span className="info-label">To</span>
              <span className="info-value">{capsule.to_name}</span>
            </div>
            {capsule.from_name && (
              <div className="info-row">
                <span className="info-label">From</span>
                <span className="info-value">{capsule.from_name}</span>
              </div>
            )}
            {capsule.subject && (
              <div className="info-row">
                <span className="info-label">About</span>
                <span className="info-value" style={{ fontStyle: 'italic' }}>
                  "{capsule.subject}"
                </span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Opens on</span>
              <span className="info-value">{formatDate(capsule.deliver_at)}</span>
            </div>

            <div className={`sealed-badge ${capsule.delivered ? 'delivered-badge' : ''}`}>
              {capsule.delivered ? '✓ Delivered' : '⏳ Sealed & waiting'}
            </div>

            {!capsule.delivered && days > 0 && (
              <div className="countdown">
                <div className="countdown-num">{days.toLocaleString()}</div>
                <div className="countdown-label">days until delivery</div>
              </div>
            )}
          </div>

          <div className="divider" style={{ margin: '0 2.5rem' }} />

          <div className="cta-section">
            <p className="cta-text">
              Want to send a message that travels through time?
              <br />
              Write your own capsule — free, forever.
            </p>
            <a className="btn-primary" href="https://timecapsula.website">
              ✦ Create Your Capsule
            </a>
          </div>
        </div>

        <p className="logo-footer">
          Time<em>Capsula</em>
        </p>
      </div>
    </>
  )
}
