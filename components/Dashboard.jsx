'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;500&family=JetBrains+Mono:wght@300;400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --midnight: #080c14;
    --cosmos: #0d1525;
    --nebula: #111d35;
    --amber: #e8a84c;
    --gold: #f5c842;
    --parchment: #f2e8d5;
    --parchment-dim: #c8b898;
    --ink: #1a1005;
  }
  body { font-family: 'Lora', serif; background: var(--midnight); color: var(--parchment); min-height: 100vh; }

  /* NAV */
  nav {
    padding: 1.2rem 3rem;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(232,168,76,0.1);
    background: rgba(8,12,20,0.9);
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(12px);
  }
  .logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--amber); cursor: pointer; }
  .logo em { font-style: italic; color: var(--gold); }
  .nav-right { display: flex; align-items: center; gap: 1.5rem; }
  .user-email { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--parchment-dim); }
  .btn-sm {
    font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.5rem 1.2rem; border-radius: 2px; cursor: pointer;
    transition: all 0.2s; border: none;
  }
  .btn-primary { background: var(--amber); color: var(--ink); }
  .btn-primary:hover { background: var(--gold); }
  .btn-ghost { background: transparent; color: var(--parchment-dim); border: 1px solid rgba(232,168,76,0.2); }
  .btn-ghost:hover { border-color: var(--amber); color: var(--amber); }

  /* LAYOUT */
  .dashboard { max-width: 1000px; margin: 0 auto; padding: 3rem 2rem; }

  .page-header { margin-bottom: 3rem; }
  .page-eyebrow {
    font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.3em; text-transform: uppercase; color: var(--amber); margin-bottom: 0.75rem;
  }
  .page-title { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: var(--parchment); line-height: 1.2; }
  .page-title em { font-style: italic; color: var(--amber); }

  /* STATS */
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 3rem; }
  .stat-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(232,168,76,0.1);
    border-radius: 4px; padding: 1.5rem;
  }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: var(--amber); line-height: 1; margin-bottom: 0.3rem; }
  .stat-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--parchment-dim); }

  /* CAPSULE LIST */
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .section-title-sm { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--parchment); }

  .capsule-list { display: flex; flex-direction: column; gap: 1rem; }

  .capsule-card {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(232,168,76,0.1);
    border-radius: 4px; padding: 1.5rem 2rem;
    display: grid; grid-template-columns: 1fr auto;
    gap: 1rem; align-items: center;
    transition: all 0.2s;
  }
  .capsule-card:hover { border-color: rgba(232,168,76,0.25); background: rgba(232,168,76,0.03); }

  .capsule-to { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--parchment); margin-bottom: 0.3rem; }
  .capsule-subject { font-size: 0.85rem; color: var(--parchment-dim); font-style: italic; margin-bottom: 0.5rem; }
  .capsule-meta { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
  .capsule-date { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--parchment-dim); }

  .badge {
    font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 3px 10px; border-radius: 2px;
  }
  .badge-pending { background: rgba(232,168,76,0.1); color: var(--amber); border: 1px solid rgba(232,168,76,0.3); }
  .badge-delivered { background: rgba(100,200,100,0.1); color: #7dc97d; border: 1px solid rgba(100,200,100,0.3); }

  .days-left { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: rgba(232,168,76,0.4); text-align: right; line-height: 1; }
  .days-label { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--parchment-dim); text-align: right; letter-spacing: 0.1em; text-transform: uppercase; }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 5rem 2rem; }
  .empty-icon { font-size: 3rem; margin-bottom: 1.5rem; opacity: 0.5; }
  .empty-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--parchment-dim); margin-bottom: 0.75rem; }
  .empty-desc { color: rgba(200,184,152,0.5); font-size: 0.9rem; margin-bottom: 2rem; font-style: italic; }

  /* LOGIN SCREEN */
  .login-screen {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--midnight); padding: 2rem;
  }
  .login-card {
    background: var(--cosmos); border: 1px solid rgba(232,168,76,0.15);
    border-radius: 4px; padding: 3rem; max-width: 440px; width: 100%; text-align: center;
  }
  .login-icon { font-size: 2.5rem; margin-bottom: 1.5rem; }
  .login-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--parchment); margin-bottom: 0.75rem; }
  .login-desc { color: var(--parchment-dim); font-size: 0.95rem; line-height: 1.7; margin-bottom: 2rem; font-style: italic; }
  .form-group { margin-bottom: 1rem; text-align: left; }
  .form-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--amber); margin-bottom: 0.5rem; }
  .form-input {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(232,168,76,0.15);
    border-radius: 2px; padding: 0.85rem 1rem; color: var(--parchment);
    font-family: 'Lora', serif; font-size: 0.95rem; outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--amber); }
  .form-input::placeholder { color: rgba(200,184,152,0.3); font-style: italic; }
  .btn-full { width: 100%; padding: 0.9rem; font-size: 0.9rem; margin-top: 0.5rem; }
  .login-note { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: rgba(200,184,152,0.4); margin-top: 1rem; letter-spacing: 0.05em; }

  /* SUCCESS MAGIC LINK */
  .magic-sent { text-align: center; }
  .magic-icon { font-size: 3rem; margin-bottom: 1rem; animation: float 4s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .magic-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--amber); margin-bottom: 0.75rem; }
  .magic-desc { color: var(--parchment-dim); font-size: 0.9rem; line-height: 1.7; }

  /* LOADING */
  .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .loading-text { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--amber); letter-spacing: 0.2em; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  @media (max-width: 600px) {
    nav { padding: 1rem; }
    .stats { grid-template-columns: 1fr 1fr; }
    .capsule-card { grid-template-columns: 1fr; }
    .days-left { text-align: left; }
  }
`

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) await fetchCapsules()
      setLoading(false)
    }
    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) await fetchCapsules()
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCapsules = async () => {
    const res = await fetch('/api/capsules')
    const data = await res.json()
    if (data.capsules) setCapsules(data.capsules)
  }

  const signIn = async () => {
    if (!email) return
    setSigningIn(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setSigningIn(false)
    if (!error) setMagicSent(true)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCapsules([])
  }

  const daysUntil = date => {
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  const formatDate = date =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  // ── Loading ──
  if (loading)
    return (
      <>
        <style>{styles}</style>
        <div className="loading">
          <p className="loading-text">✦ &nbsp; opening vault &nbsp; ✦</p>
        </div>
      </>
    )

  // ── Not logged in ──
  if (!user)
    return (
      <>
        <style>{styles}</style>
        <div className="login-screen">
          <div className="login-card">
            {magicSent ? (
              <div className="magic-sent">
                <div className="magic-icon">📬</div>
                <h2 className="magic-title">Check your inbox</h2>
                <p className="magic-desc">
                  A magic link is on its way to{' '}
                  <strong style={{ color: 'var(--amber)' }}>{email}</strong>.
                  <br />
                  <br />
                  Click it to enter your vault. No password needed — ever.
                </p>
              </div>
            ) : (
              <>
                <div className="login-icon">🔐</div>
                <h2 className="login-title">Your Vault</h2>
                <p className="login-desc">
                  Sign in to see all your sealed capsules and track their journey through time.
                </p>
                <div className="form-group">
                  <label className="form-label">Your email address</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && signIn()}
                  />
                </div>
                <button
                  className="btn-sm btn-primary btn-full"
                  onClick={signIn}
                  disabled={signingIn}
                >
                  {signingIn ? '✦ Sending magic link...' : '✦ Send Magic Link'}
                </button>
                <p className="login-note">No password. No fuss. Just a link in your inbox.</p>
              </>
            )}
          </div>
        </div>
      </>
    )

  // ── Dashboard ──
  const pending = capsules.filter(c => !c.delivered).length
  const delivered = capsules.filter(c => c.delivered).length

  return (
    <>
      <style>{styles}</style>

      <nav>
        <div className="logo" onClick={() => (window.location.href = '/')}>
          Time<em>Capsula</em>
        </div>
        <div className="nav-right">
          <span className="user-email">{user.email}</span>
          <button className="btn-sm btn-primary" onClick={() => (window.location.href = '/#write')}>
            + New Capsule
          </button>
          <button className="btn-sm btn-ghost" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard">
        <div className="page-header">
          <p className="page-eyebrow">✦ Your vault</p>
          <h1 className="page-title">
            Your sealed <em>capsules.</em>
          </h1>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{capsules.length}</div>
            <div className="stat-label">Total Capsules</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Sealed & Waiting</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{delivered}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>

        {/* Capsule list */}
        <div className="section-header">
          <h2 className="section-title-sm">All Capsules</h2>
        </div>

        {capsules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✉️</div>
            <h3 className="empty-title">No capsules yet</h3>
            <p className="empty-desc">
              Your vault is empty. Seal your first message to someone you love.
            </p>
            <button
              className="btn-sm btn-primary"
              onClick={() => (window.location.href = '/#write')}
            >
              Write Your First Capsule
            </button>
          </div>
        ) : (
          <div className="capsule-list">
            {capsules.map(c => (
              <div className="capsule-card" key={c.id}>
                <div>
                  <div className="capsule-to">To: {c.to_name}</div>
                  {c.subject && <div className="capsule-subject">"{c.subject}"</div>}
                  <div className="capsule-meta">
                    <span className="capsule-date">
                      {c.delivered
                        ? `Delivered ${formatDate(c.deliver_at)}`
                        : `Opens ${formatDate(c.deliver_at)}`}
                    </span>
                    <span className={`badge ${c.delivered ? 'badge-delivered' : 'badge-pending'}`}>
                      {c.delivered ? '✓ Delivered' : '⏳ Sealed'}
                    </span>
                  </div>
                </div>
                {!c.delivered && (
                  <div>
                    <div className="days-left">{daysUntil(c.deliver_at).toLocaleString()}</div>
                    <div className="days-label">days left</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
