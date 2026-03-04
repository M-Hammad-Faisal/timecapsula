'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'

// ── Constants ─────────────────────────────────────────────────────
const FREE_LIMIT = 10
const FREE_IDS = ['cosmic', 'dawn', 'midnight-letter']

const DELIVERY_OPTIONS = [
  { value: '1w', label: '1 week from now' },
  { value: '1m', label: '1 month from now' },
  { value: '3m', label: '3 months from now' },
  { value: '6m', label: '6 months from now' },
  { value: '1y', label: '1 year from now' },
  { value: '2y', label: '2 years from now' },
  { value: '3y', label: '3 years from now' },
  { value: 'custom-3y', label: 'Pick a date (within 3 years)' },
]

// ── Templates ─────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'cosmic',
    tier: 'free',
    scenario: '✦ For anyone',
    name: 'Cosmic Night',
    desc: 'Timeless · Dark · Mysterious',
    placeholder:
      "Write as if time doesn't exist. No one will read this until the moment you choose...",
    card: { bg: '#080c14', accent: '#e8a84c', text: '#f2e8d5', dim: '#c8b898' },
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
    tier: 'free',
    scenario: '🌅 For hope',
    name: 'Golden Dawn',
    desc: 'Hopeful · Warm · Uplifting',
    placeholder:
      "By the time you read this, the sun will have risen many times. Here's what I want you to remember...",
    card: { bg: '#fff8e8', accent: '#c47a1a', text: '#2a1505', dim: '#8a6030' },
    email: {
      bg: '#fff8e8',
      header: 'linear-gradient(135deg,#fff8e8,#fdecc0)',
      accent: '#c47a1a',
      text: '#2a1505',
      dim: '#8a6030',
      border: 'rgba(196,122,26,0.2)',
    },
  },
  {
    id: 'midnight-letter',
    tier: 'free',
    scenario: '🌙 For yourself',
    name: 'Midnight Letter',
    desc: 'Reflective · Cool · Honest',
    placeholder: "Dear future me, right now I'm sitting here thinking about...",
    card: { bg: '#0a0f1e', accent: '#8ab4f8', text: '#e8f0ff', dim: '#a0b8d8' },
    email: {
      bg: '#0a0f1e',
      header: 'linear-gradient(135deg,#0f1729,#162040)',
      accent: '#8ab4f8',
      text: '#e8f0ff',
      dim: '#a0b8d8',
      border: 'rgba(138,180,248,0.2)',
    },
  },
  {
    id: 'first-birthday',
    tier: 'premium',
    scenario: '🎂 For a child',
    name: 'First Birthday',
    desc: 'Sweet · Gentle · Parental love',
    placeholder:
      "My darling, today you turned one. You have no idea what's happening around you, but I want you to know...",
    card: { bg: '#fff0f7', accent: '#e8679a', text: '#2a0a18', dim: '#9a4070' },
    email: {
      bg: '#fff0f7',
      header: 'linear-gradient(135deg,#fff0f7,#fdd8ea)',
      accent: '#e8679a',
      text: '#2a0a18',
      dim: '#9a4070',
      border: 'rgba(232,103,154,0.2)',
    },
  },
  {
    id: 'graduation',
    tier: 'premium',
    scenario: '🎓 For a student',
    name: 'Graduation Day',
    desc: 'Proud · Encouraging · Achievement',
    placeholder:
      "You did it. Right now, on this day, I am so incredibly proud of everything you've worked for...",
    card: { bg: '#0f1a0f', accent: '#5cb85c', text: '#e8f5e8', dim: '#7dc97d' },
    email: {
      bg: '#0f1a0f',
      header: 'linear-gradient(135deg,#0f1a0f,#1a2e1a)',
      accent: '#5cb85c',
      text: '#e8f5e8',
      dim: '#7dc97d',
      border: 'rgba(92,184,92,0.2)',
    },
  },
  {
    id: 'wedding',
    tier: 'premium',
    scenario: '💍 For a partner',
    name: 'Wedding Vows',
    desc: 'Romantic · Intimate · Eternal',
    placeholder:
      "On our wedding day, here's everything I couldn't fit into my vows. The things I wanted to say but...",
    card: { bg: '#1a0f0a', accent: '#c8916a', text: '#f5ede8', dim: '#a07060' },
    email: {
      bg: '#1a0f0a',
      header: 'linear-gradient(135deg,#1a0f0a,#2e1a10)',
      accent: '#c8916a',
      text: '#f5ede8',
      dim: '#a07060',
      border: 'rgba(200,145,106,0.2)',
    },
  },
  {
    id: 'startup',
    tier: 'premium',
    scenario: '🚀 For a founder',
    name: 'Day One',
    desc: 'Ambitious · Raw · Entrepreneurial',
    placeholder:
      "Today I'm starting something that might fail. But here's why I'm doing it anyway, and what I believe...",
    card: { bg: '#080c18', accent: '#7c6ef5', text: '#e8e8ff', dim: '#9090cc' },
    email: {
      bg: '#080c18',
      header: 'linear-gradient(135deg,#0c1028,#141830)',
      accent: '#7c6ef5',
      text: '#e8e8ff',
      dim: '#9090cc',
      border: 'rgba(124,110,245,0.2)',
    },
  },
  {
    id: 'grief',
    tier: 'premium',
    scenario: '🕊️ After a loss',
    name: 'In Loving Memory',
    desc: 'Tender · Healing · Comforting',
    placeholder:
      "I know this year has been hard. I'm writing this now because I want you to know, even from across time, that...",
    card: { bg: '#0f0f18', accent: '#a8b4e8', text: '#e8eaf5', dim: '#8898cc' },
    email: {
      bg: '#0f0f18',
      header: 'linear-gradient(135deg,#0f0f20,#18182e)',
      accent: '#a8b4e8',
      text: '#e8eaf5',
      dim: '#8898cc',
      border: 'rgba(168,180,232,0.2)',
    },
  },
  {
    id: 'retirement',
    tier: 'premium',
    scenario: '🌿 For retirement',
    name: 'Golden Years',
    desc: 'Reflective · Grateful · Wise',
    placeholder:
      "Today was my last day. Forty years of work, and now it's done. Here's everything I learned and never said...",
    card: { bg: '#1a1500', accent: '#e8c84c', text: '#f8f0d5', dim: '#c0a870' },
    email: {
      bg: '#1a1500',
      header: 'linear-gradient(135deg,#1a1500,#2a2000)',
      accent: '#e8c84c',
      text: '#f8f0d5',
      dim: '#c0a870',
      border: 'rgba(232,200,76,0.2)',
    },
  },
  {
    id: 'new-year',
    tier: 'premium',
    scenario: '🎊 New Year',
    name: 'Dear January',
    desc: 'Hopeful · Resolute · Fresh start',
    placeholder:
      "It's the start of a new year. Here's everything I want to remember about who I am right now...",
    card: { bg: '#05101e', accent: '#4ad4f5', text: '#e0f8ff', dim: '#80c8e0' },
    email: {
      bg: '#05101e',
      header: 'linear-gradient(135deg,#05101e,#0a1a2e)',
      accent: '#4ad4f5',
      text: '#e0f8ff',
      dim: '#80c8e0',
      border: 'rgba(74,212,245,0.2)',
    },
  },
  {
    id: 'apology',
    tier: 'premium',
    scenario: '🤝 To make peace',
    name: 'Unsent Words',
    desc: 'Vulnerable · Honest · Healing',
    placeholder:
      "There's something I've never said to you. By the time you read this, I hope enough time has passed to...",
    card: { bg: '#180a0a', accent: '#e87878', text: '#fff0f0', dim: '#c08080' },
    email: {
      bg: '#180a0a',
      header: 'linear-gradient(135deg,#180a0a,#280f0f)',
      accent: '#e87878',
      text: '#fff0f0',
      dim: '#c08080',
      border: 'rgba(232,120,120,0.2)',
    },
  },
  {
    id: 'milestone',
    tier: 'premium',
    scenario: '🏆 For a milestone',
    name: 'The Summit',
    desc: 'Triumphant · Proud · Celebratory',
    placeholder:
      "Right now I'm standing at the foot of something huge. By the time you read this, I will have...",
    card: { bg: '#0f0a00', accent: '#ffa040', text: '#fff5e0', dim: '#c08040' },
    email: {
      bg: '#0f0a00',
      header: 'linear-gradient(135deg,#0f0a00,#201500)',
      accent: '#ffa040',
      text: '#fff5e0',
      dim: '#c08040',
      border: 'rgba(255,160,64,0.2)',
    },
  },
  {
    id: 'friendship',
    tier: 'premium',
    scenario: '👫 For a best friend',
    name: 'Old Friends',
    desc: 'Warm · Nostalgic · Playful',
    placeholder:
      "Remember when we used to talk every single day? I'm writing this because I want you to know...",
    card: { bg: '#0a1808', accent: '#88d068', text: '#f0ffe8', dim: '#80b860' },
    email: {
      bg: '#0a1808',
      header: 'linear-gradient(135deg,#0a1808,#152510)',
      accent: '#88d068',
      text: '#f0ffe8',
      dim: '#80b860',
      border: 'rgba(136,208,104,0.2)',
    },
  },
  {
    id: 'diagnosis',
    tier: 'premium',
    scenario: '💙 Through illness',
    name: 'Brave Words',
    desc: 'Courageous · Raw · Deeply human',
    placeholder:
      "Today I got news that changed everything. I'm writing this now because I want someone I love to know...",
    card: { bg: '#08101e', accent: '#60a8e8', text: '#e0f0ff', dim: '#7090c0' },
    email: {
      bg: '#08101e',
      header: 'linear-gradient(135deg,#08101e,#101828)',
      accent: '#60a8e8',
      text: '#e0f0ff',
      dim: '#7090c0',
      border: 'rgba(96,168,232,0.2)',
    },
  },
  {
    id: 'parchment',
    tier: 'premium',
    scenario: '📜 Classic letter',
    name: 'Vintage Parchment',
    desc: 'Aged · Literary · Timeless',
    placeholder:
      'I write to you from a world you may barely remember. The clocks ticked differently then...',
    card: { bg: '#f5e8c8', accent: '#8b4513', text: '#2a1505', dim: '#7a5028' },
    email: {
      bg: '#f5e8c8',
      header: 'linear-gradient(135deg,#f5e8c8,#ead8a8)',
      accent: '#8b4513',
      text: '#2a1505',
      dim: '#7a5028',
      border: 'rgba(139,69,19,0.2)',
    },
  },
]

// ── Helpers ───────────────────────────────────────────────────────
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

// ── Step Bar ──────────────────────────────────────────────────────
const STEP_LABELS = ['Template', 'Write', 'Confirm']
function StepBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', maxWidth: 380, margin: '0 auto 2rem' }}>
      {STEP_LABELS.map((label, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'active' : 'todo'
        return (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: i < STEP_LABELS.length - 1 ? 1 : undefined,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: 'all 0.3s',
                  background:
                    state === 'active'
                      ? 'var(--amb)'
                      : state === 'done'
                        ? 'rgba(232,168,76,0.15)'
                        : 'rgba(255,255,255,0.05)',
                  color:
                    state === 'active'
                      ? 'var(--ink)'
                      : state === 'done'
                        ? 'var(--amb)'
                        : 'rgba(200,184,152,0.3)',
                  border: state === 'done' ? '1px solid rgba(232,168,76,0.4)' : 'none',
                }}
              >
                {state === 'done' ? '✓' : n}
              </div>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  color: state === 'active' ? 'var(--amb)' : 'rgba(200,184,152,0.3)',
                }}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: step > n ? 'rgba(232,168,76,0.3)' : 'rgba(232,168,76,0.1)',
                  margin: '0 6px',
                  marginBottom: 20,
                }}
              />
            )}
          </div>
        )
      })}
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
.tgrid{display:grid;grid-template-columns:repeat(6,1fr);gap:0.65rem;margin-bottom:2.5rem;}
@media(max-width:1100px){.tgrid{grid-template-columns:repeat(5,1fr);}}
@media(max-width:860px){.tgrid{grid-template-columns:repeat(4,1fr);}}
@media(max-width:620px){.tgrid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:400px){.tgrid{grid-template-columns:repeat(2,1fr);}}

.tc{border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.2s;position:relative;}
.tc:hover:not(.tc-lk){transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.4);}
.tc.sel{border-color:var(--amb);box-shadow:0 0 0 3px rgba(232,168,76,0.2);}
.tc-prev{height:58px;padding:10px 12px;display:flex;flex-direction:column;justify-content:center;gap:4px;}
.tc-bar{height:3px;border-radius:2px;}
.tc-line{height:2px;border-radius:1px;opacity:0.32;}
.tc-meta{padding:7px 9px 9px;}
.tc-sc{font-family:'JetBrains Mono',monospace;font-size:0.5rem;color:rgba(255,255,255,0.35);margin-bottom:2px;}
.tc-nm{font-family:'Playfair Display',serif;font-size:0.72rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.tc-ds{font-family:'JetBrains Mono',monospace;font-size:0.48rem;color:rgba(255,255,255,0.25);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.tc-lock{position:absolute;inset:0;background:rgba(8,12,20,0.72);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;backdrop-filter:blur(1px);}
.tc-lk-ico{font-size:0.9rem;}
.tc-lk-badge{font-family:'JetBrains Mono',monospace;font-size:0.46rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--amb);background:rgba(232,168,76,0.1);border:1px solid rgba(232,168,76,0.26);padding:2px 7px;border-radius:2px;}

/* ── Step 1 continue btn ── */
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
.m-btns{display:flex;gap:0.6rem;}
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

  const supabase = createClient()

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
              <button
                className="btn-p"
                onClick={() => {
                  showToast('Payments coming soon — stay tuned!')
                  setLockedModal(null)
                }}
              >
                Unlock Template
              </button>
              <button className="btn-g" onClick={() => setLockedModal(null)}>
                Maybe Later
              </button>
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
        <StepBar step={step} />

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
                return (
                  <div
                    key={t.id}
                    className={`tc ${selected ? 'sel' : ''} ${locked ? 'tc-lk' : ''}`}
                    style={{ background: t.card.bg }}
                    onClick={() => (locked ? setLockedModal(t) : setTemplate(t.id))}
                  >
                    <div className="tc-prev" style={{ background: t.card.bg }}>
                      <div className="tc-bar" style={{ background: t.card.accent, width: '55%' }} />
                      <div className="tc-line" style={{ background: t.card.text, width: '80%' }} />
                      <div className="tc-line" style={{ background: t.card.text, width: '60%' }} />
                      <div className="tc-line" style={{ background: t.card.text, width: '72%' }} />
                    </div>
                    <div className="tc-meta" style={{ background: `${t.card.bg}ee` }}>
                      <div className="tc-sc">{t.scenario}</div>
                      <div className="tc-nm" style={{ color: t.card.text }}>
                        {t.name}
                      </div>
                      <div className="tc-ds">{t.desc}</div>
                    </div>
                    {locked && (
                      <div className="tc-lock">
                        <span className="tc-lk-ico">🔒</span>
                        <span className="tc-lk-badge">$5 lifetime</span>
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
                      className="fi"
                      type="email"
                      placeholder="sofia@example.com"
                      value={form.toEmail}
                      onChange={sf('toEmail')}
                    />
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
