'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Stars from './Stars'

const styles = `
  html { scroll-behavior: smooth; }

  /* NAV */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 1.2rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, rgba(8,12,20,0.95), transparent);
  }
  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--amber);
    letter-spacing: 0.05em;
  }
  .logo span { font-style: italic; color: var(--gold); }
  nav a {
    color: var(--parchment-dim);
    text-decoration: none;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.2s;
    font-family: 'JetBrains Mono', monospace;
  }
  nav a:hover { color: var(--amber); }
  .nav-links { display: flex; gap: 2rem; align-items: center; }
  .nav-cta {
    background: var(--amber);
    color: var(--ink) !important;
    padding: 0.5rem 1.2rem;
    border-radius: 2px;
    font-weight: 500;
  }
  .nav-cta:hover { background: var(--gold) !important; color: var(--ink) !important; }

  /* HERO */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6rem 2rem 4rem;
    z-index: 1;
  }

  .hero-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 2rem;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.3s;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.5rem, 8vw, 7rem);
    line-height: 1.05;
    font-weight: 700;
    color: var(--parchment);
    margin-bottom: 1.5rem;
    opacity: 0;
    animation: fadeUp 0.9s ease forwards 0.5s;
  }
  .hero-title em {
    font-style: italic;
    color: var(--amber);
  }

  .hero-subtitle {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: var(--parchment-dim);
    max-width: 540px;
    line-height: 1.8;
    margin-bottom: 3rem;
    opacity: 0;
    animation: fadeUp 1s ease forwards 0.7s;
  }

  .hero-cta-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    opacity: 0;
    animation: fadeUp 1s ease forwards 0.9s;
  }

  .btn-primary {
    background: var(--amber);
    color: var(--ink);
    border: none;
    padding: 1rem 2.5rem;
    font-family: 'Lora', serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 2px;
    letter-spacing: 0.05em;
    transition: all 0.2s;
    box-shadow: 0 0 30px rgba(232,168,76,0.3);
  }
  .btn-primary:hover {
    background: var(--gold);
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(245,200,66,0.4);
  }

  .btn-ghost {
    background: transparent;
    color: var(--parchment-dim);
    border: 1px solid rgba(242,232,213,0.2);
    padding: 1rem 2rem;
    font-family: 'Lora', serif;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 2px;
    letter-spacing: 0.05em;
    transition: all 0.2s;
  }
  .btn-ghost:hover {
    border-color: var(--amber);
    color: var(--amber);
  }

  /* FLOATING ENVELOPE */
  .envelope-hero {
    margin-top: 4rem;
    opacity: 0;
    animation: fadeUp 1s ease forwards 1.1s, float 6s ease-in-out infinite 2s;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }

  /* GLOW ORBS */
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(232,168,76,0.12), transparent 70%);
    top: 10%; left: 50%;
    transform: translateX(-50%);
  }
  .orb-2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(100,150,255,0.08), transparent 70%);
    bottom: 20%; right: 10%;
  }

  /* TIMELINE SECTION */
  .section {
    position: relative;
    z-index: 1;
    padding: 8rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 1rem;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1.15;
    margin-bottom: 4rem;
    color: var(--parchment);
  }
  .section-title em { font-style: italic; color: var(--amber); }

  /* HOW IT WORKS */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .step-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(232,168,76,0.1);
    border-radius: 4px;
    padding: 2.5rem;
    position: relative;
    transition: all 0.3s;
    overflow: hidden;
  }
  .step-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(232,168,76,0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .step-card:hover { border-color: rgba(232,168,76,0.3); transform: translateY(-4px); }
  .step-card:hover::before { opacity: 1; }

  .step-num {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    font-weight: 700;
    color: rgba(232,168,76,0.1);
    line-height: 1;
    margin-bottom: 1rem;
  }
  .step-icon { font-size: 2rem; margin-bottom: 1rem; }
  .step-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--parchment);
    margin-bottom: 0.75rem;
  }
  .step-desc { color: var(--parchment-dim); line-height: 1.7; font-size: 0.95rem; }

  /* USE CASES */
  .use-cases {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .use-case {
    padding: 2rem;
    border-left: 2px solid rgba(232,168,76,0.3);
    background: rgba(255,255,255,0.02);
    border-radius: 0 4px 4px 0;
    transition: all 0.3s;
  }
  .use-case:hover { border-left-color: var(--amber); background: rgba(232,168,76,0.05); }
  .use-case-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: var(--amber);
    margin-bottom: 0.5rem;
  }
  .use-case p { color: var(--parchment-dim); font-size: 0.9rem; line-height: 1.6; font-style: italic; }

  /* PRICING */
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .price-card {
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 4px;
    padding: 2.5rem;
    position: relative;
    transition: all 0.3s;
  }
  .price-card.featured {
    border-color: var(--amber);
    background: rgba(232,168,76,0.05);
  }
  .price-card.featured::after {
    content: 'MOST POPULAR';
    position: absolute;
    top: -12px; left: 50%;
    transform: translateX(-50%);
    background: var(--amber);
    color: var(--ink);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    padding: 3px 12px;
    border-radius: 2px;
  }
  .price-tier {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 1rem;
  }
  .price-amount {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-weight: 700;
    color: var(--parchment);
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  .price-amount span { font-size: 1rem; color: var(--parchment-dim); }
  .price-desc { color: var(--parchment-dim); font-size: 0.85rem; margin-bottom: 2rem; }
  .price-features { list-style: none; margin-bottom: 2rem; }
  .price-features li {
    padding: 0.4rem 0;
    font-size: 0.9rem;
    color: var(--parchment-dim);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .price-features li::before { content: '✦'; color: var(--amber); font-size: 0.6rem; }

  /* WRITE CAPSULE FORM */
  .write-section {
    background: var(--cosmos);
    border-top: 1px solid rgba(232,168,76,0.1);
    border-bottom: 1px solid rgba(232,168,76,0.1);
  }

  .capsule-form {
    max-width: 760px;
    margin: 0 auto;
  }

  .form-group { margin-bottom: 1.5rem; }
  .form-label {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 0.6rem;
  }
  .form-input, .form-textarea, .form-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(232,168,76,0.15);
    border-radius: 2px;
    padding: 0.9rem 1.2rem;
    color: var(--parchment);
    font-family: 'Lora', serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus {
    border-color: var(--amber);
    background: rgba(232,168,76,0.04);
  }
  .form-input::placeholder, .form-textarea::placeholder {
    color: rgba(200,184,152,0.4);
    font-style: italic;
  }
  .form-textarea { min-height: 280px; resize: vertical; line-height: 1.8; }
  .form-select { cursor: pointer; }
  input[type="date"].form-input { color-scheme: dark; cursor: pointer; }
  input[type="date"].form-input::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(3) hue-rotate(5deg); cursor: pointer; }
  .form-select option { background: var(--cosmos); }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

  .char-count {
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--parchment-dim);
    margin-top: 0.3rem;
  }

  .delivery-preview {
    background: rgba(232,168,76,0.06);
    border: 1px solid rgba(232,168,76,0.2);
    border-radius: 4px;
    padding: 1.5rem;
    margin: 2rem 0;
    text-align: center;
  }
  .delivery-preview p {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    color: var(--parchment-dim);
    font-size: 0.95rem;
  }
  .delivery-preview strong { color: var(--amber); }

  /* SUCCESS STATE */
  .success-screen {
    text-align: center;
    padding: 4rem 2rem;
  }
  .success-icon { font-size: 4rem; margin-bottom: 1.5rem; animation: float 4s ease-in-out infinite; }
  .success-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: var(--amber);
    margin-bottom: 1rem;
  }
  .success-desc { color: var(--parchment-dim); line-height: 1.8; max-width: 480px; margin: 0 auto 2rem; }

  /* COUNTER BANNER */
  .counter-banner {
    position: relative; z-index: 1;
    background: linear-gradient(135deg, rgba(232,168,76,0.06), rgba(232,168,76,0.02));
    border-top: 1px solid rgba(232,168,76,0.1);
    border-bottom: 1px solid rgba(232,168,76,0.1);
    padding: 3rem 2rem; text-align: center;
  }
  .counter-row { display: flex; justify-content: center; gap: 5rem; flex-wrap: wrap; }
  .counter-item { text-align: center; }
  .counter-num { font-family: 'Playfair Display', serif; font-size: 3.5rem; color: var(--amber); line-height: 1; font-weight: 700; }
  .counter-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--parchment-dim); margin-top: 0.4rem; }

  /* TESTIMONIALS */
  .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
  @media(max-width:780px){ .testimonials-grid { grid-template-columns: 1fr; } }
  .testimonial-card {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(232,168,76,0.1);
    border-radius: 4px; padding: 2rem; transition: all 0.3s;
  }
  .testimonial-card:hover { border-color: rgba(232,168,76,0.25); transform: translateY(-4px); }
  .testimonial-quote { font-size: 1.5rem; color: rgba(232,168,76,0.3); margin-bottom: 1rem; line-height: 1; }
  .testimonial-text { font-size: 0.95rem; color: var(--parchment-dim); line-height: 1.8; font-style: italic; margin-bottom: 1.5rem; }
  .testimonial-author { display: flex; align-items: center; gap: 0.75rem; }
  .testimonial-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, rgba(232,168,76,0.3), rgba(232,168,76,0.1)); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
  .testimonial-name { font-family: 'Playfair Display', serif; font-size: 0.9rem; color: var(--parchment); }
  .testimonial-handle { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: rgba(200,184,152,0.4); }

  /* FAQ */
  .faq-list { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 0; }
  .faq-item { border-bottom: 1px solid rgba(255,255,255,0.06); }
  .faq-question {
    width: 100%; background: transparent; border: none; text-align: left;
    padding: 1.5rem 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem;
    font-family: 'Lora', serif; font-size: 1rem; color: var(--parchment); transition: color 0.2s;
  }
  .faq-question:hover { color: var(--amber); }
  .faq-icon { font-family: 'JetBrains Mono', monospace; color: var(--amber); font-size: 1.2rem; transition: transform 0.3s; flex-shrink: 0; }
  .faq-icon.open { transform: rotate(45deg); }
  .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.2s; }
  .faq-answer.open { max-height: 300px; padding-bottom: 1.5rem; }
  .faq-answer p { color: var(--parchment-dim); font-size: 0.95rem; line-height: 1.8; font-style: italic; }

  /* FOOTER */
  footer {
    position: relative;
    z-index: 1;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: var(--amber);
  }
  .footer-note {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--parchment-dim);
    letter-spacing: 0.1em;
  }

  /* DIVIDER */
  .cosmic-divider {
    text-align: center;
    padding: 2rem;
    color: rgba(232,168,76,0.3);
    font-size: 1.2rem;
    letter-spacing: 1rem;
    position: relative;
    z-index: 1;
  }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* SCROLL REVEAL */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--nebula);
    border: 1px solid var(--amber);
    color: var(--parchment);
    padding: 1rem 1.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 320px;
  }
  @keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* ACTIVE NAV */
  .nav-active { color: var(--amber) !important; }

  /* ── MOBILE NAV ── */
  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; z-index: 110; }
  .hamburger span { display: block; width: 22px; height: 2px; background: var(--parchment-dim); border-radius: 2px; transition: all 0.3s; }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  @media (max-width: 720px) {
    nav { padding: 1rem 1.2rem; }
    .hamburger { display: flex; }
    .nav-links {
      display: none;
      position: fixed;
      inset: 0;
      top: 56px;
      background: rgba(8,12,20,0.98);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      z-index: 105;
      backdrop-filter: blur(16px);
    }
    .nav-links.nav-open { display: flex; }
    .nav-links a { font-size: 1.1rem; letter-spacing: 0.2em; }
    .nav-cta { padding: 0.75rem 2rem; }
  }

  /* ── GENERAL MOBILE ── */
  @media (max-width: 720px) {
    .section { padding: 5rem 1.2rem; }
    .hero { padding: 5rem 1.2rem 3rem; }
    .hero-cta-group { flex-direction: column; align-items: center; }
    .hero-cta-group .btn-primary, .hero-cta-group .btn-ghost { width: 100%; max-width: 280px; text-align: center; }
    .envelope-hero svg { width: 160px !important; height: auto !important; }
    .counter-row { gap: 2rem; }
    .counter-num { font-size: 2.5rem; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr; }
    .use-cases { grid-template-columns: 1fr; }
    footer { flex-direction: column; text-align: center; padding: 2rem 1.2rem; gap: 0.5rem; }
    .section-title { font-size: clamp(1.6rem, 6vw, 2.5rem); }
  }

  @media (max-width: 480px) {
    .hero-title { font-size: clamp(2.4rem, 9vw, 4rem); }
    .counter-row { gap: 1.5rem; }
    .counter-num { font-size: 2rem; }
    .counter-label { font-size: 0.55rem; }
    .price-card { padding: 1.75rem; }
    .step-card { padding: 1.75rem; }
  }

  /* ── GUEST PREVIEW ── */
  .guest-preview-wrap { margin-top: 2.5rem; }
  .guest-preview-label { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--amber); margin-bottom: 0.65rem; opacity: 0.8; }
  .guest-preview-note { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; color: rgba(200,184,152,0.3); text-align: center; margin-top: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; }

  /* ── PRICING COMING SOON ── */
  .price-card.coming-soon { opacity: 0.7; position: relative; }
  .coming-soon-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: rgba(232,168,76,0.15); color: var(--amber);
    border: 1px solid rgba(232,168,76,0.4);
    font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em;
    padding: 3px 12px; border-radius: 2px; white-space: nowrap;
  }
  .price-features li.locked-feat { opacity: 0.45; }
  .price-features li.locked-feat::before { content: '🔒'; font-size: 0.55rem; }
`

// Inline email preview for guest form
function GuestEmailPreview({ form }) {
  const accent = '#e8a84c'
  const bg = '#080c14'
  const border = 'rgba(232,168,76,0.2)'
  const text = '#f2e8d5'
  const dim = '#c8b898'
  const to = form.to || 'Recipient'
  const from = form.from || 'Someone who cares'
  const subject = form.subject || 'A message from the past'
  const message = form.message || 'Your message will appear here as you write above...'
  const msgHTML = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
  return (
    <div
      style={{
        background: bg,
        borderRadius: 6,
        overflow: 'hidden',
        border: `1px solid ${border}`,
        fontFamily: 'Georgia,serif',
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
          To: {form.toEmail || 'recipient@email.com'} · {subject}
        </span>
      </div>
      <div
        style={{
          background: 'linear-gradient(135deg,#0d1525,#111d35)',
          padding: '20px 22px 14px',
          textAlign: 'center',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <p
          style={{
            margin: '0 0 6px',
            fontFamily: 'monospace',
            fontSize: 8,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: accent,
          }}
        >
          ✦ Time Capsula ✦
        </p>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: text, lineHeight: 1.3 }}>
          {subject}
        </p>
      </div>
      <div style={{ padding: '18px 22px' }}>
        <p
          style={{
            margin: '0 0 3px',
            fontSize: 8,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: accent,
            fontFamily: 'monospace',
          }}
        >
          Dear {to},
        </p>
        <div
          style={{
            margin: '10px 0',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `2px solid ${accent}`,
            borderRadius: '0 3px 3px 0',
          }}
        >
          <p
            style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: text }}
            dangerouslySetInnerHTML={{ __html: msgHTML }}
          />
        </div>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 12,
            color: dim,
            textAlign: 'right',
            fontStyle: 'italic',
          }}
        >
          — {from}
        </p>
      </div>
      <div
        style={{ padding: '8px 22px 14px', textAlign: 'center', borderTop: `1px solid ${border}` }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 8,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: dim,
            fontFamily: 'monospace',
          }}
        >
          timecapsula.website · words sealed with care
        </p>
      </div>
    </div>
  )
}

// Envelope SVG
function EnvelopeSVG({ size = 220 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 220 154" fill="none">
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
      <path d="M2 12 L110 80 L218 12" stroke="rgba(232,168,76,0.5)" strokeWidth="1.5" fill="none" />
      <path d="M2 152 L75 82" stroke="rgba(232,168,76,0.3)" strokeWidth="1" />
      <path d="M218 152 L145 82" stroke="rgba(232,168,76,0.3)" strokeWidth="1" />
      <circle cx="110" cy="77" r="6" fill="rgba(232,168,76,0.6)" />
      <path d="M90 50 Q110 40 130 50" stroke="rgba(232,168,76,0.2)" strokeWidth="1" fill="none" />
      {[...Array(5)].map((_, i) => (
        <line
          key={i}
          x1="70"
          y1={100 + i * 8}
          x2="150"
          y2={100 + i * 8}
          stroke="rgba(242,232,213,0.1)"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

// Scroll reveal hook
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('visible')
        }),
      { threshold: 0.15 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// Delivery date helper
function getDeliveryText(when, customDate) {
  if (!when) return null
  const now = new Date()
  let target = new Date(now)
  if (when === 'custom' && customDate) {
    target = new Date(customDate)
  } else if (when === '1w') {
    target.setDate(now.getDate() + 7)
  } else if (when === '1m') {
    target.setMonth(now.getMonth() + 1)
  } else if (when === '3m') {
    target.setMonth(now.getMonth() + 3)
  } else if (when === '6m') {
    target.setMonth(now.getMonth() + 6)
  } else {
    const map = { '1y': 1, '2y': 2, '3y': 3, '5y': 5, '10y': 10, '25y': 25, '30y': 30, '50y': 50 }
    target.setFullYear(now.getFullYear() + (map[when] || 0))
  }
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  const dateStr = target.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return { dateStr, days: diff }
}

// MAIN APP
const FAQ_ITEMS = [
  {
    q: 'Is TimeCapsula really free?',
    a: 'Yes — completely free, no credit card required. Write as many capsules as you like after signing in. Guests can try with up to 3 capsules.',
  },
  {
    q: 'How long can I schedule into the future?',
    a: "As far as you want — 1 year, 10 years, 25 years, or any custom date. We'll hold the message and deliver it no matter how far away.",
  },
  {
    q: "What if the recipient's email changes?",
    a: 'Email addresses do change over time. We recommend sending capsules to stable addresses (Gmail, etc.) and letting the recipient know to watch for it.',
  },
  {
    q: 'Can I edit or delete a capsule after sending?',
    a: "Yes — log into your dashboard to edit the subject or message, or delete the capsule entirely, as long as it hasn't been delivered yet.",
  },
  {
    q: 'Will the email actually arrive years from now?',
    a: 'Yes. Your capsule is stored securely in our database and our delivery system checks daily. We use Resend, a professional email provider, to ensure deliverability.',
  },
  {
    q: 'What happens if TimeCapsula shuts down?',
    a: "We take this seriously. We're committed to the long-term. If we ever had to close, we'd notify all users well in advance so messages could be exported.",
  },
]

function FaqList() {
  const [open, setOpen] = useState(null)
  return (
    <div className="faq-list">
      {FAQ_ITEMS.map(({ q, a }, i) => (
        <div className="faq-item" key={i}>
          <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
            <span>{q}</span>
            <span className={`faq-icon ${open === i ? 'open' : ''}`}>+</span>
          </button>
          <div className={`faq-answer ${open === i ? 'open' : ''}`}>
            <p>{a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TimeCapsula() {
  const router = useRouter()
  const [view, setView] = useState('home') // home | write | success
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
  const [toast, setToast] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [statsCount, setStatsCount] = useState(0)
  const writeRef = useRef(null)

  useReveal()

  // Fetch real capsule count for the counter banner
  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => {
        if (d.capsules > 0) setStatsCount(d.capsules)
      })
      .catch(() => {})
  }, [])

  const delivery = getDeliveryText(form.when, form.customDate)

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async () => {
    if (!form.to || !form.toEmail || !form.message || !form.when) {
      showToast('Please fill in all required fields ✦')
      return
    }
    if (form.when === 'custom' && !form.customDate) {
      showToast('Please pick a delivery date ✦')
      return
    }
    // Save draft to localStorage before submitting so data is never lost
    try {
      localStorage.setItem(
        'tc_draft',
        JSON.stringify({
          step: 2,
          template: 'cosmic',
          form: { ...form, from: form.from || '', subject: form.subject || '' },
        })
      )
    } catch (_) {
      /* storage unavailable */
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.limitReached) {
          // Guest limit hit — draft saved, nudge them to sign up
          showToast('Guest limit reached. Sign up free — your message is saved! ✦')
          setTimeout(() => {
            router.push('/login')
          }, 2200)
          return
        }
        showToast(data.error || 'Something went wrong. Try again.')
        return
      }
      // Clear draft on success
      try {
        localStorage.removeItem('tc_draft')
      } catch (_) {
        /* storage unavailable */
      }
      setView('success')
    } catch (_err) {
      showToast('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToWrite = () => {
    setView('home')
    setTimeout(() => {
      writeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Force reveal all elements in the write section after navigation
      setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
      }, 150)
    }, 200)
  }

  return (
    <>
      <style>{styles}</style>
      <Stars />

      {/* NAV */}
      <nav>
        <div
          className="logo"
          onClick={() => {
            setView('home')
            setNavOpen(false)
          }}
          style={{ cursor: 'pointer' }}
        >
          Time<span>Capsula</span>
        </div>
        <button
          className={`hamburger ${navOpen ? 'open' : ''}`}
          onClick={() => setNavOpen(o => !o)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-links ${navOpen ? 'nav-open' : ''}`}>
          <a href="#how" onClick={() => setNavOpen(false)}>
            How it works
          </a>
          <a href="#pricing" onClick={() => setNavOpen(false)}>
            Pricing
          </a>
          <a href="/login" style={{ color: 'var(--amber)' }} onClick={() => setNavOpen(false)}>
            Sign In
          </a>
          <a
            href="#write"
            onClick={e => {
              e.preventDefault()
              setNavOpen(false)
              scrollToWrite()
            }}
            className="nav-cta"
          >
            Write a Capsule
          </a>
        </div>
      </nav>

      {view === 'success' ? (
        // SUCCESS SCREEN
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="success-screen">
            <div className="success-icon">📬</div>
            <h2 className="success-title">Your capsule is sealed.</h2>
            <p className="success-desc">
              Your message to <strong style={{ color: 'var(--amber)' }}>{form.to}</strong> has been
              locked away in time. It will be delivered on{' '}
              <strong style={{ color: 'var(--amber)' }}>{delivery?.dateStr}</strong> —{' '}
              {delivery?.days?.toLocaleString()} days from now.
            </p>
            <p
              style={{
                color: 'rgba(200,184,152,0.5)',
                fontSize: '0.85rem',
                fontStyle: 'italic',
                marginBottom: '2.5rem',
              }}
            >
              A confirmation has been sent to {form.toEmail}
            </p>
            <div
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <button
                className="btn-primary"
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
                  setView('home')
                  scrollToWrite()
                }}
              >
                Write Another
              </button>
              <button className="btn-ghost" onClick={() => setView('home')}>
                Back Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* HERO */}
          <section className="hero" id="home">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <p className="hero-eyebrow">✦ Send a message across time ✦</p>
            <h1 className="hero-title">
              Words that wait
              <br />
              for the <em>right moment.</em>
            </h1>
            <p className="hero-subtitle">
              Write a letter, record a memory, or leave a gift — and let it arrive exactly when it
              matters most.
            </p>
            <div className="hero-cta-group">
              <button className="btn-primary" onClick={scrollToWrite}>
                Write Your First Capsule
              </button>
              <button
                className="btn-ghost"
                onClick={() =>
                  document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                See How It Works
              </button>
            </div>
            <div className="envelope-hero">
              <EnvelopeSVG size={260} />
            </div>
          </section>

          <div className="cosmic-divider">· · · ✦ · · ·</div>

          {/* HOW IT WORKS */}
          <section className="section" id="how">
            <p className="section-label reveal">The ritual</p>
            <h2 className="section-title reveal">
              Three steps.
              <br />
              <em>A lifetime of impact.</em>
            </h2>
            <div className="steps">
              {[
                {
                  num: '01',
                  icon: '✍️',
                  title: 'Write',
                  desc: 'Pour your heart into words. Write to your future self, your children, a friend — or anyone who deserves to receive a piece of you.',
                },
                {
                  num: '02',
                  icon: '⏳',
                  title: 'Seal',
                  desc: 'Choose when your capsule opens — 1 year, 10 years, or a specific date. Your words are locked away until the moment is right.',
                },
                {
                  num: '03',
                  icon: '📬',
                  title: 'Deliver',
                  desc: 'On the chosen day, your capsule travels through time and lands in their inbox — exactly as you wrote it, perfectly timed.',
                },
              ].map(s => (
                <div className="step-card reveal" key={s.num}>
                  <div className="step-num">{s.num}</div>
                  <div className="step-icon">{s.icon}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '6rem' }}>
              <p className="section-label reveal">For every kind of love</p>
              <h2 className="section-title reveal">Who sends a capsule?</h2>
              <div className="use-cases">
                {[
                  {
                    title: 'Parents to children',
                    text: '"Open this on your 18th birthday. I wrote it the night you were born."',
                  },
                  {
                    title: 'Couples in love',
                    text: '"For our 10th anniversary. Ten years ago I knew you were the one."',
                  },
                  {
                    title: 'You, to yourself',
                    text: '"Read this before your next big decision. You already know the answer."',
                  },
                  {
                    title: 'Friends across time',
                    text: '"Wherever life has taken us — I hope you still laugh the same way."',
                  },
                  {
                    title: 'Founders & dreamers',
                    text: '"This is what I believed when I started. I wonder if it came true."',
                  },
                  {
                    title: 'Those leaving legacies',
                    text: '"If you\'re reading this, I am gone. But these words are still mine."',
                  },
                ].map(u => (
                  <div className="use-case reveal" key={u.title}>
                    <h4 className="use-case-title">{u.title}</h4>
                    <p>{u.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="cosmic-divider">· · · ✦ · · ·</div>

          {/* WRITE CAPSULE */}
          <section className="write-section" id="write" ref={writeRef}>
            <div className="section">
              <p className="section-label reveal">Begin</p>
              <h2 className="section-title reveal">Write your capsule.</h2>

              <div className="capsule-form">
                <div className="form-row">
                  <div className="form-group reveal">
                    <label className="form-label">To — who receives this *</label>
                    <input
                      className="form-input"
                      placeholder="My daughter Sofia..."
                      value={form.to}
                      onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                    />
                  </div>
                  <div className="form-group reveal">
                    <label className="form-label">Their email address *</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="sofia@example.com"
                      value={form.toEmail}
                      onChange={e => setForm(f => ({ ...f, toEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group reveal">
                    <label className="form-label">From — your name</label>
                    <input
                      className="form-input"
                      placeholder="Your name or nickname"
                      value={form.from}
                      onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
                    />
                  </div>
                  <div className="form-group reveal">
                    <label className="form-label">Subject / title</label>
                    <input
                      className="form-input"
                      placeholder="For when you're ready..."
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group reveal">
                  <label className="form-label">Your message *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Write as if time doesn't exist. No one will read this until the moment you choose..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    maxLength={5000}
                  />
                  <div className="char-count">{form.message.length} / 5000</div>
                </div>

                <div className="form-row">
                  <div className="form-group reveal">
                    <label className="form-label">Deliver in *</label>
                    <select
                      className="form-select"
                      value={form.when}
                      onChange={e => setForm(f => ({ ...f, when: e.target.value }))}
                    >
                      <option value="">Choose a time...</option>
                      <option value="1w">1 week from now</option>
                      <option value="1m">1 month from now</option>
                      <option value="3m">3 months from now</option>
                      <option value="6m">6 months from now</option>
                    </select>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.65rem',
                        color: 'rgba(200,184,152,0.4)',
                        marginTop: '0.4rem',
                        letterSpacing: '0.04em',
                      }}
                    >
                      ✦{' '}
                      <a
                        href="/login"
                        style={{ color: 'rgba(232,168,76,0.5)', textDecoration: 'underline' }}
                      >
                        Sign up free
                      </a>{' '}
                      to unlock up to 3 years delivery
                    </p>
                  </div>
                  {form.when === 'custom' && (
                    <div className="form-group">
                      <label className="form-label">Delivery date</label>
                      <input
                        className="form-input"
                        type="date"
                        value={form.customDate}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        onChange={e => setForm(f => ({ ...f, customDate: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                {delivery && (
                  <div className="delivery-preview">
                    <p>
                      ✦ This capsule will be sealed for{' '}
                      <strong>{delivery.days?.toLocaleString()} days</strong> and delivered on{' '}
                      <strong>{delivery.dateStr}</strong>
                    </p>
                  </div>
                )}

                <div style={{ textAlign: 'center', paddingTop: '1rem' }} className="reveal">
                  <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      fontSize: '1.1rem',
                      padding: '1.1rem 3rem',
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? '✦ Sealing your capsule...' : '✦ Seal & Send Into Time'}
                  </button>
                  <p
                    style={{
                      color: 'var(--parchment-dim)',
                      fontSize: '0.8rem',
                      marginTop: '1rem',
                      fontStyle: 'italic',
                    }}
                  >
                    Free · No account required for your first capsule ·{' '}
                    <a href="/login" style={{ color: 'var(--amber)', textDecoration: 'underline' }}>
                      Sign in
                    </a>{' '}
                    for unlimited
                  </p>
                </div>

                {/* Live email preview for guests */}
                <div className="guest-preview-wrap reveal">
                  <p className="guest-preview-label">
                    ✦ Live email preview — this is exactly what they'll receive
                  </p>
                  <GuestEmailPreview form={form} />
                  <p className="guest-preview-note">Sign in to unlock 15 beautiful templates</p>
                </div>
              </div>
            </div>
          </section>

          <div className="cosmic-divider">· · · ✦ · · ·</div>

          {/* PRICING */}
          <section className="section" id="pricing">
            <p className="section-label reveal">Simple pricing</p>
            <h2 className="section-title reveal">
              Begin for free.
              <br />
              <em>Grow through time.</em>
            </h2>
            <div className="pricing-grid">
              {[
                {
                  tier: 'Guest',
                  amount: '$0',
                  desc: 'Try it instantly — no signup',
                  features: [
                    '3 capsules total',
                    'Deliver up to 6 months ahead',
                    '1 default template',
                    'Email delivery',
                  ],
                  cta: 'Try Free Now',
                  comingSoon: false,
                },
                {
                  tier: 'Free Account',
                  amount: '$0',
                  desc: 'Sign up, stay free forever',
                  featured: true,
                  features: [
                    '10 capsules total',
                    'Deliver up to 3 years ahead',
                    '3 free templates',
                    'Edit before delivery',
                    'Shareable preview links',
                    'Dashboard & history',
                  ],
                  cta: 'Sign Up Free',
                  comingSoon: false,
                },
                {
                  tier: 'Personal',
                  amount: '$5',
                  per: '/mo',
                  desc: 'For the storytellers',
                  features: [
                    { text: '10 capsules per month (resets)', locked: false },
                    { text: 'Deliver up to 10 years ahead', locked: false },
                    { text: 'All 15 templates unlocked', locked: false },
                    { text: 'Attach 2 images per capsule', locked: false },
                    { text: '1 video attachment', locked: false },
                    { text: '1 voice note attachment', locked: false },
                  ],
                  cta: 'Coming Soon',
                  comingSoon: true,
                },
              ].map(p => (
                <div
                  className={`price-card reveal ${p.featured ? 'featured' : ''} ${p.comingSoon ? 'coming-soon' : ''}`}
                  key={p.tier}
                  style={{ position: 'relative' }}
                >
                  {p.comingSoon && <div className="coming-soon-badge">✦ Coming Soon</div>}
                  <p className="price-tier">{p.tier}</p>
                  <div className="price-amount">
                    {p.amount}
                    <span>{p.per || ''}</span>
                  </div>
                  <p className="price-desc">{p.desc}</p>
                  <ul className="price-features">
                    {p.features.map(f => {
                      const text = typeof f === 'string' ? f : f.text
                      const locked = typeof f === 'object' && f.locked
                      return (
                        <li key={text} className={locked ? 'locked-feat' : ''}>
                          {text}
                        </li>
                      )
                    })}
                  </ul>
                  <button
                    className={p.featured ? 'btn-primary' : 'btn-ghost'}
                    style={{
                      width: '100%',
                      opacity: p.comingSoon ? 0.5 : 1,
                      cursor: p.comingSoon ? 'not-allowed' : 'pointer',
                    }}
                    disabled={p.comingSoon}
                    onClick={() => {
                      if (p.comingSoon) return
                      if (p.tier === 'Guest') scrollToWrite()
                      else if (p.tier === 'Free Account') router.push('/login')
                    }}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {statsCount > 0 && (
            <div className="counter-banner">
              <div className="counter-row">
                <div className="counter-item">
                  <div className="counter-num">{statsCount.toLocaleString()}</div>
                  <div className="counter-label">Capsules Sealed</div>
                </div>
              </div>
            </div>
          )}

          {/* TESTIMONIALS */}
          <section className="section">
            <p className="section-label reveal">What people are saying</p>
            <h2 className="section-title reveal">
              Words from <em>our users</em>
            </h2>
            <div className="testimonials-grid">
              {[
                {
                  text: "I wrote a letter to my daughter to open on her 18th birthday. She's 6 now. I cried writing it.",
                  name: 'Sarah M.',
                  handle: 'Mom of two',
                  emoji: '👩',
                },
                {
                  text: 'Used it to send myself a message from 2024 to open in 2034. It felt like time travel.',
                  name: 'Alex K.',
                  handle: 'Software Engineer',
                  emoji: '👨‍💻',
                },
                {
                  text: "Sent my best friend a capsule to open on our 10-year friendiversary. She has no idea it's coming.",
                  name: 'Priya D.',
                  handle: 'Designer',
                  emoji: '👩‍🎨',
                },
                {
                  text: 'The email design is beautiful. When it arrived it felt like receiving a real letter from the past.',
                  name: 'James L.',
                  handle: 'Writer',
                  emoji: '✍️',
                },
                {
                  text: 'Simple, free, and it just works. Wrote one to open when I finally launch my startup.',
                  name: 'Omar R.',
                  handle: 'Founder',
                  emoji: '🚀',
                },
                {
                  text: "I wrote one to my future self about all the things I'm scared of. Can't wait to read it in 5 years.",
                  name: 'Mia T.',
                  handle: 'Student',
                  emoji: '🎓',
                },
              ].map(({ text, name, handle, emoji }) => (
                <div className="testimonial-card reveal" key={name}>
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{emoji}</div>
                    <div>
                      <div className="testimonial-name">{name}</div>
                      <div className="testimonial-handle">{handle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="section">
            <p className="section-label reveal">Got questions?</p>
            <h2 className="section-title reveal">
              Frequently <em>asked</em>
            </h2>
            <FaqList />
          </section>

          {/* FOOTER */}
          <footer>
            <div className="footer-logo">
              Time<span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Capsula</span>
            </div>
            <p className="footer-note">Words sealed with care · Delivered across time</p>
            <p className="footer-note" style={{ color: 'rgba(200,184,152,0.3)' }}>
              <a
                href="/privacy"
                style={{ color: 'rgba(200,184,152,0.3)', textDecoration: 'underline' }}
              >
                Privacy
              </a>
              {' · '}
              <a
                href="/terms"
                style={{ color: 'rgba(200,184,152,0.3)', textDecoration: 'underline' }}
              >
                Terms
              </a>
              {' · © '}
              {new Date().getFullYear()}
            </p>
          </footer>
        </>
      )}

      {toast && <div className="toast">✦ {toast}</div>}
    </>
  )
}
