'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'
import Stars from './Stars'

const styles = `
  .page { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; position:relative; z-index:1; }
  .back-link { position:fixed; top:1.5rem; left:2rem; font-family:'JetBrains Mono',monospace; font-size:0.7rem; letter-spacing:0.1em; color:var(--dim); text-decoration:none; display:flex; align-items:center; gap:0.5rem; transition:color 0.2s; z-index:10; }
  .back-link:hover { color:var(--amber); }
  .logo-top { position:fixed; top:1.4rem; right:2rem; font-family:'Playfair Display',serif; font-size:1.2rem; color:var(--amber); text-decoration:none; z-index:10; }
  .logo-top em { font-style:italic; color:var(--gold); }
  .login-card { background:var(--cosmos); border:1px solid rgba(232,168,76,0.15); border-radius:6px; padding:3rem 3.5rem; max-width:460px; width:100%; animation:fadeUp 0.6s ease forwards; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .card-eyebrow { font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--amber); margin-bottom:1.5rem; text-align:center; }
  .card-title { font-family:'Playfair Display',serif; font-size:2rem; color:var(--parchment); text-align:center; margin-bottom:0.6rem; }
  .card-title em { font-style:italic; color:var(--amber); }
  .card-desc { color:var(--dim); font-size:0.9rem; line-height:1.7; text-align:center; font-style:italic; margin-bottom:2rem; }
  .form-label { display:block; font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--amber); margin-bottom:0.5rem; }
  .form-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(232,168,76,0.15); border-radius:2px; padding:0.9rem 1rem; color:var(--parchment); font-family:'Lora',serif; font-size:0.95rem; outline:none; transition:border-color 0.2s; margin-bottom:1rem; }
  .form-input:focus { border-color:var(--amber); background:rgba(232,168,76,0.03); }
  .form-input::placeholder { color:rgba(200,184,152,0.35); font-style:italic; }
  .btn-primary { width:100%; background:var(--amber); color:var(--ink); border:none; padding:0.95rem; font-family:'JetBrains Mono',monospace; font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer; border-radius:2px; transition:all 0.2s; }
  .btn-primary:hover { background:var(--gold); }
  .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
  .login-note { font-family:'JetBrains Mono',monospace; font-size:0.65rem; color:rgba(200,184,152,0.35); text-align:center; margin-top:1rem; letter-spacing:0.05em; }
  .login-error { font-family:'JetBrains Mono',monospace; font-size:0.65rem; color:#e87878; background:rgba(232,120,120,0.08); border:1px solid rgba(232,120,120,0.25); border-radius:2px; padding:0.6rem 1rem; margin-top:0.75rem; text-align:center; line-height:1.5; }
  .perks { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:2rem; }
  .perk { display:flex; align-items:flex-start; gap:0.5rem; }
  .perk-icon { font-size:0.9rem; flex-shrink:0; margin-top:1px; }
  .perk-text { font-family:'JetBrains Mono',monospace; font-size:0.65rem; color:var(--dim); letter-spacing:0.03em; line-height:1.4; }
  .magic-sent { text-align:center; }
  .magic-icon { font-size:3rem; margin-bottom:1rem; animation:float 4s ease-in-out infinite; display:block; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .magic-title { font-family:'Playfair Display',serif; font-size:1.6rem; color:var(--amber); margin-bottom:0.75rem; }
  .magic-email { font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--dim); margin-bottom:0.75rem; }
  .magic-desc { color:var(--dim); font-size:0.9rem; line-height:1.7; margin-bottom:1.5rem; }
  .btn-ghost { background:transparent; color:var(--dim); border:1px solid rgba(232,168,76,0.2); padding:0.7rem 1.5rem; font-family:'JetBrains Mono',monospace; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; border-radius:2px; transition:all 0.2s; }
  .btn-ghost:hover { border-color:var(--amber); color:var(--amber); }
  .loading-text { font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--amber); letter-spacing:0.2em; animation:pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  @media (max-width: 540px) {
    .login-card { padding: 2rem 1.5rem; }
    .card-title { font-size: 1.6rem; }
    .perks { grid-template-columns: 1fr; gap: 0.5rem; }
    .back-link { top: 1rem; left: 1rem; }
    .logo-top { top: 1rem; right: 1rem; font-size: 1rem; }
  }
`

export default function LoginPage() {
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [loginError, setLoginError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) window.location.href = '/dashboard'
      else setChecking(false)
    })
  }, [])

  const sendMagicLink = async () => {
    if (!email.trim()) return
    setSending(true)
    setLoginError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setSending(false)
    if (error) {
      setLoginError(error.message || 'Something went wrong. Please try again.')
    } else {
      setSent(true)
    }
  }

  if (checking)
    return (
      <>
        <style>{styles}</style>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p className="loading-text">✦ &nbsp; checking &nbsp; ✦</p>
        </div>
      </>
    )

  return (
    <>
      <style>{styles}</style>
      <Stars />
      <a href="/" className="back-link">
        ← Back to home
      </a>
      <a href="/" className="logo-top">
        Time<em>Capsula</em>
      </a>
      <div className="page">
        <div className="login-card">
          {sent ? (
            <div className="magic-sent">
              <span className="magic-icon">📬</span>
              <h2 className="magic-title">Check your inbox</h2>
              <p className="magic-desc">A magic link is flying to</p>
              <p className="magic-email">{email}</p>
              <p className="magic-desc" style={{ marginTop: '0.5rem' }}>
                Click it to enter your vault — no password ever needed.
              </p>
              <button className="btn-ghost" onClick={() => setSent(false)}>
                ← Try a different email
              </button>
            </div>
          ) : (
            <>
              <p className="card-eyebrow">✦ &nbsp; Your vault &nbsp; ✦</p>
              <h1 className="card-title">
                Sign <em>in.</em>
              </h1>
              <p className="card-desc">
                Enter your email and we'll send you a magic link. No password ever.
              </p>
              <div className="perks">
                {[
                  { icon: '💌', text: '10 free capsules' },
                  { icon: '🎨', text: '3 free templates' },
                  { icon: '✏️', text: 'Edit before delivery' },
                  { icon: '📊', text: 'Capsule dashboard' },
                ].map(p => (
                  <div className="perk" key={p.text}>
                    <span className="perk-icon">{p.icon}</span>
                    <span className="perk-text">{p.text}</span>
                  </div>
                ))}
              </div>
              <label className="form-label">Your email address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMagicLink()}
                autoFocus
              />
              <button
                className="btn-primary"
                onClick={sendMagicLink}
                disabled={sending || !email.trim()}
              >
                {sending ? '✦ Sending...' : '✦ Send Magic Link'}
              </button>
              {loginError && <p className="login-error">⚠ {loginError}</p>}
              <p className="login-note">No password. No fuss. Just a link in your inbox.</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
