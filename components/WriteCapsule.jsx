'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'

// ── Template definitions ──────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'cosmic',
    name: 'Cosmic Night',
    desc: 'Dark & mysterious',
    tier: 'free',
    card: { bg: '#080c14', accent: '#e8a84c', text: '#f2e8d5' },
    email: {
      bg: '#080c14',
      header: 'linear-gradient(135deg,#0d1525,#111d35)',
      accent: '#e8a84c',
      text: '#f2e8d5',
      dim: '#c8b898',
      border: 'rgba(232,168,76,0.2)',
    },
  },
  {
    id: 'dawn',
    name: 'Golden Dawn',
    desc: 'Warm & hopeful',
    tier: 'free',
    card: { bg: '#fffdf5', accent: '#c47a1a', text: '#2a1505' },
    email: {
      bg: '#fffdf5',
      header: 'linear-gradient(135deg,#fff8e8,#fdecc0)',
      accent: '#c47a1a',
      text: '#2a1505',
      dim: '#8a6030',
      border: 'rgba(196,122,26,0.2)',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Letter',
    desc: 'Cool & elegant',
    tier: 'free',
    card: { bg: '#0a0f1e', accent: '#8ab4f8', text: '#e8f0ff' },
    email: {
      bg: '#0a0f1e',
      header: 'linear-gradient(135deg,#0f1729,#162040)',
      accent: '#8ab4f8',
      text: '#e8f0ff',
      dim: '#a0b8d8',
      border: 'rgba(138,180,248,0.2)',
    },
  },
  // ── Premium (locked) ──────────────────────────────────────────
  {
    id: 'parchment',
    name: 'Vintage Parchment',
    desc: 'Aged & timeless',
    tier: 'premium',
    card: { bg: '#f5e8c8', accent: '#8b4513', text: '#2a1505' },
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    desc: 'Deep & serene',
    tier: 'premium',
    card: { bg: '#041e2c', accent: '#00a8cc', text: '#e0f4ff' },
  },
  {
    id: 'forest',
    name: 'Forest Whisper',
    desc: 'Earthy & calm',
    tier: 'premium',
    card: { bg: '#0d1a0d', accent: '#5cb85c', text: '#e8f5e8' },
  },
  {
    id: 'neon',
    name: 'Neon Future',
    desc: 'Bold & electric',
    tier: 'premium',
    card: { bg: '#0a0a1a', accent: '#e040fb', text: '#ffffff' },
  },
  {
    id: 'royal',
    name: 'Royal Seal',
    desc: 'Regal & grand',
    tier: 'premium',
    card: { bg: '#1a0a2e', accent: '#ffd700', text: '#f5e8ff' },
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    desc: 'Soft & romantic',
    tier: 'premium',
    card: { bg: '#fff0f5', accent: '#e8679a', text: '#2a0a15' },
  },
  {
    id: 'arctic',
    name: 'Arctic Frost',
    desc: 'Clean & crisp',
    tier: 'premium',
    card: { bg: '#f0f8ff', accent: '#4a9eff', text: '#0a1020' },
  },
  {
    id: 'desert',
    name: 'Desert Sand',
    desc: 'Warm & ancient',
    tier: 'premium',
    card: { bg: '#f5e8c0', accent: '#c87941', text: '#2a1005' },
  },
  {
    id: 'ember',
    name: 'Ember Glow',
    desc: 'Fiery & passionate',
    tier: 'premium',
    card: { bg: '#1a0800', accent: '#ff6600', text: '#fff0e0' },
  },
  {
    id: 'silver',
    name: 'Silver Lining',
    desc: 'Clean & modern',
    tier: 'premium',
    card: { bg: '#f8f9fa', accent: '#6c757d', text: '#212529' },
  },
  {
    id: 'golden',
    name: 'Golden Age',
    desc: 'Rich & luxurious',
    tier: 'premium',
    card: { bg: '#1a1200', accent: '#ffd700', text: '#fff8e0' },
  },
  {
    id: 'crimson',
    name: 'Crimson Tide',
    desc: 'Bold & dramatic',
    tier: 'premium',
    card: { bg: '#1a0005', accent: '#dc143c', text: '#fff0f2' },
  },
]

const FREE_TEMPLATE_IDS = ['cosmic', 'dawn', 'midnight']
const FREE_CAPSULE_LIMIT = 10

// ── Live email preview renderer ───────────────────────────────────
function EmailPreview({ templateId, form }) {
  const tmpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0]
  const e = tmpl.email
  const { to, from: fromName, subject, message } = form
  const displayTo = to || 'Recipient'
  const displayFrom = fromName || 'Someone who cares'
  const displaySubject = subject || 'A message from the past'
  const displayMessage = message || 'Your message will appear here as you type...'
  const msgHTML = displayMessage
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')

  return (
    <div
      style={{
        background: e.bg,
        borderRadius: 6,
        overflow: 'hidden',
        border: `1px solid ${e.border}`,
        fontFamily: 'Georgia, serif',
      }}
    >
      {/* Email client top bar */}
      <div
        style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
          }}
        />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            marginLeft: 8,
          }}
        >
          capsule@timecapsula.website → {form.toEmail || 'recipient@email.com'}
        </span>
      </div>

      {/* Header */}
      <div
        style={{
          background: e.header,
          padding: '28px 28px 20px',
          textAlign: 'center',
          borderBottom: `1px solid ${e.border}`,
        }}
      >
        <p
          style={{
            margin: '0 0 10px',
            fontFamily: 'monospace',
            fontSize: 9,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: e.accent,
          }}
        >
          ✦ &nbsp; Time Capsula &nbsp; ✦
        </p>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: e.text, lineHeight: 1.3 }}>
          {displaySubject}
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 28px' }}>
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: e.accent,
            fontFamily: 'monospace',
          }}
        >
          Dear {displayTo},
        </p>
        <div
          style={{
            margin: '14px 0',
            padding: '16px 20px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `2px solid ${e.accent}`,
            borderRadius: '0 4px 4px 0',
          }}
        >
          <p
            style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: e.text }}
            dangerouslySetInnerHTML={{ __html: msgHTML }}
          />
        </div>
        <p
          style={{
            margin: '12px 0 0',
            fontSize: 12,
            color: e.dim,
            textAlign: 'right',
            fontStyle: 'italic',
          }}
        >
          — {displayFrom}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 28px 20px',
          textAlign: 'center',
          borderTop: `1px solid ${e.border}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 9,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: e.dim,
            fontFamily: 'monospace',
          }}
        >
          timecapsula.website · words sealed with care
        </p>
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;500&family=JetBrains+Mono:wght@300;400&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --midnight:#080c14; --cosmos:#0d1525; --amber:#e8a84c; --gold:#f5c842;
    --parchment:#f2e8d5; --parchment-dim:#c8b898; --ink:#1a1005;
  }
  body { font-family:'Lora',serif; background:var(--midnight); color:var(--parchment); min-height:100vh; }

  nav {
    padding:1.2rem 3rem; display:flex; justify-content:space-between; align-items:center;
    border-bottom:1px solid rgba(232,168,76,0.1); background:rgba(8,12,20,0.95);
    position:sticky; top:0; z-index:100; backdrop-filter:blur(12px);
  }
  .logo { font-family:'Playfair Display',serif; font-size:1.3rem; color:var(--amber); cursor:pointer; text-decoration:none; }
  .logo em { font-style:italic; color:var(--gold); }
  .nav-back { font-family:'JetBrains Mono',monospace; font-size:0.7rem; letter-spacing:0.1em; color:var(--parchment-dim); cursor:pointer; text-decoration:none; transition:color 0.2s; display:flex; align-items:center; gap:0.5rem; }
  .nav-back:hover { color:var(--amber); }
  .nav-right { display:flex; align-items:center; gap:1rem; }
  .capsule-counter { font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; color:var(--parchment-dim); background:rgba(232,168,76,0.06); border:1px solid rgba(232,168,76,0.15); padding:0.35rem 0.75rem; border-radius:2px; }
  .capsule-counter span { color:var(--amber); }

  .page-wrap { max-width:1200px; margin:0 auto; padding:2.5rem 2rem; }

  /* TEMPLATE PICKER */
  .section-eyebrow { font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--amber); margin-bottom:0.75rem; }
  .section-heading { font-family:'Playfair Display',serif; font-size:1.5rem; color:var(--parchment); margin-bottom:1.5rem; }
  .section-heading em { font-style:italic; color:var(--amber); }

  .templates-scroll { display:grid; grid-template-columns:repeat(5,1fr); gap:0.75rem; margin-bottom:2.5rem; }
  @media(max-width:900px){ .templates-scroll { grid-template-columns:repeat(3,1fr); } }
  @media(max-width:600px){ .templates-scroll { grid-template-columns:repeat(2,1fr); } }

  .template-card {
    border-radius:6px; overflow:hidden; cursor:pointer;
    border:2px solid transparent; transition:all 0.2s; position:relative;
  }
  .template-card.selected { border-color:var(--amber); box-shadow:0 0 20px rgba(232,168,76,0.3); }
  .template-card.locked { cursor:default; }
  .template-preview { height:72px; display:flex; flex-direction:column; justify-content:center; padding:10px 12px; }
  .template-preview-bar { height:3px; border-radius:2px; margin-bottom:6px; width:60%; }
  .template-preview-text { height:2px; border-radius:1px; margin-bottom:3px; opacity:0.5; }
  .template-preview-text.w80 { width:80%; }
  .template-preview-text.w60 { width:60%; }
  .template-meta { padding:8px 10px; background:rgba(0,0,0,0.3); }
  .template-name { font-family:'Playfair Display',serif; font-size:0.75rem; color:var(--parchment); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .template-desc { font-family:'JetBrains Mono',monospace; font-size:0.55rem; color:var(--parchment-dim); letter-spacing:0.05em; margin-top:1px; }

  .lock-overlay {
    position:absolute; inset:0; background:rgba(8,12,20,0.75);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
    backdrop-filter:blur(2px);
  }
  .lock-icon { font-size:1rem; }
  .lock-badge { font-family:'JetBrains Mono',monospace; font-size:0.5rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--amber); background:rgba(232,168,76,0.15); border:1px solid rgba(232,168,76,0.3); padding:2px 8px; border-radius:2px; }

  /* FORM + PREVIEW LAYOUT */
  .write-grid { display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; }
  @media(max-width:900px){ .write-grid { grid-template-columns:1fr; } }

  .form-panel {}
  .preview-panel {}
  .preview-sticky { position:sticky; top:90px; }
  .preview-label { font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--amber); margin-bottom:0.75rem; }

  .form-group { margin-bottom:1.25rem; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem; }
  @media(max-width:600px){ .form-row { grid-template-columns:1fr; } }
  .form-label { display:block; font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--amber); margin-bottom:0.5rem; }
  .form-label span { color:var(--parchment-dim); text-transform:none; letter-spacing:0; }
  .form-input, .form-textarea, .form-select {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(232,168,76,0.15);
    border-radius:2px; padding:0.85rem 1rem; color:var(--parchment);
    font-family:'Lora',serif; font-size:0.95rem; outline:none; transition:border-color 0.2s;
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus { border-color:var(--amber); background:rgba(232,168,76,0.03); }
  .form-input::placeholder, .form-textarea::placeholder { color:rgba(200,184,152,0.35); font-style:italic; }
  .form-textarea { resize:vertical; min-height:200px; line-height:1.8; }
  .form-select { cursor:pointer; }
  input[type="date"].form-input { color-scheme:dark; cursor:pointer; }
  input[type="date"].form-input::-webkit-calendar-picker-indicator { filter:invert(0.7) sepia(1) saturate(3) hue-rotate(5deg); cursor:pointer; }
  .char-count { font-family:'JetBrains Mono',monospace; font-size:0.65rem; color:var(--parchment-dim); text-align:right; margin-top:0.3rem; }

  .btn-primary {
    background:var(--amber); color:var(--ink); border:none;
    padding:1rem 2.5rem; font-family:'Lora',serif; font-size:1rem;
    cursor:pointer; border-radius:2px; letter-spacing:0.03em;
    transition:all 0.2s; width:100%; margin-top:0.5rem;
  }
  .btn-primary:hover { background:var(--gold); }
  .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }

  .submit-note { font-family:'JetBrains Mono',monospace; font-size:0.65rem; color:rgba(200,184,152,0.4); text-align:center; margin-top:0.75rem; letter-spacing:0.05em; }

  /* LIMIT WARNING */
  .limit-warn {
    background:rgba(232,168,76,0.06); border:1px solid rgba(232,168,76,0.2);
    border-radius:4px; padding:1rem 1.25rem; margin-bottom:1.5rem;
    font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:var(--amber);
    display:flex; align-items:center; gap:0.75rem; letter-spacing:0.05em;
  }

  /* TOAST */
  .toast { position:fixed; bottom:2rem; right:2rem; background:var(--cosmos); border:1px solid rgba(232,168,76,0.3); border-radius:4px; padding:1rem 1.5rem; font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--parchment); z-index:999; animation:toastIn 0.3s ease; }
  .toast-error { border-color:rgba(232,124,124,0.4); color:#e87c7c; }
  @keyframes toastIn { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }

  /* SUCCESS */
  .success-screen { text-align:center; max-width:520px; margin:0 auto; padding:4rem 2rem; }
  .success-icon { font-size:3rem; margin-bottom:1.5rem; animation:float 4s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .success-title { font-family:'Playfair Display',serif; font-size:2rem; color:var(--parchment); margin-bottom:0.75rem; }
  .success-title em { color:var(--amber); font-style:italic; }
  .success-desc { color:var(--parchment-dim); line-height:1.8; margin-bottom:2rem; font-style:italic; }
  .success-actions { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
  .btn-ghost { background:transparent; color:var(--parchment-dim); border:1px solid rgba(232,168,76,0.2); padding:0.8rem 2rem; font-family:'Lora',serif; font-size:0.9rem; cursor:pointer; border-radius:2px; transition:all 0.2s; }
  .btn-ghost:hover { border-color:var(--amber); color:var(--amber); }

  /* LOADING / UNAUTH */
  .center-screen { min-height:80vh; display:flex; align-items:center; justify-content:center; }
  .loading-text { font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--amber); letter-spacing:0.2em; animation:pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  .unauth-card { background:var(--cosmos); border:1px solid rgba(232,168,76,0.15); border-radius:4px; padding:3rem; text-align:center; max-width:420px; }
  .unauth-title { font-family:'Playfair Display',serif; font-size:1.5rem; color:var(--parchment); margin-bottom:0.75rem; }
  .unauth-desc { color:var(--parchment-dim); font-size:0.9rem; line-height:1.7; margin-bottom:1.5rem; font-style:italic; }

  .divider { height:1px; background:linear-gradient(to right,transparent,rgba(232,168,76,0.15),transparent); margin:2.5rem 0; }
`

export default function WriteCapsule() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [capsuleCount, setCapsuleCount] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState('cosmic')
  const [form, setForm] = useState({
    to: '',
    toEmail: '',
    from: '',
    subject: '',
    message: '',
    when: '1y',
    customDate: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [toast, setToast] = useState(null)

  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const res = await fetch('/api/capsules')
        const data = await res.json()
        if (data.capsules) setCapsuleCount(data.capsules.length)
      }
      setLoading(false)
    }
    init()
  }, [])

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3500)
  }

  const setField = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const computeDeliveryDate = () => {
    const now = new Date()
    if (form.when === 'custom') return form.customDate ? new Date(form.customDate) : null
    const years = { '1y': 1, '5y': 5, '10y': 10, '25y': 25 }[form.when]
    if (!years) return null
    const d = new Date(now)
    d.setFullYear(now.getFullYear() + years)
    return d
  }

  const deliverAt = computeDeliveryDate()
  const daysUntil = deliverAt ? Math.ceil((deliverAt - new Date()) / 86400000) : null

  const handleSubmit = async () => {
    if (!form.to || !form.toEmail || !form.message) {
      showToast('Please fill in recipient, email, and message.', true)
      return
    }
    if (capsuleCount >= FREE_CAPSULE_LIMIT) {
      showToast("You've reached the 10 capsule limit on the free plan.", true)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, template: selectedTemplate }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Something went wrong.', true)
        return
      }
      setSuccess({ deliverAt: data.deliverAt, to: form.to })
    } catch (_err) {
      showToast('Network error. Please try again.', true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading ──
  if (loading)
    return (
      <>
        <style>{styles}</style>
        <div className="center-screen">
          <p className="loading-text">✦ &nbsp; loading &nbsp; ✦</p>
        </div>
      </>
    )

  // ── Not signed in ──
  if (!user)
    return (
      <>
        <style>{styles}</style>
        <div className="center-screen">
          <div className="unauth-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
            <h2 className="unauth-title">Sign in to write</h2>
            <p className="unauth-desc">
              This page is for signed-in users. Create an account to get 10 free capsules and 3
              templates.
            </p>
            <a
              href="/dashboard"
              style={{
                display: 'inline-block',
                background: 'var(--amber)',
                color: 'var(--ink)',
                padding: '0.85rem 2rem',
                borderRadius: '2px',
                fontFamily: 'Lora,serif',
                textDecoration: 'none',
                fontSize: '0.95rem',
              }}
            >
              ✦ Sign In Free
            </a>
          </div>
        </div>
      </>
    )

  // ── Success ──
  if (success) {
    const dateStr = new Date(success.deliverAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return (
      <>
        <style>{styles}</style>
        <nav>
          <a className="logo" href="/dashboard">
            Time<em>Capsula</em>
          </a>
        </nav>
        <div className="center-screen">
          <div className="success-screen">
            <div className="success-icon">📬</div>
            <h2 className="success-title">
              Capsule <em>sealed.</em>
            </h2>
            <p className="success-desc">
              Your message to <strong style={{ color: 'var(--amber)' }}>{success.to}</strong> has
              been locked away in time.
              <br />
              <br />
              It will be delivered on <strong style={{ color: 'var(--amber)' }}>{dateStr}</strong>.
            </p>
            <div className="success-actions">
              <button
                className="btn-primary"
                style={{ width: 'auto' }}
                onClick={() => {
                  setForm({
                    to: '',
                    toEmail: '',
                    from: '',
                    subject: '',
                    message: '',
                    when: '1y',
                    customDate: '',
                  })
                  setSuccess(null)
                  setCapsuleCount(c => c + 1)
                }}
              >
                ✦ Write Another
              </button>
              <a href="/dashboard" className="btn-ghost">
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </>
    )
  }

  const atLimit = capsuleCount >= FREE_CAPSULE_LIMIT
  const remaining = FREE_CAPSULE_LIMIT - capsuleCount

  return (
    <>
      <style>{styles}</style>
      {toast && <div className={`toast ${toast.isError ? 'toast-error' : ''}`}>{toast.msg}</div>}

      <nav>
        <a className="logo" href="/dashboard">
          Time<em>Capsula</em>
        </a>
        <div className="nav-right">
          <span className="capsule-counter">
            <span>{capsuleCount}</span> / {FREE_CAPSULE_LIMIT} capsules used
          </span>
          <a href="/dashboard" className="nav-back">
            ← Dashboard
          </a>
        </div>
      </nav>

      <div className="page-wrap">
        <div style={{ marginBottom: '2rem' }}>
          <p className="section-eyebrow">✦ New capsule</p>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: '2.2rem',
              color: 'var(--parchment)',
              lineHeight: 1.2,
            }}
          >
            Choose your <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>template.</em>
          </h1>
        </div>

        {/* Limit warning */}
        {atLimit && (
          <div className="limit-warn">
            ⚠ You've used all 10 free capsules. Upgrade to send unlimited.
          </div>
        )}
        {!atLimit && remaining <= 3 && (
          <div className="limit-warn" style={{ borderColor: 'rgba(232,168,76,0.35)' }}>
            ✦ {remaining} free capsule{remaining !== 1 ? 's' : ''} remaining on your plan.
          </div>
        )}

        {/* Template picker */}
        <div className="templates-scroll">
          {TEMPLATES.map(tmpl => {
            const isLocked = tmpl.tier === 'premium'
            const isSelected = selectedTemplate === tmpl.id
            return (
              <div
                key={tmpl.id}
                className={`template-card ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`}
                style={{ background: tmpl.card.bg }}
                onClick={() => !isLocked && setSelectedTemplate(tmpl.id)}
                title={isLocked ? 'Premium template — coming soon' : tmpl.name}
              >
                <div className="template-preview" style={{ background: tmpl.card.bg }}>
                  <div className="template-preview-bar" style={{ background: tmpl.card.accent }} />
                  <div
                    className="template-preview-text w80"
                    style={{ background: tmpl.card.text }}
                  />
                  <div
                    className="template-preview-text w60"
                    style={{ background: tmpl.card.text }}
                  />
                  <div
                    className="template-preview-text w80"
                    style={{ background: tmpl.card.text }}
                  />
                </div>
                <div className="template-meta">
                  <div className="template-name" style={{ color: tmpl.card.text }}>
                    {tmpl.name}
                  </div>
                  <div className="template-desc">{tmpl.desc}</div>
                </div>
                {isLocked && (
                  <div className="lock-overlay">
                    <span className="lock-icon">🔒</span>
                    <span className="lock-badge">Premium</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="divider" />

        {/* Form + Preview */}
        <div className="write-grid">
          {/* LEFT: Form */}
          <div className="form-panel">
            <p className="section-eyebrow" style={{ marginBottom: '1.5rem' }}>
              ✦ Write your message
            </p>

            <div className="form-row">
              <div>
                <label className="form-label">To — Recipient name *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="My daughter Sofia..."
                  value={form.to}
                  onChange={setField('to')}
                />
              </div>
              <div>
                <label className="form-label">Their email *</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="sofia@example.com"
                  value={form.toEmail}
                  onChange={setField('toEmail')}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label className="form-label">
                  From — Your name <span>(optional)</span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Your name or nickname"
                  value={form.from}
                  onChange={setField('from')}
                />
              </div>
              <div>
                <label className="form-label">
                  Subject / Title <span>(optional)</span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="For when you're ready..."
                  value={form.subject}
                  onChange={setField('subject')}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your message *</label>
              <textarea
                className="form-textarea"
                placeholder="Write as if time doesn't exist. No one will read this until the moment you choose..."
                value={form.message}
                onChange={setField('message')}
                maxLength={5000}
              />
              <div className="char-count">{form.message.length} / 5000</div>
            </div>

            <div className="form-row">
              <div>
                <label className="form-label">Deliver in *</label>
                <select className="form-select" value={form.when} onChange={setField('when')}>
                  <option value="">Choose a time...</option>
                  <option value="1y">1 year from now</option>
                  <option value="5y">5 years from now</option>
                  <option value="10y">10 years from now</option>
                  <option value="25y">25 years from now</option>
                  <option value="custom">Pick a specific date</option>
                </select>
              </div>
              {form.when === 'custom' && (
                <div>
                  <label className="form-label">Delivery date *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.customDate}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    onChange={setField('customDate')}
                  />
                </div>
              )}
            </div>

            {daysUntil && (
              <div
                style={{
                  background: 'rgba(232,168,76,0.06)',
                  border: '1px solid rgba(232,168,76,0.15)',
                  borderRadius: 2,
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem',
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: '0.75rem',
                  color: 'var(--parchment-dim)',
                  letterSpacing: '0.05em',
                }}
              >
                ✦ Sealed for{' '}
                <strong style={{ color: 'var(--amber)' }}>{daysUntil.toLocaleString()} days</strong>{' '}
                — delivers{' '}
                {deliverAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}

            <button className="btn-primary" onClick={handleSubmit} disabled={submitting || atLimit}>
              {submitting ? '✦ Sealing your capsule...' : '✦ Seal & Send Into Time'}
            </button>
            <p className="submit-note">
              {capsuleCount} of {FREE_CAPSULE_LIMIT} capsules used ·{' '}
              <a href="/dashboard" style={{ color: 'var(--amber)' }}>
                Dashboard
              </a>
            </p>
          </div>

          {/* RIGHT: Live preview */}
          <div className="preview-panel">
            <div className="preview-sticky">
              <p className="preview-label">✦ Live email preview — updates as you type</p>
              <EmailPreview templateId={selectedTemplate} form={form} />
              <p
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: '0.6rem',
                  color: 'rgba(200,184,152,0.3)',
                  marginTop: '0.75rem',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                }}
              >
                THIS IS EXACTLY HOW IT WILL LOOK IN THE RECIPIENT'S INBOX
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
