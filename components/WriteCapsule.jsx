'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'

const USER_TIER = 'free'

const TIME_OPTIONS = {
  guest: [
    { v: '1w', label: '1 week' },
    { v: '1m', label: '1 month' },
    { v: '3m', label: '3 months' },
    { v: '6m', label: '6 months' },
  ],
  free: [
    { v: '1m', label: '1 month' },
    { v: '3m', label: '3 months' },
    { v: '6m', label: '6 months' },
    { v: '1y', label: '1 year' },
    { v: '2y', label: '2 years' },
    { v: '3y', label: '3 years' },
  ],
  premium: [
    { v: '1m', label: '1 month' },
    { v: '6m', label: '6 months' },
    { v: '1y', label: '1 year' },
    { v: '3y', label: '3 years' },
    { v: '5y', label: '5 years' },
    { v: '10y', label: '10 years' },
  ],
  ultimate: [
    { v: '1y', label: '1 year' },
    { v: '5y', label: '5 years' },
    { v: '10y', label: '10 years' },
    { v: '25y', label: '25 years' },
    { v: '30y', label: '30 years' },
    { v: '50y', label: '50 years' },
    { v: 'custom', label: 'Pick a date' },
  ],
}

const FREE_CAPSULE_LIMIT = 10

const TEMPLATES = [
  {
    id: 'future-self',
    name: 'To My Future Self',
    scenario: 'Self-reflection',
    desc: "A letter to who you'll become.",
    tier: 'free',
    preview_text:
      "By the time you read this, the world will have changed. I'm writing from a moment that feels both ordinary and extraordinary...",
    colors: {
      bg: '#080c14',
      header: 'linear-gradient(135deg,#0d1525,#111d35)',
      accent: '#e8a84c',
      text: '#f2e8d5',
      dim: '#c8b898',
      border: 'rgba(232,168,76,0.2)',
    },
  },
  {
    id: 'love-letter',
    name: 'Love Letter',
    scenario: 'Romance',
    desc: 'Words to someone who holds your heart.',
    tier: 'free',
    preview_text:
      'Even across time, my love for you remains unchanged. There are things I feel right now that words barely contain...',
    colors: {
      bg: '#1a0a10',
      header: 'linear-gradient(135deg,#200d15,#2a0f1a)',
      accent: '#e87c9e',
      text: '#ffe8ef',
      dim: '#c8a0b0',
      border: 'rgba(232,124,158,0.2)',
    },
  },
  {
    id: 'graduation',
    name: 'Graduation Day',
    scenario: 'Milestone',
    desc: 'Celebrate their achievement before it happens.',
    tier: 'free',
    preview_text:
      "When you hold that diploma, know that I always believed in you — even in the moments you didn't believe in yourself...",
    colors: {
      bg: '#0a100a',
      header: 'linear-gradient(135deg,#0d1a0d,#112211)',
      accent: '#6fcf6f',
      text: '#e8ffe8',
      dim: '#a0c8a0',
      border: 'rgba(111,207,111,0.2)',
    },
  },
  {
    id: 'to-my-children',
    name: 'To My Children',
    scenario: 'Parenting',
    desc: "Wisdom and love for when they're grown.",
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      'My dear child, there are things I want you to know when the world feels heavy. Things I may not have said enough...',
    colors: {
      bg: '#0f0a00',
      header: 'linear-gradient(135deg,#1a1000,#221500)',
      accent: '#f5c842',
      text: '#fff8e0',
      dim: '#c8b060',
      border: 'rgba(245,200,66,0.2)',
    },
  },
  {
    id: 'apology',
    name: 'The Apology',
    scenario: 'Healing',
    desc: "Words that couldn't be said now, but need to be.",
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      "I've been holding these words for too long. I'm sorry for the things I did and the things I didn't do. This is my attempt to make it right...",
    colors: {
      bg: '#0a0a14',
      header: 'linear-gradient(135deg,#0f0f1e,#141428)',
      accent: '#a0a8f8',
      text: '#e8e8ff',
      dim: '#9090c0',
      border: 'rgba(160,168,248,0.2)',
    },
  },
  {
    id: 'farewell',
    name: 'Farewell Letter',
    scenario: 'Goodbye',
    desc: 'For when someone needs to leave gracefully.',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      'By the time you read this, I will have moved on. Not in sadness, but with the quiet peace of someone who has said what needed saying...',
    colors: {
      bg: '#0a0a0a',
      header: 'linear-gradient(135deg,#141414,#1a1a1a)',
      accent: '#c8c8c8',
      text: '#f0f0f0',
      dim: '#909090',
      border: 'rgba(200,200,200,0.15)',
    },
  },
  {
    id: 'anniversary',
    name: 'Anniversary Letter',
    scenario: 'Celebration',
    desc: 'Seal love for a future anniversary.',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      'Another year has passed, and I find myself more in love than I was before. This letter is my proof — written today, delivered to you in our future...',
    colors: {
      bg: '#100014',
      header: 'linear-gradient(135deg,#18001e,#200028)',
      accent: '#d478e8',
      text: '#fae8ff',
      dim: '#b080c0',
      border: 'rgba(212,120,232,0.2)',
    },
  },
  {
    id: 'business-vision',
    name: 'Business Vision',
    scenario: 'Entrepreneurial',
    desc: 'A letter to future you — did the startup survive?',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      "The vision I have right now for this company is bold and perhaps naive. I'm writing this as a record of what I believed when I was still building...",
    colors: {
      bg: '#001018',
      header: 'linear-gradient(135deg,#001a28,#002030)',
      accent: '#00b4cc',
      text: '#e0f8ff',
      dim: '#70b8c8',
      border: 'rgba(0,180,204,0.2)',
    },
  },
  {
    id: 'new-year',
    name: 'New Year Prophecy',
    scenario: 'Aspirational',
    desc: 'Predictions and promises for the year ahead.',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      'As this year ends, I want to document my predictions and promises. Seal them here, and let future me be the judge of what I got right...',
    colors: {
      bg: '#000814',
      header: 'linear-gradient(135deg,#000c20,#001030)',
      accent: '#4488ff',
      text: '#e0ecff',
      dim: '#7090c8',
      border: 'rgba(68,136,255,0.2)',
    },
  },
  {
    id: 'best-friend',
    name: 'Dear Best Friend',
    scenario: 'Friendship',
    desc: 'For the person who has always been there.',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      "You've seen me at my absolute worst and somehow kept showing up. I want you to know, in writing, what that has meant to me...",
    colors: {
      bg: '#0a0010',
      header: 'linear-gradient(135deg,#100018,#160022)',
      accent: '#b878f8',
      text: '#f0e0ff',
      dim: '#a070c8',
      border: 'rgba(184,120,248,0.2)',
    },
  },
  {
    id: 'grief',
    name: 'In Memoriam',
    scenario: 'Grief & Loss',
    desc: "Words for someone you've lost, or will lose.",
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      "I write this not knowing when you'll read it, only knowing that I miss you and that grief is just love with nowhere to go...",
    colors: {
      bg: '#050810',
      header: 'linear-gradient(135deg,#080c18,#0c1020)',
      accent: '#8ab0d0',
      text: '#d8e8f8',
      dim: '#7090a8',
      border: 'rgba(138,176,208,0.15)',
    },
  },
  {
    id: 'bucket-list',
    name: 'Bucket List Check-In',
    scenario: 'Goals',
    desc: 'Did you do the things you said you would?',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      "Right now I am making you a promise. By the time this arrives, I will have done the following things — or I will owe you an honest explanation of why I didn't...",
    colors: {
      bg: '#100800',
      header: 'linear-gradient(135deg,#1a0e00,#221200)',
      accent: '#ff8822',
      text: '#fff0e0',
      dim: '#c88840',
      border: 'rgba(255,136,34,0.2)',
    },
  },
  {
    id: 'heritage',
    name: 'Heritage & Roots',
    scenario: 'Legacy',
    desc: 'Family stories for generations not yet born.',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      'To whoever in our family reads this — let me tell you about where we came from, so you know who you are and why it matters...',
    colors: {
      bg: '#0a0800',
      header: 'linear-gradient(135deg,#140e00,#1c1400)',
      accent: '#c89040',
      text: '#f8e8c8',
      dim: '#a87830',
      border: 'rgba(200,144,64,0.2)',
    },
  },
  {
    id: 'time-traveler',
    name: "Time Traveler's Log",
    scenario: 'Sci-Fi',
    desc: 'A playful message across dimensions of time.',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      'If you are reading this, then time travel is still one-way. This is my log entry from the past. Take note of what has changed and what has stubbornly stayed the same...',
    colors: {
      bg: '#000810',
      header: 'linear-gradient(135deg,#000c18,#001020)',
      accent: '#00e8b8',
      text: '#d8fff8',
      dim: '#60c0a8',
      border: 'rgba(0,232,184,0.2)',
    },
  },
  {
    id: 'career-letter',
    name: 'Career Letter',
    scenario: 'Professional',
    desc: 'Where will you be in your career in 5 years?',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      "Right now I am at a crossroads in my career. I'm writing this as a record of where I stand, what I believe, and what I'm willing to sacrifice to get there...",
    colors: {
      bg: '#000a08',
      header: 'linear-gradient(135deg,#00100c,#001814)',
      accent: '#30d8a0',
      text: '#d8fff8',
      dim: '#60b898',
      border: 'rgba(48,216,160,0.2)',
    },
  },
  {
    id: 'wedding-day',
    name: 'Wedding Day',
    scenario: 'Wedding',
    desc: 'A message to open on your wedding anniversary.',
    tier: 'premium',
    price: { forever: 5, uses: { count: 5, price: 1 } },
    preview_text:
      "On the day we said our vows, I also made silent promises I want you to know. I'm sealing them here so that future us can see how much I meant every word...",
    colors: {
      bg: '#100008',
      header: 'linear-gradient(135deg,#18000e,#200014)',
      accent: '#e87898',
      text: '#ffe8f0',
      dim: '#c07080',
      border: 'rgba(232,120,152,0.2)',
    },
  },
]

function EmailPreview({ template, form }) {
  const c = template.colors
  const to = form.to || 'Future Reader'
  const from = form.from || 'The Author'
  const subject = form.subject || template.name
  const message = form.message || template.preview_text
  const msgHTML = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
  return (
    <div
      style={{
        background: c.bg,
        borderRadius: 6,
        overflow: 'hidden',
        border: `1px solid ${c.border}`,
        fontFamily: 'Georgia,serif',
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 9,
            color: 'rgba(255,255,255,0.25)',
            marginLeft: 8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          capsule@timecapsula.website → {form.toEmail || 'recipient@email.com'}
        </span>
      </div>
      <div
        style={{
          background: c.header,
          padding: '22px 24px 16px',
          textAlign: 'center',
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontFamily: 'monospace',
            fontSize: 8,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: c.accent,
          }}
        >
          ✦ &nbsp; Time Capsula &nbsp; ✦
        </p>
        <p
          style={{
            margin: '0 0 4px',
            fontFamily: 'Georgia,serif',
            fontSize: 15,
            fontWeight: 700,
            color: c.text,
            lineHeight: 1.3,
          }}
        >
          {subject}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'monospace',
            fontSize: 8,
            color: c.dim,
            letterSpacing: 1,
          }}
        >
          {template.scenario.toUpperCase()}
        </p>
      </div>
      <div style={{ padding: '18px 24px' }}>
        <p
          style={{
            margin: '0 0 4px',
            fontSize: 9,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: c.accent,
            fontFamily: 'monospace',
          }}
        >
          Dear {to},
        </p>
        <div
          style={{
            margin: '12px 0',
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `2px solid ${c.accent}`,
            borderRadius: '0 3px 3px 0',
          }}
        >
          <p
            style={{ margin: 0, fontSize: 12, lineHeight: 1.9, color: c.text }}
            dangerouslySetInnerHTML={{ __html: msgHTML }}
          />
        </div>
        <p
          style={{
            margin: '10px 0 0',
            fontSize: 11,
            color: c.dim,
            textAlign: 'right',
            fontStyle: 'italic',
          }}
        >
          — {from}
        </p>
      </div>
      <div
        style={{
          padding: '10px 24px 16px',
          textAlign: 'center',
          borderTop: `1px solid ${c.border}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 8,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: c.dim,
            fontFamily: 'monospace',
          }}
        >
          timecapsula.website · sealed with care
        </p>
      </div>
    </div>
  )
}

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;500&family=JetBrains+Mono:wght@300;400&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{--midnight:#080c14;--cosmos:#0d1525;--amber:#e8a84c;--gold:#f5c842;--parchment:#f2e8d5;--parchment-dim:#c8b898;--ink:#1a1005;}
  body{font-family:'Lora',serif;background:var(--midnight);color:var(--parchment);min-height:100vh;}
  nav{padding:1.1rem 2.5rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(232,168,76,0.1);background:rgba(8,12,20,0.95);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);}
  .logo{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--amber);text-decoration:none;}
  .logo em{font-style:italic;color:var(--gold);}
  .nav-right{display:flex;align-items:center;gap:1rem;}
  .counter{font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--parchment-dim);background:rgba(232,168,76,0.06);border:1px solid rgba(232,168,76,0.15);padding:0.3rem 0.7rem;border-radius:2px;letter-spacing:0.05em;}
  .counter span{color:var(--amber);}
  .btn-back{font-family:'JetBrains Mono',monospace;font-size:0.7rem;letter-spacing:0.1em;color:var(--parchment-dim);text-decoration:none;transition:color 0.2s;}
  .btn-back:hover{color:var(--amber);}
  .wrap{max-width:1200px;margin:0 auto;padding:2.5rem 2rem;}
  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--amber);margin-bottom:0.6rem;}
  .h1{font-family:'Playfair Display',serif;font-size:2rem;color:var(--parchment);margin-bottom:2rem;line-height:1.2;}
  .h1 em{font-style:italic;color:var(--amber);}
  .tmpl-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0.75rem;margin-bottom:2.5rem;}
  @media(max-width:900px){.tmpl-grid{grid-template-columns:repeat(3,1fr);}}
  @media(max-width:600px){.tmpl-grid{grid-template-columns:repeat(2,1fr);}}
  .tmpl{border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.2s;position:relative;}
  .tmpl.sel{border-color:var(--amber);box-shadow:0 0 20px rgba(232,168,76,0.3);}
  .tmpl:hover{transform:translateY(-3px);border-color:rgba(232,168,76,0.3);}
  .tmpl-preview{height:80px;padding:10px 12px;display:flex;flex-direction:column;justify-content:space-between;}
  .tmpl-bar{height:3px;border-radius:2px;width:55%;}
  .tmpl-lines{display:flex;flex-direction:column;gap:3px;}
  .tmpl-line{height:2px;border-radius:1px;opacity:0.45;}
  .tmpl-meta{padding:8px 10px;}
  .tmpl-name{font-family:'Playfair Display',serif;font-size:0.72rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .tmpl-tag{font-family:'JetBrains Mono',monospace;font-size:0.52rem;letter-spacing:0.05em;margin-top:2px;opacity:0.7;}
  .tmpl-lock{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:rgba(0,0,0,0.6);backdrop-filter:blur(1px);}
  .tmpl-lock-icon{font-size:1rem;}
  .tmpl-lock-price{font-family:'JetBrains Mono',monospace;font-size:0.5rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--amber);background:rgba(232,168,76,0.15);border:1px solid rgba(232,168,76,0.3);padding:2px 8px;border-radius:2px;}
  .write-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;}
  @media(max-width:900px){.write-grid{grid-template-columns:1fr;}}
  .preview-sticky{position:sticky;top:80px;}
  .preview-label{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--amber);margin-bottom:0.6rem;display:flex;align-items:center;gap:0.5rem;}
  .preview-label::after{content:'';flex:1;height:1px;background:rgba(232,168,76,0.15);}
  .preview-live{font-size:0.55rem;color:rgba(232,168,76,0.5);}
  .form-group{margin-bottom:1.1rem;}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.1rem;}
  @media(max-width:600px){.form-row{grid-template-columns:1fr;}}
  .lbl{display:block;font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--amber);margin-bottom:0.45rem;}
  .lbl span{color:var(--parchment-dim);text-transform:none;letter-spacing:0;}
  .inp,.ta,.sel{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(232,168,76,0.15);border-radius:2px;padding:0.8rem 0.9rem;color:var(--parchment);font-family:'Lora',serif;font-size:0.92rem;outline:none;transition:border-color 0.2s;}
  .inp:focus,.ta:focus,.sel:focus{border-color:var(--amber);background:rgba(232,168,76,0.03);}
  .inp::placeholder,.ta::placeholder{color:rgba(200,184,152,0.35);font-style:italic;}
  .ta{resize:vertical;min-height:190px;line-height:1.8;}
  .sel{cursor:pointer;}
  input[type="date"].inp{color-scheme:dark;cursor:pointer;}
  input[type="date"].inp::-webkit-calendar-picker-indicator{filter:invert(0.7) sepia(1) saturate(3) hue-rotate(5deg);cursor:pointer;}
  .char-count{font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:var(--parchment-dim);text-align:right;margin-top:0.25rem;}
  .delivery-info{background:rgba(232,168,76,0.06);border:1px solid rgba(232,168,76,0.15);border-radius:2px;padding:0.75rem 1rem;margin-bottom:1rem;font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--parchment-dim);letter-spacing:0.04em;}
  .delivery-info strong{color:var(--amber);}
  .btn-submit{background:var(--amber);color:var(--ink);border:none;padding:1rem;width:100%;font-family:'Lora',serif;font-size:1rem;cursor:pointer;border-radius:2px;transition:all 0.2s;margin-top:0.5rem;}
  .btn-submit:hover{background:var(--gold);}
  .btn-submit:disabled{opacity:0.6;cursor:not-allowed;}
  .submit-note{font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:rgba(200,184,152,0.35);text-align:center;margin-top:0.6rem;letter-spacing:0.04em;}
  .warn{background:rgba(232,168,76,0.06);border:1px solid rgba(232,168,76,0.2);border-radius:4px;padding:0.85rem 1.1rem;margin-bottom:1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:var(--amber);letter-spacing:0.05em;}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(4px);animation:fadein 0.2s;}
  @keyframes fadein{from{opacity:0}to{opacity:1}}
  .modal{background:var(--cosmos);border:1px solid rgba(232,168,76,0.2);border-radius:6px;max-width:500px;width:100%;overflow:hidden;animation:slideup 0.2s;}
  @keyframes slideup{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
  .modal-body{padding:1.75rem 2rem 2rem;}
  .modal-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;}
  .modal-scenario{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--amber);}
  .modal-close{background:transparent;border:none;color:var(--parchment-dim);cursor:pointer;font-size:1.1rem;line-height:1;}
  .modal-title{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--parchment);margin-bottom:0.5rem;}
  .modal-desc{color:var(--parchment-dim);font-size:0.85rem;line-height:1.7;font-style:italic;margin-bottom:1.5rem;}
  .price-options{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.25rem;}
  .price-opt{border:1px solid rgba(232,168,76,0.2);border-radius:4px;padding:1rem;text-align:center;cursor:pointer;transition:all 0.2s;}
  .price-opt:hover{border-color:var(--amber);background:rgba(232,168,76,0.05);}
  .price-opt-amount{font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--amber);margin-bottom:0.25rem;}
  .price-opt-desc{font-family:'JetBrains Mono',monospace;font-size:0.58rem;color:var(--parchment-dim);letter-spacing:0.05em;line-height:1.5;}
  .modal-note{font-family:'JetBrains Mono',monospace;font-size:0.58rem;color:rgba(200,184,152,0.3);text-align:center;letter-spacing:0.05em;}
  .success{text-align:center;max-width:520px;margin:0 auto;padding:4rem 2rem;}
  .success-icon{font-size:3rem;margin-bottom:1.25rem;animation:float 4s ease-in-out infinite;}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .success-title{font-family:'Playfair Display',serif;font-size:2rem;color:var(--parchment);margin-bottom:0.75rem;}
  .success-title em{color:var(--amber);font-style:italic;}
  .success-desc{color:var(--parchment-dim);line-height:1.8;margin-bottom:2rem;font-style:italic;}
  .success-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
  .btn-ghost{background:transparent;color:var(--parchment-dim);border:1px solid rgba(232,168,76,0.2);padding:0.75rem 1.75rem;font-family:'Lora',serif;font-size:0.9rem;cursor:pointer;border-radius:2px;transition:all 0.2s;text-decoration:none;display:inline-block;}
  .btn-ghost:hover{border-color:var(--amber);color:var(--amber);}
  .center{min-height:80vh;display:flex;align-items:center;justify-content:center;}
  .loading-text{font-family:'JetBrains Mono',monospace;font-size:0.8rem;color:var(--amber);letter-spacing:0.2em;animation:pulse 1.5s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
  .divider{height:1px;background:linear-gradient(to right,transparent,rgba(232,168,76,0.15),transparent);margin:2rem 0;}
  .toast{position:fixed;bottom:2rem;right:2rem;background:var(--cosmos);border:1px solid rgba(232,168,76,0.3);border-radius:4px;padding:0.9rem 1.4rem;font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:var(--parchment);z-index:999;animation:slideup 0.3s ease;}
  .toast-err{border-color:rgba(232,124,124,0.4);color:#e87c7c;}
`

export default function WriteCapsule() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [capsuleCount, setCapsuleCount] = useState(0)
  const [selectedId, setSelectedId] = useState('future-self')
  const [lockedPreview, setLockedPreview] = useState(null)
  const [form, setForm] = useState({
    to: '',
    toEmail: '',
    from: '',
    subject: '',
    message: '',
    when: '1m',
    customDate: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [toast, setToast] = useState(null)

  const supabase = createClient()
  const timeOptions = TIME_OPTIONS[USER_TIER]
  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) || TEMPLATES[0]
  const atLimit = capsuleCount >= FREE_CAPSULE_LIMIT
  const remaining = FREE_CAPSULE_LIMIT - capsuleCount

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

  const toast_ = (msg, err = false) => {
    setToast({ msg, err })
    setTimeout(() => setToast(null), 3500)
  }
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const deliverAt = (() => {
    const now = new Date()
    const t = new Date(now)
    const w = form.when
    if (!w) return null
    if (w === 'custom') return form.customDate ? new Date(form.customDate) : null
    if (w === '1w') {
      t.setDate(now.getDate() + 7)
      return t
    }
    if (w === '1m') {
      t.setMonth(now.getMonth() + 1)
      return t
    }
    if (w === '3m') {
      t.setMonth(now.getMonth() + 3)
      return t
    }
    if (w === '6m') {
      t.setMonth(now.getMonth() + 6)
      return t
    }
    const ym = { '1y': 1, '2y': 2, '3y': 3, '5y': 5, '10y': 10, '25y': 25, '30y': 30, '50y': 50 }
    if (ym[w]) {
      t.setFullYear(now.getFullYear() + ym[w])
      return t
    }
    return null
  })()
  const daysUntil = deliverAt ? Math.ceil((deliverAt - new Date()) / 86400000) : null

  const handleSubmit = async () => {
    if (!form.to || !form.toEmail || !form.message) {
      toast_('Fill in recipient, email, and message.', true)
      return
    }
    if (!form.when) {
      toast_('Choose a delivery time.', true)
      return
    }
    if (atLimit) {
      toast_("You've reached the 10 capsule limit.", true)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, template: selectedId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast_(data.error || 'Something went wrong.', true)
        return
      }
      setSuccess({ deliverAt: data.deliverAt, to: form.to })
    } catch (_err) {
      toast_('Network error. Try again.', true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <>
        <style>{S}</style>
        <div className="center">
          <p className="loading-text">✦ &nbsp; loading &nbsp; ✦</p>
        </div>
      </>
    )
  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    return (
      <>
        <style>{S}</style>
        <div className="center">
          <p className="loading-text">✦ &nbsp; redirecting &nbsp; ✦</p>
        </div>
      </>
    )
  }

  if (success) {
    const dateStr = new Date(success.deliverAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return (
      <>
        <style>{S}</style>
        <nav>
          <a className="logo" href="/dashboard">
            Time<em>Capsula</em>
          </a>
        </nav>
        <div className="center">
          <div className="success">
            <div className="success-icon">📬</div>
            <h2 className="success-title">
              Capsule <em>sealed.</em>
            </h2>
            <p className="success-desc">
              Your message to <strong style={{ color: 'var(--amber)' }}>{success.to}</strong> is
              locked away.
              <br />
              <br />
              Delivers on <strong style={{ color: 'var(--amber)' }}>{dateStr}</strong>.
            </p>
            <div className="success-btns">
              <button
                className="btn-submit"
                style={{ width: 'auto', padding: '0.8rem 2rem' }}
                onClick={() => {
                  setForm({
                    to: '',
                    toEmail: '',
                    from: '',
                    subject: '',
                    message: '',
                    when: '1m',
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

  return (
    <>
      <style>{S}</style>
      {toast && <div className={`toast ${toast.err ? 'toast-err' : ''}`}>{toast.msg}</div>}

      {lockedPreview && (
        <div
          className="modal-overlay"
          onClick={e => e.target === e.currentTarget && setLockedPreview(null)}
        >
          <div className="modal">
            <EmailPreview
              template={lockedPreview}
              form={{
                to: 'Future You',
                from: 'Present You',
                subject: lockedPreview.name,
                message: lockedPreview.preview_text,
                toEmail: '',
              }}
            />
            <div className="modal-body">
              <div className="modal-top">
                <div>
                  <p className="modal-scenario">{lockedPreview.scenario}</p>
                  <h3 className="modal-title">{lockedPreview.name}</h3>
                </div>
                <button className="modal-close" onClick={() => setLockedPreview(null)}>
                  ✕
                </button>
              </div>
              <p className="modal-desc">{lockedPreview.desc}</p>
              <div className="price-options">
                <div className="price-opt">
                  <div className="price-opt-amount">$5</div>
                  <div className="price-opt-desc">
                    Own forever
                    <br />
                    Unlimited uses
                  </div>
                </div>
                <div className="price-opt">
                  <div className="price-opt-amount">$1</div>
                  <div className="price-opt-desc">
                    5 uses
                    <br />
                    Try before owning
                  </div>
                </div>
              </div>
              <p className="modal-note">✦ Payment coming soon — join waitlist for early access</p>
            </div>
          </div>
        </div>
      )}

      <nav>
        <a className="logo" href="/dashboard">
          Time<em>Capsula</em>
        </a>
        <div className="nav-right">
          <span className="counter">
            <span>{capsuleCount}</span> / {FREE_CAPSULE_LIMIT} capsules
          </span>
          <a href="/dashboard" className="btn-back">
            ← Dashboard
          </a>
        </div>
      </nav>

      <div className="wrap">
        <p className="eyebrow">✦ New capsule</p>
        <h1 className="h1">
          Choose your <em>template.</em>
        </h1>
        {atLimit && (
          <div className="warn">
            ⚠ You've used all {FREE_CAPSULE_LIMIT} free capsules. Upgrade for unlimited.
          </div>
        )}
        {!atLimit && remaining <= 3 && (
          <div className="warn">
            ✦ {remaining} capsule{remaining !== 1 ? 's' : ''} remaining on your free plan.
          </div>
        )}

        <div className="tmpl-grid">
          {TEMPLATES.map(tmpl => {
            const locked = tmpl.tier === 'premium'
            const sel = selectedId === tmpl.id
            const c = tmpl.colors
            return (
              <div
                key={tmpl.id}
                className={`tmpl ${sel ? 'sel' : ''}`}
                style={{ background: c.bg }}
                onClick={() => (locked ? setLockedPreview(tmpl) : setSelectedId(tmpl.id))}
                title={locked ? `${tmpl.name} — Click to preview & unlock` : tmpl.name}
              >
                <div className="tmpl-preview" style={{ background: c.bg }}>
                  <div className="tmpl-bar" style={{ background: c.accent }} />
                  <div className="tmpl-lines">
                    {['80%', '65%', '75%'].map((w, i) => (
                      <div key={i} className="tmpl-line" style={{ background: c.text, width: w }} />
                    ))}
                  </div>
                </div>
                <div className="tmpl-meta" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="tmpl-name" style={{ color: c.text }}>
                    {tmpl.name}
                  </div>
                  <div className="tmpl-tag" style={{ color: c.accent }}>
                    {tmpl.scenario}
                  </div>
                </div>
                {locked && (
                  <div className="tmpl-lock">
                    <span className="tmpl-lock-icon">🔒</span>
                    <span className="tmpl-lock-price">$5 forever · $1/5 uses</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="divider" />

        <div className="write-grid">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.25rem' }}>
              ✦ Write your message
            </p>
            <div className="form-row">
              <div>
                <label className="lbl">To *</label>
                <input
                  className="inp"
                  type="text"
                  placeholder="My daughter Sofia..."
                  value={form.to}
                  onChange={set('to')}
                />
              </div>
              <div>
                <label className="lbl">Their email *</label>
                <input
                  className="inp"
                  type="email"
                  placeholder="sofia@example.com"
                  value={form.toEmail}
                  onChange={set('toEmail')}
                />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label className="lbl">
                  From <span>(optional)</span>
                </label>
                <input
                  className="inp"
                  type="text"
                  placeholder="Your name or nickname"
                  value={form.from}
                  onChange={set('from')}
                />
              </div>
              <div>
                <label className="lbl">
                  Subject <span>(optional)</span>
                </label>
                <input
                  className="inp"
                  type="text"
                  placeholder="For when you're ready..."
                  value={form.subject}
                  onChange={set('subject')}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="lbl">Your message *</label>
              <textarea
                className="ta"
                value={form.message}
                onChange={set('message')}
                maxLength={5000}
                placeholder={selectedTemplate.preview_text}
              />
              <div className="char-count">{form.message.length} / 5000</div>
            </div>
            <div className="form-row">
              <div>
                <label className="lbl">Deliver in *</label>
                <select className="sel" value={form.when} onChange={set('when')}>
                  <option value="">Choose a time...</option>
                  {timeOptions.map(o => (
                    <option key={o.v} value={o.v}>
                      {o.label} from now
                    </option>
                  ))}
                </select>
              </div>
              {form.when === 'custom' && (
                <div>
                  <label className="lbl">Date *</label>
                  <input
                    className="inp"
                    type="date"
                    value={form.customDate}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    onChange={set('customDate')}
                  />
                </div>
              )}
            </div>
            {daysUntil && (
              <div className="delivery-info">
                ✦ Sealed for <strong>{daysUntil.toLocaleString()} days</strong> — delivers{' '}
                {deliverAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}
            <button className="btn-submit" onClick={handleSubmit} disabled={submitting || atLimit}>
              {submitting ? '✦ Sealing...' : '✦ Seal & Send Into Time'}
            </button>
            <p className="submit-note">
              {capsuleCount} of {FREE_CAPSULE_LIMIT} free capsules used
            </p>
          </div>

          <div>
            <div className="preview-sticky">
              <p className="preview-label">
                Live email preview <span className="preview-live">● LIVE</span>
              </p>
              <EmailPreview template={selectedTemplate} form={form} />
              <p
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: '0.55rem',
                  color: 'rgba(200,184,152,0.25)',
                  marginTop: '0.6rem',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                }}
              >
                EXACTLY HOW IT WILL LOOK IN THE RECIPIENT'S INBOX
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
