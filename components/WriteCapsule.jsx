'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'

// ── Plan delivery options ─────────────────────────────────────────
const DELIVERY_BY_PLAN = {
  guest: [
    { value: '1w', label: '1 week from now' },
    { value: '1m', label: '1 month from now' },
    { value: '3m', label: '3 months from now' },
    { value: '6m', label: '6 months from now' },
    { value: 'custom-6m', label: 'Pick a date (within 6 months)' },
  ],
  free: [
    { value: '1w', label: '1 week from now' },
    { value: '1m', label: '1 month from now' },
    { value: '3m', label: '3 months from now' },
    { value: '6m', label: '6 months from now' },
    { value: '1y', label: '1 year from now' },
    { value: '2y', label: '2 years from now' },
    { value: '3y', label: '3 years from now' },
    { value: 'custom-3y', label: 'Pick a date (within 3 years)' },
  ],
  premium: [
    { value: '1w', label: '1 week from now' },
    { value: '1m', label: '1 month from now' },
    { value: '3m', label: '3 months from now' },
    { value: '6m', label: '6 months from now' },
    { value: '1y', label: '1 year from now' },
    { value: '2y', label: '2 years from now' },
    { value: '3y', label: '3 years from now' },
    { value: '5y', label: '5 years from now' },
    { value: '10y', label: '10 years from now' },
    { value: 'custom', label: 'Pick any date' },
  ],
}

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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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
    price: { lifetime: 5, uses: 1 },
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

const FREE_IDS = ['cosmic', 'dawn', 'midnight-letter']
const FREE_LIMIT = 10

// ── Email Preview Component ───────────────────────────────────────
export function EmailPreview({ templateId, form, compact }) {
  const tmpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0]
  const e = tmpl.email
  const to = form.to || 'Recipient'
  const from = form.from || 'Someone who cares'
  const subject = form.subject || tmpl.name
  const message = form.message || tmpl.placeholder
  const msgHTML = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
  const pad = compact ? '14px 18px' : '22px 26px'
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
        {['rgba(255,80,80,0.6)', 'rgba(255,200,0,0.6)', 'rgba(80,200,80,0.6)'].map((c, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
        ))}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 9,
            color: 'rgba(255,255,255,0.25)',
            marginLeft: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          To: {form.toEmail || 'recipient@email.com'} · {subject}
        </span>
      </div>
      <div
        style={{
          background: e.header,
          padding: compact ? '18px 18px 14px' : '24px 26px 18px',
          textAlign: 'center',
          borderBottom: `1px solid ${e.border}`,
        }}
      >
        <p
          style={{
            margin: '0 0 6px',
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
            fontSize: compact ? 14 : 17,
            fontWeight: 700,
            color: e.text,
            lineHeight: 1.3,
          }}
        >
          {subject}
        </p>
      </div>
      <div style={{ padding: pad }}>
        <p
          style={{
            margin: '0 0 4px',
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
            padding: compact ? '12px 14px' : '16px 18px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `2px solid ${e.accent}`,
            borderRadius: '0 3px 3px 0',
          }}
        >
          <p
            style={{ margin: 0, fontSize: fs, lineHeight: 1.8, color: e.text }}
            dangerouslySetInnerHTML={{ __html: msgHTML }}
          />
        </div>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: fs - 1,
            color: e.dim,
            textAlign: 'right',
            fontStyle: 'italic',
          }}
        >
          — {from}
        </p>
      </div>
      <div
        style={{
          padding: compact ? '8px 18px 14px' : '10px 26px 18px',
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

// ── Helpers ───────────────────────────────────────────────────────
function computeDeliveryDate(when, customDate) {
  const now = new Date()
  if (when.startsWith('custom')) {
    if (!customDate) return null
    const d = new Date(customDate)
    return isNaN(d) ? null : d
  }
  const days = {
    '1w': 7,
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365,
    '2y': 730,
    '3y': 1095,
    '5y': 1825,
    '10y': 3650,
    '25y': 9125,
    '30y': 10950,
    '50y': 18250,
  }[when]
  return days ? new Date(now.getTime() + days * 86400000) : null
}

function getCustomMax(when, plan) {
  if (when === 'custom-6m') return new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
  if (when === 'custom-3y')
    return new Date(Date.now() + 1095 * 86400000).toISOString().split('T')[0]
  return undefined
}

// ── Styles ────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;500&family=JetBrains+Mono:wght@300;400&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{--midnight:#080c14;--cosmos:#0d1525;--amber:#e8a84c;--gold:#f5c842;--parchment:#f2e8d5;--parchment-dim:#c8b898;--ink:#1a1005;}
  body{font-family:'Lora',serif;background:var(--midnight);color:var(--parchment);min-height:100vh;}

  /* NAV */
  nav{padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(232,168,76,0.1);background:rgba(8,12,20,0.96);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);}
  .logo{font-family:'Playfair Display',serif;font-size:1.2rem;color:var(--amber);text-decoration:none;}
  .logo em{font-style:italic;color:var(--gold);}
  .nav-r{display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;}
  .nav-counter{font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:var(--parchment-dim);background:rgba(232,168,76,0.06);border:1px solid rgba(232,168,76,0.12);padding:0.28rem 0.65rem;border-radius:2px;white-space:nowrap;}
  .nav-counter strong{color:var(--amber);}
  .nav-link{font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.06em;color:var(--parchment-dim);text-decoration:none;transition:color 0.2s;white-space:nowrap;}
  .nav-link:hover{color:var(--amber);}

  /* STEP INDICATOR */
  .steps{display:flex;align-items:center;gap:0;max-width:340px;margin:0 auto 2rem;}
  .step{display:flex;align-items:center;gap:0.5rem;flex:1;}
  .step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:0.65rem;font-weight:700;flex-shrink:0;transition:all 0.3s;}
  .step-dot.active{background:var(--amber);color:var(--ink);}
  .step-dot.done{background:rgba(232,168,76,0.2);color:var(--amber);border:1px solid rgba(232,168,76,0.4);}
  .step-dot.inactive{background:rgba(255,255,255,0.05);color:rgba(200,184,152,0.3);border:1px solid rgba(255,255,255,0.08);}
  .step-label{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;}
  .step-label.active{color:var(--amber);}
  .step-label.inactive{color:rgba(200,184,152,0.3);}
  .step-connector{flex:1;height:1px;background:rgba(232,168,76,0.15);margin:0 0.5rem;}

  /* PAGE */
  .page{max-width:1200px;margin:0 auto;padding:2rem 1.5rem;}
  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.28em;text-transform:uppercase;color:var(--amber);margin-bottom:0.5rem;}
  .heading{font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--parchment);margin-bottom:0.4rem;line-height:1.2;}
  .heading em{font-style:italic;color:var(--amber);}
  .subhead{color:var(--parchment-dim);font-size:0.85rem;font-style:italic;margin-bottom:2rem;}

  /* TEMPLATE GRID */
  .tmpl-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:0.65rem;margin-bottom:2.5rem;}
  @media(max-width:1100px){.tmpl-grid{grid-template-columns:repeat(5,1fr);}}
  @media(max-width:860px){.tmpl-grid{grid-template-columns:repeat(4,1fr);}}
  @media(max-width:640px){.tmpl-grid{grid-template-columns:repeat(3,1fr);}}
  @media(max-width:420px){.tmpl-grid{grid-template-columns:repeat(2,1fr);}}

  .tc{border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.2s;position:relative;}
  .tc:hover:not(.tc-locked){transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.4);}
  .tc.selected{border-color:var(--amber);box-shadow:0 0 0 3px rgba(232,168,76,0.2);}
  .tc-preview{height:60px;padding:10px 12px;display:flex;flex-direction:column;justify-content:center;gap:4px;}
  .tc-bar{height:3px;border-radius:2px;}
  .tc-line{height:2px;border-radius:1px;opacity:0.35;}
  .tc-meta{padding:7px 9px 9px;}
  .tc-scenario{font-family:'JetBrains Mono',monospace;font-size:0.5rem;letter-spacing:0.06em;color:rgba(255,255,255,0.38);margin-bottom:2px;}
  .tc-name{font-family:'Playfair Display',serif;font-size:0.72rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .tc-desc{font-family:'JetBrains Mono',monospace;font-size:0.48rem;color:rgba(255,255,255,0.28);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .tc-lock{position:absolute;inset:0;background:rgba(8,12,20,0.7);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;backdrop-filter:blur(1px);}
  .tc-lock-icon{font-size:0.9rem;}
  .tc-lock-badge{font-family:'JetBrains Mono',monospace;font-size:0.46rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--amber);background:rgba(232,168,76,0.1);border:1px solid rgba(232,168,76,0.28);padding:2px 7px;border-radius:2px;}

  /* STEP 1 NEXT BUTTON */
  .next-btn{display:flex;align-items:center;justify-content:center;gap:0.75rem;background:var(--amber);color:var(--ink);border:none;padding:0.95rem 2.5rem;font-family:'Lora',serif;font-size:1rem;cursor:pointer;border-radius:2px;transition:all 0.2s;margin:0 auto;}
  .next-btn:hover{background:var(--gold);}
  .next-btn-wrap{text-align:center;}
  .next-note{font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:rgba(200,184,152,0.35);margin-top:0.6rem;letter-spacing:0.06em;}

  /* STEP 2 LAYOUT */
  .step2-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:start;}
  @media(max-width:860px){.step2-grid{grid-template-columns:1fr;}}
  .preview-sticky{position:sticky;top:80px;}
  .preview-label{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--amber);margin-bottom:0.6rem;}
  .preview-note{font-family:'JetBrains Mono',monospace;font-size:0.54rem;color:rgba(200,184,152,0.28);text-align:center;margin-top:0.5rem;letter-spacing:0.08em;text-transform:uppercase;}

  /* FORM */
  .form-group{margin-bottom:1rem;}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;margin-bottom:1rem;}
  @media(max-width:580px){.form-row{grid-template-columns:1fr;}}
  .fl{display:block;font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--amber);margin-bottom:0.4rem;}
  .fl span{color:var(--parchment-dim);text-transform:none;letter-spacing:0;font-size:0.58rem;}
  .fi,.fta,.fs{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(232,168,76,0.14);border-radius:2px;padding:0.75rem 0.9rem;color:var(--parchment);font-family:'Lora',serif;font-size:0.9rem;outline:none;transition:border-color 0.2s;}
  .fi:focus,.fta:focus,.fs:focus{border-color:var(--amber);background:rgba(232,168,76,0.03);}
  .fi::placeholder,.fta::placeholder{color:rgba(200,184,152,0.28);font-style:italic;}
  .fta{resize:vertical;min-height:170px;line-height:1.8;}
  .fs{cursor:pointer;}
  input[type="date"].fi{color-scheme:dark;cursor:pointer;}
  input[type="date"].fi::-webkit-calendar-picker-indicator{filter:invert(0.7) sepia(1) saturate(3) hue-rotate(5deg);cursor:pointer;}
  .char-count{font-family:'JetBrains Mono',monospace;font-size:0.58rem;color:var(--parchment-dim);text-align:right;margin-top:0.25rem;}

  .delivery-hint{background:rgba(232,168,76,0.05);border:1px solid rgba(232,168,76,0.12);border-radius:2px;padding:0.7rem 0.9rem;margin-bottom:1rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--parchment-dim);letter-spacing:0.03em;}
  .delivery-hint strong{color:var(--amber);}

  .submit-btn{width:100%;background:var(--amber);color:var(--ink);border:none;padding:0.95rem;font-family:'Lora',serif;font-size:0.95rem;cursor:pointer;border-radius:2px;transition:all 0.2s;margin-top:0.5rem;}
  .submit-btn:hover{background:var(--gold);}
  .submit-btn:disabled{opacity:0.6;cursor:not-allowed;}
  .submit-note{font-family:'JetBrains Mono',monospace;font-size:0.58rem;color:rgba(200,184,152,0.32);text-align:center;margin-top:0.5rem;letter-spacing:0.04em;}

  .back-link{display:inline-flex;align-items:center;gap:0.4rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.08em;color:var(--parchment-dim);cursor:pointer;background:none;border:none;padding:0;margin-bottom:1.5rem;transition:color 0.2s;}
  .back-link:hover{color:var(--amber);}

  .warn{background:rgba(232,168,76,0.06);border:1px solid rgba(232,168,76,0.2);border-radius:3px;padding:0.75rem 0.9rem;margin-bottom:1.25rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--amber);letter-spacing:0.03em;}
  .divider{height:1px;background:linear-gradient(to right,transparent,rgba(232,168,76,0.12),transparent);margin:2rem 0;}

  /* SELECTED TEMPLATE CHIP */
  .tmpl-chip{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(232,168,76,0.08);border:1px solid rgba(232,168,76,0.2);border-radius:3px;padding:0.4rem 0.8rem;font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:var(--amber);margin-bottom:1.25rem;cursor:pointer;transition:all 0.2s;}
  .tmpl-chip:hover{border-color:var(--amber);}
  .tmpl-chip-dot{width:10px;height:10px;border-radius:50%;}

  /* LOCK MODAL */
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.78);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(4px);animation:fadeIn 0.2s;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .modal{background:var(--cosmos);border:1px solid rgba(232,168,76,0.2);border-radius:6px;padding:2rem;max-width:520px;width:100%;animation:slideUp 0.2s;max-height:90vh;overflow-y:auto;}
  @keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
  .modal-eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--amber);margin-bottom:0.5rem;}
  .modal-title{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--parchment);margin-bottom:0.5rem;}
  .modal-desc{color:var(--parchment-dim);font-size:0.85rem;font-style:italic;line-height:1.7;margin-bottom:1.25rem;}
  .modal-preview{border-radius:4px;overflow:hidden;margin-bottom:1.5rem;}
  .price-row{display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;}
  .price-pill{flex:1;min-width:130px;background:rgba(232,168,76,0.05);border:1px solid rgba(232,168,76,0.18);border-radius:4px;padding:0.85rem;text-align:center;}
  .price-amount{font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--amber);}
  .price-pill-label{font-family:'JetBrains Mono',monospace;font-size:0.57rem;color:var(--parchment-dim);letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;}
  .price-pill-note{font-family:'JetBrains Mono',monospace;font-size:0.5rem;color:rgba(200,184,152,0.38);margin-top:3px;}
  .modal-btns{display:flex;gap:0.65rem;}
  .btn-p{flex:1;background:var(--amber);color:var(--ink);border:none;padding:0.8rem 1rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.2s;}
  .btn-p:hover{background:var(--gold);}
  .btn-g{background:transparent;color:var(--parchment-dim);border:1px solid rgba(232,168,76,0.18);padding:0.8rem 1rem;font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.2s;}
  .btn-g:hover{border-color:var(--amber);color:var(--amber);}

  /* SUCCESS */
  .success-wrap{min-height:70vh;display:flex;align-items:center;justify-content:center;padding:2rem;}
  .success-card{text-align:center;max-width:480px;width:100%;}
  .success-icon{font-size:3rem;display:block;margin-bottom:1.25rem;animation:float 4s ease-in-out infinite;}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .success-title{font-family:'Playfair Display',serif;font-size:1.9rem;color:var(--parchment);margin-bottom:0.65rem;}
  .success-title em{color:var(--amber);font-style:italic;}
  .success-desc{color:var(--parchment-dim);line-height:1.8;margin-bottom:2rem;font-style:italic;font-size:0.9rem;}
  .success-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}

  /* LOADING */
  .center-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;}
  .loading-text{font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:var(--amber);letter-spacing:0.2em;animation:pulse 1.5s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}

  .toast{position:fixed;bottom:1.5rem;right:1.5rem;background:var(--cosmos);border:1px solid rgba(232,168,76,0.3);border-radius:4px;padding:0.85rem 1.25rem;font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--parchment);z-index:999;animation:toastIn 0.3s ease;max-width:300px;}
  .toast-error{border-color:rgba(232,124,124,0.4);color:#e87c7c;}
  @keyframes toastIn{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
`

export default function WriteCapsule() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [capsuleCount, setCapsuleCount] = useState(0)
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState('cosmic')
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
  const plan = 'free' // future: from user metadata

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
      setUser(user)
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
  const deliverAt = computeDeliveryDate(form.when, form.customDate)
  const daysUntil = deliverAt ? Math.ceil((deliverAt - new Date()) / 86400000) : null
  const atLimit = capsuleCount >= FREE_LIMIT
  const remaining = FREE_LIMIT - capsuleCount
  const isCustomDate = form.when.startsWith('custom')
  const customMax = getCustomMax(form.when, plan)

  const handleSubmit = async () => {
    if (!form.to || !form.toEmail || !form.message) {
      showToast('Fill in recipient, email, and message.', true)
      return
    }
    if (!form.when) {
      showToast('Choose a delivery time.', true)
      return
    }
    if (isCustomDate && !form.customDate) {
      showToast('Pick a delivery date.', true)
      return
    }
    if (atLimit) {
      showToast("You've reached your 10 capsule limit.", true)
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
      showToast('Network error. Try again.', true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <>
        <style>{styles}</style>
        <div className="center-screen">
          <p className="loading-text">✦ &nbsp; opening vault &nbsp; ✦</p>
        </div>
      </>
    )

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
        <div className="success-wrap">
          <div className="success-card">
            <span className="success-icon">📬</span>
            <h2 className="success-title">
              Capsule <em>sealed.</em>
            </h2>
            <p className="success-desc">
              Your message to <strong style={{ color: 'var(--amber)' }}>{success.to}</strong> is
              locked in time.
              <br />
              <br />
              It delivers on <strong style={{ color: 'var(--amber)' }}>{dateStr}</strong>.
            </p>
            <div className="success-actions">
              <button
                className="btn-p"
                onClick={() => {
                  setForm({
                    to: '',
                    toEmail: '',
                    from: '',
                    subject: '',
                    message: '',
                    when: '',
                    customDate: '',
                  })
                  setSuccess(null)
                  setStep(1)
                  setCapsuleCount(c => c + 1)
                }}
              >
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
  }

  return (
    <>
      <style>{styles}</style>
      {toast && <div className={`toast ${toast.isError ? 'toast-error' : ''}`}>{toast.msg}</div>}

      {/* Lock modal */}
      {lockedModal && (
        <div
          className="overlay"
          onClick={e => e.target === e.currentTarget && setLockedModal(null)}
        >
          <div className="modal">
            <p className="modal-eyebrow">{lockedModal.scenario}</p>
            <h2 className="modal-title">{lockedModal.name}</h2>
            <p className="modal-desc">{lockedModal.desc}</p>
            <div className="modal-preview">
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
            <div className="price-row">
              <div className="price-pill">
                <div className="price-amount">$5</div>
                <div className="price-pill-label">Lifetime access</div>
                <div className="price-pill-note">Use unlimited times</div>
              </div>
              <div className="price-pill">
                <div className="price-amount">$1</div>
                <div className="price-pill-label">5 uses pack</div>
                <div className="price-pill-note">Perfect for one story</div>
              </div>
            </div>
            <div className="modal-btns">
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
          <span className="nav-counter">
            <strong>{capsuleCount}</strong> / {FREE_LIMIT} used
          </span>
          <a href="/dashboard" className="nav-link">
            ← Dashboard
          </a>
        </div>
      </nav>

      <div className="page">
        {/* Step indicator */}
        <div className="steps">
          <div className="step">
            <div className={`step-dot ${step === 1 ? 'active' : 'done'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`step-label ${step === 1 ? 'active' : 'inactive'}`}>Template</span>
          </div>
          <div className="step-connector" />
          <div className="step">
            <div className={`step-dot ${step === 2 ? 'active' : 'inactive'}`}>2</div>
            <span className={`step-label ${step === 2 ? 'active' : 'inactive'}`}>Write & Send</span>
          </div>
        </div>

        {atLimit && (
          <div className="warn">
            ⚠ You've used all {FREE_LIMIT} free capsules. Upgrade for unlimited.
          </div>
        )}
        {!atLimit && remaining <= 3 && (
          <div className="warn">
            ✦ {remaining} free capsule{remaining !== 1 ? 's' : ''} remaining.
          </div>
        )}

        {/* ── STEP 1: Template picker ── */}
        {step === 1 && (
          <>
            <p className="eyebrow">Step 1 of 2</p>
            <h1 className="heading">
              Choose your <em>template.</em>
            </h1>
            <p className="subhead">
              Click any locked template to preview it. Your details are saved when you go back.
            </p>

            <div className="tmpl-grid">
              {TEMPLATES.map(t => {
                const locked = !FREE_IDS.includes(t.id)
                const selected = selectedTemplate === t.id
                return (
                  <div
                    key={t.id}
                    className={`tc ${selected ? 'selected' : ''} ${locked ? 'tc-locked' : ''}`}
                    style={{ background: t.card.bg }}
                    onClick={() => (locked ? setLockedModal(t) : setSelectedTemplate(t.id))}
                  >
                    <div className="tc-preview" style={{ background: t.card.bg }}>
                      <div className="tc-bar" style={{ background: t.card.accent, width: '55%' }} />
                      <div className="tc-line" style={{ background: t.card.text, width: '80%' }} />
                      <div className="tc-line" style={{ background: t.card.text, width: '60%' }} />
                      <div className="tc-line" style={{ background: t.card.text, width: '72%' }} />
                    </div>
                    <div className="tc-meta" style={{ background: `${t.card.bg}ee` }}>
                      <div className="tc-scenario">{t.scenario}</div>
                      <div className="tc-name" style={{ color: t.card.text }}>
                        {t.name}
                      </div>
                      <div className="tc-desc">{t.desc}</div>
                    </div>
                    {locked && (
                      <div className="tc-lock">
                        <span className="tc-lock-icon">🔒</span>
                        <span className="tc-lock-badge">$5 lifetime</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="next-btn-wrap">
              <button className="next-btn" onClick={() => setStep(2)}>
                Continue with {tmpl.name} →
              </button>
              <p className="next-note">
                {tmpl.scenario} · {tmpl.desc}
              </p>
            </div>
          </>
        )}

        {/* ── STEP 2: Write + Preview ── */}
        {step === 2 && (
          <>
            <button className="back-link" onClick={() => setStep(1)}>
              ← Back to templates
            </button>

            {/* Selected template chip */}
            <div className="tmpl-chip" onClick={() => setStep(1)} title="Click to change template">
              <div className="tmpl-chip-dot" style={{ background: tmpl.card.accent }} />
              {tmpl.scenario} {tmpl.name} · click to change
            </div>

            <p className="eyebrow">Step 2 of 2</p>
            <h1 className="heading">
              Write your <em>capsule.</em>
            </h1>

            <div className="step2-grid">
              {/* Form */}
              <div>
                <div className="form-row">
                  <div>
                    <label className="fl">To — recipient *</label>
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

                <div className="form-row">
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

                <div className="form-group">
                  <label className="fl">Your message *</label>
                  <textarea
                    className="fta"
                    placeholder={tmpl.placeholder}
                    value={form.message}
                    onChange={sf('message')}
                    maxLength={5000}
                  />
                  <div className="char-count">{form.message.length} / 5000</div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="fl">Deliver in *</label>
                    <select className="fs" value={form.when} onChange={sf('when')}>
                      <option value="">Choose a time...</option>
                      {DELIVERY_BY_PLAN[plan].map(o => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {isCustomDate && (
                    <div>
                      <label className="fl">Delivery date *</label>
                      <input
                        className="fi"
                        type="date"
                        value={form.customDate}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        max={customMax}
                        onChange={sf('customDate')}
                      />
                    </div>
                  )}
                </div>

                {daysUntil && (
                  <div className="delivery-hint">
                    ✦ Sealed for <strong>{daysUntil.toLocaleString()} days</strong> — delivers{' '}
                    {deliverAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}

                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={submitting || atLimit}
                >
                  {submitting ? '✦ Sealing...' : '✦ Seal & Send Into Time'}
                </button>
                <p className="submit-note">
                  {capsuleCount} of {FREE_LIMIT} used ·{' '}
                  <a href="/#pricing" style={{ color: 'var(--amber)' }}>
                    Upgrade for unlimited
                  </a>
                </p>
              </div>

              {/* Live preview */}
              <div>
                <div className="preview-sticky">
                  <p className="preview-label">✦ Live email preview</p>
                  <EmailPreview templateId={selectedTemplate} form={form} />
                  <p className="preview-note">Exactly what arrives in the inbox</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
