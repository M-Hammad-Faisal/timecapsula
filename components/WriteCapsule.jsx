'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../lib/supabase/client'
import { TEMPLATES, FREE_IDS } from '../lib/templates'
import StepBar from './StepBar'

// ── Constants ─────────────────────────────────────────────────────
const FREE_LIMIT = 10

const DELIVERY_OPTIONS = [
  { value: '1w', label: '1 week from now' },
  { value: '1m', label: '1 month from now' },
  { value: '3m', label: '3 months from now' },
  { value: '6m', label: '6 months from now' },
  { value: '1y', label: '1 year from now' },
  { value: '2y', label: '2 years from now' },
  { value: '3y', label: '3 years from now' },
  { value: 'custom-3y', label: 'Pick a date' },
]

const STEP_LABELS = ['Template', 'Write', 'Confirm']

const DRAFT_KEY = 'tc_draft'

// ── Helpers ───────────────────────────────────────────────────────
function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function computeDelivery(when, customDate) {
  if (!when) return null
  if (when.startsWith('custom')) {
    if (!customDate) return null
    const d = new Date(customDate)
    return isNaN(d.getTime()) ? null : d
  }
  const days = { '1w': 7, '1m': 30, '3m': 90, '6m': 180, '1y': 365, '2y': 730, '3y': 1095 }[when]
  return days ? new Date(Date.now() + days * 86400000) : null
}

function fmtDate(d) {
  return d?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || ''
}

function customMax(when) {
  if (when === 'custom-3y')
    return new Date(Date.now() + 1095 * 86400000).toISOString().split('T')[0]
  return undefined
}

// ── Email Preview ─────────────────────────────────────────────────
export function EmailPreview({ templateId, form, compact }) {
  const t = TEMPLATES.find(x => x.id === templateId) || TEMPLATES[0]
  const e = t.email
  const to = form.to || 'Recipient'
  const fr = form.from || 'Someone who cares'
  const su = form.subject || t.name
  const ms = form.message || t.placeholder
  const ht = ms
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
  const fs = compact ? 12 : 14

  return (
    <div
      style={{
        background: e.bg,
        borderRadius: 6,
        overflow: 'hidden',
        border: `1px solid ${e.border}`,
        fontFamily: 'Georgia,serif',
        width: '100%',
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.25)',
          padding: '7px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        {['rgba(255,80,80,0.5)', 'rgba(255,200,0,0.5)', 'rgba(80,200,80,0.5)'].map((c, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
        ))}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 9,
            color: 'rgba(255,255,255,0.22)',
            marginLeft: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          To: {form.toEmail || 'recipient@email.com'} · {su}
        </span>
      </div>
      <div
        style={{
          background: e.header,
          padding: compact ? '16px 18px 12px' : '22px 24px 16px',
          textAlign: 'center',
          borderBottom: `1px solid ${e.border}`,
        }}
      >
        <p
          style={{
            margin: '0 0 5px',
            fontFamily: 'monospace',
            fontSize: 8,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: e.accent,
          }}
        >
          ✦ Time Capsula ✦
        </p>
        <p
          style={{
            margin: 0,
            fontSize: compact ? 14 : 16,
            fontWeight: 700,
            color: e.text,
            lineHeight: 1.3,
          }}
        >
          {su}
        </p>
      </div>
      <div style={{ padding: compact ? '14px 18px' : '20px 24px' }}>
        <p
          style={{
            margin: '0 0 3px',
            fontSize: 8,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: e.accent,
            fontFamily: 'monospace',
          }}
        >
          Dear {to},
        </p>
        <div
          style={{
            margin: '10px 0',
            padding: compact ? '10px 14px' : '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `2px solid ${e.accent}`,
            borderRadius: '0 3px 3px 0',
          }}
        >
          <p
            style={{ margin: 0, fontSize: fs, lineHeight: 1.8, color: e.text }}
            dangerouslySetInnerHTML={{ __html: ht }}
          />
        </div>
        <p
          style={{
            margin: '7px 0 0',
            fontSize: fs - 1,
            color: e.dim,
            textAlign: 'right',
            fontStyle: 'italic',
          }}
        >
          — {fr}
        </p>
      </div>
      <div
        style={{
          padding: compact ? '7px 18px 12px' : '8px 24px 14px',
          textAlign: 'center',
          borderTop: `1px solid ${e.border}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 8,
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
const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;500&family=JetBrains+Mono:wght@300;400&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{--midnight:#080c14;--cosmos:#0d1525;--amb:#e8a84c;--gold:#f5c842;--parch:#f2e8d5;--dim:#c8b898;--ink:#1a1005;}
body{font-family:'Lora',serif;background:var(--midnight);color:var(--parch);min-height:100vh;}

nav{padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(232,168,76,0.1);background:rgba(8,12,20,0.96);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);}
.logo{font-family:'Playfair Display',serif;font-size:1.2rem;color:var(--amb);text-decoration:none;}
.logo em{font-style:italic;color:var(--gold);}
.nav-r{display:flex;align-items:center;gap:0.75rem;}
.nav-pill{font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:var(--dim);background:rgba(232,168,76,0.06);border:1px solid rgba(232,168,76,0.12);padding:0.28rem 0.65rem;border-radius:2px;white-space:nowrap;}
.nav-pill strong{color:var(--amb);}
.nav-link{font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--dim);text-decoration:none;transition:color 0.2s;}
.nav-link:hover{color:var(--amb);}

.page{max-width:1200px;margin:0 auto;padding:2rem 1.5rem;}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.28em;text-transform:uppercase;color:var(--amb);margin-bottom:0.5rem;}
.heading{font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--parch);margin-bottom:0.4rem;line-height:1.2;}
.heading em{font-style:italic;color:var(--amb);}
.subhead{color:var(--dim);font-size:0.85rem;font-style:italic;margin-bottom:2rem;}

/* ── STEP 1: template grid ── */
.tgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.85rem;margin-bottom:2.5rem;}
@media(max-width:1100px){.tgrid{grid-template-columns:repeat(4,1fr);}}
@media(max-width:780px){.tgrid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:540px){.tgrid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:340px){.tgrid{grid-template-columns:repeat(1,1fr);}}

.tc{border-radius:10px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.22s;position:relative;}
.tc:hover:not(.tc-lk){transform:translateY(-5px);box-shadow:0 14px 32px rgba(0,0,0,0.55);}
.tc.sel{border-color:var(--amb);box-shadow:0 0 0 3px rgba(232,168,76,0.22);}
.tc-prev{height:130px;padding:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;position:relative;}
.tc-emoji{font-size:2.4rem;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5));}
.tc-bar{height:4px;border-radius:2px;width:55%;}
.tc-line{height:3px;border-radius:2px;opacity:0.25;}
.tc-meta{padding:10px 13px 13px;}
.tc-sc{font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:rgba(255,255,255,0.4);margin-bottom:3px;letter-spacing:0.06em;text-transform:uppercase;}
.tc-nm{font-family:'Playfair Display',serif;font-size:1rem;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.tc-ds{font-family:'JetBrains Mono',monospace;font-size:0.58rem;color:rgba(255,255,255,0.3);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.tc-lock{position:absolute;inset:0;background:rgba(6,9,16,0.82);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;backdrop-filter:blur(2px);}
.tc-lk-ico{font-size:1.5rem;opacity:0.75;}
.tc-lk-badge{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--amb);background:rgba(232,168,76,0.12);border:1px solid rgba(232,168,76,0.3);padding:4px 10px;border-radius:2px;}
.tc-lk-price{font-family:'JetBrains Mono',monospace;font-size:0.56rem;color:rgba(232,168,76,0.5);letter-spacing:0.06em;}

.field-error{font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:#e07070;margin-top:4px;}
.draft-banner{background:rgba(232,168,76,0.07);border:1px solid rgba(232,168,76,0.2);border-radius:4px;padding:0.5rem 0.85rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;font-size:0.78rem;color:var(--amb);}
.draft-banner button{background:none;border:none;color:rgba(232,168,76,0.5);cursor:pointer;font-size:0.7rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;}
.draft-banner button:hover{color:var(--amb);}

/* ── Waitlist section inside locked modal ── */
.waitlist-wrap{display:flex;flex-direction:column;gap:0.55rem;border-top:1px solid rgba(232,168,76,0.12);padding-top:1rem;margin-top:0.25rem;width:100%;}
.waitlist-label{font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--dim);}
.waitlist-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(232,168,76,0.2);border-radius:3px;color:var(--parch);font-family:'JetBrains Mono',monospace;font-size:0.85rem;padding:0.65rem 0.85rem;outline:none;transition:border-color 0.2s;}
.waitlist-input::placeholder{color:rgba(200,184,152,0.3);}
.waitlist-input:focus{border-color:rgba(232,168,76,0.5);}
.waitlist-btn{flex:1;background:var(--amb);color:var(--ink);border:none;padding:0.65rem 0.75rem;font-family:'Lora',serif;font-size:0.9rem;font-weight:600;border-radius:3px;cursor:pointer;letter-spacing:0.03em;transition:all 0.2s;white-space:nowrap;}
.waitlist-btn:hover:not(:disabled){background:var(--gold);}
.waitlist-btn:disabled{opacity:0.55;cursor:not-allowed;}
.waitlist-actions{display:flex;gap:0.5rem;align-items:center;}
.waitlist-skip{background:none;border:none;flex-shrink:0;font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:rgba(200,184,152,0.4);cursor:pointer;padding:0.5rem 0.25rem;letter-spacing:0.06em;transition:color 0.2s;white-space:nowrap;}
.waitlist-skip:hover{color:var(--dim);}
.waitlist-success{display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:0.75rem 0;border-top:1px solid rgba(232,168,76,0.12);margin-top:0.25rem;}
.waitlist-check{font-size:1.4rem;color:var(--amb);}
.waitlist-success p{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--amb);text-align:center;line-height:1.5;letter-spacing:0.03em;}

.cont-wrap{text-align:center;}
.cont-btn{display:inline-flex;align-items:center;justify-content:center;gap:0.75rem;background:var(--amb);color:var(--ink);border:none;padding:0.95rem 2.5rem;font-family:'Lora',serif;font-size:1rem;cursor:pointer;border-radius:2px;transition:all 0.2s;}
.cont-btn:hover{background:var(--gold);}
.cont-note{font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:rgba(200,184,152,0.32);margin-top:0.6rem;letter-spacing:0.06em;}

/* ── Step 2: 2-col grid ── */
.s2grid{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:start;}
@media(max-width:860px){.s2grid{grid-template-columns:1fr;}}
.sticky{position:sticky;top:80px;}
.prev-label{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--amb);margin-bottom:0.6rem;}
.prev-note{font-family:'JetBrains Mono',monospace;font-size:0.52rem;color:rgba(200,184,152,0.25);text-align:center;margin-top:0.5rem;letter-spacing:0.08em;text-transform:uppercase;}

/* ── Form elements ── */
.fg{margin-bottom:1rem;}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;margin-bottom:1rem;}
@media(max-width:560px){.frow{grid-template-columns:1fr;}}
.fl{display:block;font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--amb);margin-bottom:0.4rem;}
.fl span{color:var(--dim);text-transform:none;letter-spacing:0;font-size:0.58rem;}
.fi,.ft,.fs{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(232,168,76,0.14);border-radius:2px;padding:0.75rem 0.9rem;color:var(--parch);font-family:'Lora',serif;font-size:0.9rem;outline:none;transition:border-color 0.2s;}
.fi:focus,.ft:focus,.fs:focus{border-color:var(--amb);background:rgba(232,168,76,0.03);}
.fi::placeholder,.ft::placeholder{color:rgba(200,184,152,0.28);font-style:italic;}
.ft{resize:vertical;min-height:170px;line-height:1.8;}
.fs{cursor:pointer;}
input[type="date"].fi{color-scheme:dark;cursor:pointer;}
input[type="date"].fi::-webkit-calendar-picker-indicator{filter:invert(0.7) sepia(1) saturate(3) hue-rotate(5deg);cursor:pointer;}
.cc{font-family:'JetBrains Mono',monospace;font-size:0.58rem;color:var(--dim);text-align:right;margin-top:0.25rem;}

.deli-hint{background:rgba(232,168,76,0.05);border:1px solid rgba(232,168,76,0.12);border-radius:2px;padding:0.65rem 0.85rem;margin-bottom:1rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--dim);}
.deli-hint strong{color:var(--amb);}

/* ── Step 2 → 3 btn ── */
.review-btn{width:100%;background:var(--amb);color:var(--ink);border:none;padding:0.95rem;font-family:'Lora',serif;font-size:0.95rem;cursor:pointer;border-radius:2px;transition:all 0.2s;margin-top:0.5rem;}
.review-btn:hover{background:var(--gold);}
.review-btn:disabled{opacity:0.5;cursor:not-allowed;}

/* ── Step 3: confirm ── */
.confirm-wrap{max-width:680px;margin:0 auto;}
.confirm-meta{background:rgba(255,255,255,0.02);border:1px solid rgba(232,168,76,0.12);border-radius:4px;padding:1.5rem;margin-bottom:1.75rem;}
.cm-row{display:flex;gap:0.75rem;padding:0.55rem 0;border-bottom:1px solid rgba(255,255,255,0.05);}
.cm-row:last-child{border-bottom:none;}
.cm-key{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--amb);min-width:90px;flex-shrink:0;padding-top:2px;}
.cm-val{font-size:0.9rem;color:var(--parch);line-height:1.5;word-break:break-word;}
.cm-msg{font-style:italic;color:var(--dim);font-size:0.88rem;line-height:1.7;max-height:140px;overflow-y:auto;}

.confirm-preview{margin-bottom:1.75rem;}
.confirm-actions{display:flex;gap:0.85rem;flex-wrap:wrap;}
.seal-btn{flex:1;background:var(--amb);color:var(--ink);border:none;padding:1rem;font-family:'Lora',serif;font-size:1rem;cursor:pointer;border-radius:2px;transition:all 0.2s;min-width:180px;}
.seal-btn:hover{background:var(--gold);}
.seal-btn:disabled{opacity:0.6;cursor:not-allowed;}

/* ── Nav chip / back ── */
.back-btn{display:inline-flex;align-items:center;gap:0.4rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--dim);cursor:pointer;background:none;border:none;padding:0;margin-bottom:1.5rem;transition:color 0.2s;}
.back-btn:hover{color:var(--amb);}
.tmpl-chip{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(232,168,76,0.07);border:1px solid rgba(232,168,76,0.18);border-radius:3px;padding:0.38rem 0.75rem;font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:var(--amb);margin-bottom:1.25rem;cursor:pointer;transition:all 0.2s;}
.tmpl-chip:hover{border-color:var(--amb);}
.tmpl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}

/* ── Warnings ── */
.warn{background:rgba(232,168,76,0.06);border:1px solid rgba(232,168,76,0.2);border-radius:3px;padding:0.7rem 0.9rem;margin-bottom:1.25rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--amb);}
.divider{height:1px;background:linear-gradient(to right,transparent,rgba(232,168,76,0.12),transparent);margin:2rem 0;}

/* ── Lock modal ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.78);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(4px);animation:fadeIn 0.2s;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--cosmos);border:1px solid rgba(232,168,76,0.2);border-radius:6px;padding:2rem;max-width:500px;width:100%;animation:slideUp 0.2s;max-height:88vh;overflow-y:auto;}
@keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
.m-ey{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--amb);margin-bottom:0.5rem;}
.m-ti{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--parch);margin-bottom:0.5rem;}
.m-de{color:var(--dim);font-size:0.85rem;font-style:italic;line-height:1.7;margin-bottom:1.25rem;}
.m-prev{border-radius:4px;overflow:hidden;margin-bottom:1.4rem;}
.pr-row{display:flex;gap:0.75rem;margin-bottom:1.4rem;flex-wrap:wrap;}
.pr-pill{flex:1;min-width:120px;background:rgba(232,168,76,0.05);border:1px solid rgba(232,168,76,0.18);border-radius:4px;padding:0.85rem;text-align:center;}
.pr-amt{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--amb);}
.pr-lbl{font-family:'JetBrains Mono',monospace;font-size:0.55rem;color:var(--dim);letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;}
.pr-nt{font-family:'JetBrains Mono',monospace;font-size:0.5rem;color:rgba(200,184,152,0.35);margin-top:3px;}
.m-btns{display:flex;flex-direction:column;gap:0.6rem;}
.btn-p{flex:1;background:var(--amb);color:var(--ink);border:none;padding:0.8rem 1rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.2s;}
.btn-p:hover{background:var(--gold);}
.btn-g{background:transparent;color:var(--dim);border:1px solid rgba(232,168,76,0.18);padding:0.8rem 1rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.2s;}
.btn-g:hover{border-color:var(--amb);color:var(--amb);}

/* ── Success ── */
.succ-wrap{min-height:70vh;display:flex;align-items:center;justify-content:center;padding:2rem;}
.succ-card{text-align:center;max-width:460px;width:100%;}
.succ-ico{font-size:3rem;display:block;margin-bottom:1.25rem;animation:float 4s ease-in-out infinite;}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.succ-title{font-family:'Playfair Display',serif;font-size:1.9rem;color:var(--parch);margin-bottom:0.65rem;}
.succ-title em{color:var(--amb);font-style:italic;}
.succ-desc{color:var(--dim);line-height:1.8;margin-bottom:2rem;font-style:italic;font-size:0.9rem;}
.succ-acts{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}

/* ── Loading ── */
.cscreen{min-height:100vh;display:flex;align-items:center;justify-content:center;}
.ld{font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:var(--amb);letter-spacing:0.2em;animation:pulse 1.5s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
.toast{position:fixed;bottom:1.5rem;right:1.5rem;background:var(--cosmos);border:1px solid rgba(232,168,76,0.3);border-radius:4px;padding:0.85rem 1.25rem;font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--parch);z-index:999;animation:slideUp 0.3s ease;max-width:300px;}
.toast-err{border-color:rgba(232,124,124,0.4);color:#e87c7c;}

/* ── Responsive ── */
@media(max-width:720px){
  nav{padding:0.85rem 1.1rem;}
  .page{padding:1.5rem 1rem;}
  .heading{font-size:1.5rem;}
  .confirm-actions{flex-direction:column;}
  .seal-btn{min-width:unset;}
}
`

// ── Main Component ────────────────────────────────────────────────
export default function WriteCapsule() {
  const [loading, setLoading] = useState(true)
  const [capsuleCount, setCapsuleCount] = useState(0)
  const [step, setStep] = useState(1)
  const [selectedTemplate, setTemplate] = useState('cosmic')
  const [lockedModal, setLockedModal] = useState(null)
  const [form, setForm] = useState({
    to: '',
    toEmail: '',
    from: '',
    subject: '',
    message: '',
    when: '',
    customDate: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [toast, setToast] = useState(null)
  const [emailError, setEmailError] = useState('')
  const [draftRestored, setDraftRestored] = useState(false)
  // Waitlist state (inside locked modal)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSent, setWaitlistSent] = useState(false)
  const [waitlistLoading, setWaitlistLoading] = useState(false)

  const supabase = createClient()

  // ── Draft: restore on mount ────────────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY) || localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        if (d.form) setForm(d.form)
        if (d.template) setTemplate(d.template)
        if (d.step && d.step > 1) setStep(d.step)
        setDraftRestored(true)
      }
    } catch (_) {
      /* localStorage unavailable (private mode) */
    }
  }, [])

  // ── Draft: save on every change (debounced) ────────────────────
  const saveDraft = useCallback(() => {
    if (success) return
    try {
      const payload = JSON.stringify({ step, template: selectedTemplate, form })
      sessionStorage.setItem(DRAFT_KEY, payload)
      localStorage.setItem(DRAFT_KEY, payload)
    } catch (_) {
      /* localStorage unavailable (private mode) */
    }
  }, [step, selectedTemplate, form, success])

  useEffect(() => {
    const t = setTimeout(saveDraft, 400)
    return () => clearTimeout(t)
  }, [saveDraft])

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      const res = await fetch('/api/capsules')
      const data = await res.json()
      if (data.capsules) setCapsuleCount(data.capsules.length)
      setLoading(false)
    }
    init()
  }, [])

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3500)
  }

  const sf = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const tmpl = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0]
  const delAt = computeDelivery(form.when, form.customDate)
  const days = delAt ? Math.ceil((delAt - Date.now()) / 86400000) : null
  const atLimit = capsuleCount >= FREE_LIMIT
  const remaining = FREE_LIMIT - capsuleCount
  const isCustom = form.when.startsWith('custom')
  const canReview = !!(
    form.to &&
    form.toEmail &&
    validateEmail(form.toEmail) &&
    !emailError &&
    form.message &&
    form.when &&
    (!isCustom || form.customDate)
  )

  const handleSubmit = async () => {
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
      // Clear draft on success
      try {
        sessionStorage.removeItem(DRAFT_KEY)
        localStorage.removeItem(DRAFT_KEY)
      } catch (_) {
        // left empty on purpose
      }
    } catch (_err) {
      showToast('Network error. Try again.', true)
    } finally {
      setSubmitting(false)
    }
  }

  const resetAll = () => {
    setForm({ to: '', toEmail: '', from: '', subject: '', message: '', when: '', customDate: '' })
    setSuccess(null)
    setStep(1)
    setCapsuleCount(c => c + 1)
  }

  // ── Loading ───────────────────────────────────────────────────
  if (loading)
    return (
      <>
        <style>{S}</style>
        <div className="cscreen">
          <p className="ld">✦ &nbsp; opening vault &nbsp; ✦</p>
        </div>
      </>
    )

  // ── Success ───────────────────────────────────────────────────
  if (success)
    return (
      <>
        <style>{S}</style>
        <nav>
          <a className="logo" href="/dashboard">
            Time<em>Capsula</em>
          </a>
        </nav>
        <div className="succ-wrap">
          <div className="succ-card">
            <span className="succ-ico">📬</span>
            <h2 className="succ-title">
              Capsule <em>sealed.</em>
            </h2>
            <p className="succ-desc">
              Your message to <strong style={{ color: 'var(--amb)' }}>{success.to}</strong> is
              locked in time.
              <br />
              <br />
              Delivers on{' '}
              <strong style={{ color: 'var(--amb)' }}>
                {fmtDate(new Date(success.deliverAt))}
              </strong>
              .
            </p>
            <div className="succ-acts">
              <button className="btn-p" onClick={resetAll}>
                ✦ Write Another
              </button>
              <a href="/dashboard" className="btn-g">
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </>
    )

  // ── Main render ───────────────────────────────────────────────
  return (
    <>
      <style>{S}</style>
      {toast && <div className={`toast ${toast.isError ? 'toast-err' : ''}`}>{toast.msg}</div>}

      {/* Lock modal */}
      {lockedModal && (
        <div
          className="overlay"
          onClick={e => e.target === e.currentTarget && setLockedModal(null)}
        >
          <div className="modal">
            <p className="m-ey">{lockedModal.scenario}</p>
            <h2 className="m-ti">{lockedModal.name}</h2>
            <p className="m-de">{lockedModal.desc}</p>
            <div className="m-prev">
              <EmailPreview
                templateId={lockedModal.id}
                form={{
                  to: 'You',
                  from: 'Past self',
                  subject: lockedModal.name,
                  message: lockedModal.placeholder,
                  toEmail: '',
                }}
                compact
              />
            </div>
            <div className="pr-row">
              <div className="pr-pill">
                <div className="pr-amt">$5</div>
                <div className="pr-lbl">Lifetime access</div>
                <div className="pr-nt">Use unlimited times</div>
              </div>
              <div className="pr-pill">
                <div className="pr-amt">$1</div>
                <div className="pr-lbl">5 uses pack</div>
                <div className="pr-nt">Perfect for one story</div>
              </div>
            </div>
            <div className="m-btns">
              {waitlistSent ? (
                <div className="waitlist-success">
                  <span className="waitlist-check">✓</span>
                  <p>You're on the list! We'll email when premium launches.</p>
                </div>
              ) : (
                <>
                  <div className="waitlist-wrap">
                    <p className="waitlist-label">Get notified when premium templates launch</p>
                    <input
                      type="email"
                      className="waitlist-input"
                      placeholder="your@email.com"
                      value={waitlistEmail}
                      onChange={e => setWaitlistEmail(e.target.value)}
                      onKeyDown={async e => {
                        if (e.key === 'Enter')
                          e.currentTarget.nextElementSibling?.querySelector('button')?.click()
                      }}
                    />
                    <div className="waitlist-actions">
                      <button
                        className="waitlist-btn"
                        disabled={waitlistLoading}
                        onClick={async () => {
                          if (!validateEmail(waitlistEmail)) {
                            showToast('Please enter a valid email', true)
                            return
                          }
                          setWaitlistLoading(true)
                          try {
                            await fetch('/api/waitlist', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                email: waitlistEmail,
                                template: lockedModal?.id,
                              }),
                            })
                          } catch (_) {
                            /* network error, still show success */
                          }
                          setWaitlistSent(true)
                          setWaitlistLoading(false)
                        }}
                      >
                        {waitlistLoading ? '...' : 'Notify Me.'}
                      </button>
                      <button
                        className="waitlist-skip"
                        onClick={() => {
                          setLockedModal(null)
                          setWaitlistEmail('')
                          setWaitlistSent(false)
                        }}
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <nav>
        <a className="logo" href="/dashboard">
          Time<em>Capsula</em>
        </a>
        <div className="nav-r">
          <span className="nav-pill">
            <strong>{capsuleCount}</strong> / {FREE_LIMIT} used
          </span>
          <a href="/dashboard" className="nav-link">
            ← Dashboard
          </a>
        </div>
      </nav>

      <div className="page">
        <StepBar step={step} labels={STEP_LABELS} />

        {/* draft restored banner */}
        {draftRestored && (
          <div className="draft-banner">
            <span>✦ Draft restored — continue where you left off</span>
            <button
              onClick={() => {
                setDraftRestored(false)
                try {
                  sessionStorage.removeItem(DRAFT_KEY)
                  localStorage.removeItem(DRAFT_KEY)
                } catch (_) {
                  // left empty on purpose
                }
                setStep(1)
                setTemplate('cosmic')
                setForm({
                  to: '',
                  toEmail: '',
                  from: '',
                  subject: '',
                  message: '',
                  when: '',
                  customDate: '',
                })
              }}
            >
              Discard draft ×
            </button>
          </div>
        )}

        {atLimit && (
          <div className="warn">
            ⚠ You've used all {FREE_LIMIT} free capsules. Upgrade for unlimited.
          </div>
        )}
        {!atLimit && remaining <= 3 && (
          <div className="warn">
            ✦ {remaining} capsule{remaining !== 1 ? 's' : ''} remaining on free plan.
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            STEP 1 — Pick template
        ══════════════════════════════════════════════════════ */}
        {step === 1 && (
          <>
            <p className="eyebrow">Step 1 of 3</p>
            <h1 className="heading">
              Choose your <em>template.</em>
            </h1>
            <p className="subhead">
              Locked templates are fully visible — click to preview before unlocking.
            </p>

            <div className="tgrid">
              {TEMPLATES.map(t => {
                const locked = !FREE_IDS.includes(t.id)
                const selected = selectedTemplate === t.id
                // Extract emoji from scenario string (first char cluster)
                const emoji =
                  t.scenario.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|[^\s]+)/u)?.[0] || '✦'
                return (
                  <div
                    key={t.id}
                    className={`tc ${selected ? 'sel' : ''} ${locked ? 'tc-lk' : ''}`}
                    style={{ background: t.card.bg }}
                    onClick={() => (locked ? setLockedModal(t) : setTemplate(t.id))}
                    title={locked ? `${t.name} — Premium template` : t.name}
                  >
                    <div className="tc-prev" style={{ background: t.card.bg }}>
                      <div className="tc-emoji">{emoji}</div>
                      <div className="tc-bar" style={{ background: t.card.accent }} />
                      <div className="tc-line" style={{ background: t.card.text, width: '80%' }} />
                      <div className="tc-line" style={{ background: t.card.text, width: '65%' }} />
                    </div>
                    <div className="tc-meta" style={{ background: `${t.card.bg}f0` }}>
                      <div className="tc-nm" style={{ color: t.card.text }}>
                        {t.name}
                      </div>
                      <div className="tc-ds">{t.desc}</div>
                    </div>
                    {locked && (
                      <div className="tc-lock">
                        <span className="tc-lk-ico">🔒</span>
                        <span className="tc-lk-badge">Premium</span>
                        <span className="tc-lk-price">$5 lifetime</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="cont-wrap">
              <button className="cont-btn" onClick={() => setStep(2)}>
                Continue with {tmpl.name} →
              </button>
              <p className="cont-note">
                {tmpl.scenario} · {tmpl.desc}
              </p>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            STEP 2 — Write details + live preview
        ══════════════════════════════════════════════════════ */}
        {step === 2 && (
          <>
            <button className="back-btn" onClick={() => setStep(1)}>
              ← Back to templates
            </button>
            <div className="tmpl-chip" onClick={() => setStep(1)} title="Click to change">
              <div className="tmpl-dot" style={{ background: tmpl.card.accent }} />
              {tmpl.scenario} {tmpl.name} · change template
            </div>

            <p className="eyebrow">Step 2 of 3</p>
            <h1 className="heading">
              Write your <em>message.</em>
            </h1>

            <div className="s2grid">
              {/* Left: form */}
              <div>
                <div className="frow">
                  <div>
                    <label className="fl">To — recipient name *</label>
                    <input
                      className="fi"
                      type="text"
                      placeholder="My daughter Sofia..."
                      value={form.to}
                      onChange={sf('to')}
                    />
                  </div>
                  <div>
                    <label className="fl">Their email *</label>
                    <input
                      className={`fi${emailError ? ' fi-err' : ''}`}
                      type="email"
                      placeholder="sofia@example.com"
                      value={form.toEmail}
                      onChange={sf('toEmail')}
                      onBlur={e => {
                        if (e.target.value && !validateEmail(e.target.value)) {
                          setEmailError('Please enter a valid email address')
                        } else {
                          setEmailError('')
                        }
                      }}
                    />
                    {emailError && <p className="field-error">⚠ {emailError}</p>}
                  </div>
                </div>

                <div className="frow">
                  <div>
                    <label className="fl">
                      From — your name <span>(optional)</span>
                    </label>
                    <input
                      className="fi"
                      type="text"
                      placeholder="Your name"
                      value={form.from}
                      onChange={sf('from')}
                    />
                  </div>
                  <div>
                    <label className="fl">
                      Subject <span>(optional)</span>
                    </label>
                    <input
                      className="fi"
                      type="text"
                      placeholder={tmpl.name}
                      value={form.subject}
                      onChange={sf('subject')}
                    />
                  </div>
                </div>

                <div className="fg">
                  <label className="fl">Your message *</label>
                  <textarea
                    className="ft"
                    placeholder={tmpl.placeholder}
                    value={form.message}
                    onChange={sf('message')}
                    maxLength={5000}
                  />
                  <div className="cc">{form.message.length} / 5000</div>
                </div>

                <div className="frow">
                  <div>
                    <label className="fl">Deliver in *</label>
                    <select className="fs" value={form.when} onChange={sf('when')}>
                      <option value="">Choose a time...</option>
                      {DELIVERY_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {isCustom && (
                    <div>
                      <label className="fl">Delivery date *</label>
                      <input
                        className="fi"
                        type="date"
                        value={form.customDate}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        max={customMax(form.when)}
                        onChange={sf('customDate')}
                      />
                    </div>
                  )}
                </div>

                {days && (
                  <div className="deli-hint">
                    ✦ Sealed for <strong>{days.toLocaleString()} days</strong> — delivers{' '}
                    {fmtDate(delAt)}
                  </div>
                )}

                <button
                  className="review-btn"
                  onClick={() => setStep(3)}
                  disabled={!canReview || atLimit}
                >
                  {atLimit
                    ? '⚠ Capsule limit reached'
                    : canReview
                      ? 'Review & Confirm →'
                      : 'Fill in all required fields to continue'}
                </button>
              </div>

              {/* Right: live preview */}
              <div>
                <div className="sticky">
                  <p className="prev-label">✦ Live preview — updates as you type</p>
                  <EmailPreview templateId={selectedTemplate} form={form} />
                  <p className="prev-note">Exactly what lands in the inbox</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            STEP 3 — Confirm & seal
        ══════════════════════════════════════════════════════ */}
        {step === 3 && (
          <>
            <button className="back-btn" onClick={() => setStep(2)}>
              ← Edit message
            </button>

            <p className="eyebrow">Step 3 of 3</p>
            <h1 className="heading">
              Confirm & <em>seal.</em>
            </h1>
            <p className="subhead">
              Look it over one last time. Once sealed, it travels until the day arrives.
            </p>

            <div className="confirm-wrap">
              {/* Meta summary */}
              <div className="confirm-meta">
                {[
                  { key: 'Template', val: `${tmpl.scenario} ${tmpl.name}` },
                  { key: 'To', val: `${form.to} · ${form.toEmail}` },
                  { key: 'From', val: form.from || '—' },
                  { key: 'Subject', val: form.subject || tmpl.name },
                  {
                    key: 'Delivers',
                    val: delAt
                      ? `${fmtDate(delAt)} (${days?.toLocaleString()} days from now)`
                      : '—',
                  },
                ].map(r => (
                  <div className="cm-row" key={r.key}>
                    <span className="cm-key">{r.key}</span>
                    <span className="cm-val">{r.val}</span>
                  </div>
                ))}
                <div className="cm-row">
                  <span className="cm-key">Message</span>
                  <span className="cm-val cm-msg">{form.message}</span>
                </div>
              </div>

              {/* Full email preview */}
              <div className="confirm-preview">
                <p className="prev-label" style={{ marginBottom: '0.65rem' }}>
                  ✦ Email preview
                </p>
                <EmailPreview templateId={selectedTemplate} form={form} />
              </div>

              {/* Actions */}
              <div className="confirm-actions">
                <button className="seal-btn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? '✦ Sealing...' : '✦ Seal & Send Into Time'}
                </button>
                <button className="btn-g" onClick={() => setStep(2)}>
                  ← Edit
                </button>
                <button className="btn-g" onClick={() => setStep(1)}>
                  Change Template
                </button>
              </div>
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.58rem',
                  color: 'rgba(200,184,152,0.28)',
                  marginTop: '0.75rem',
                  letterSpacing: '0.04em',
                }}
              >
                {capsuleCount} of {FREE_LIMIT} capsules used
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
