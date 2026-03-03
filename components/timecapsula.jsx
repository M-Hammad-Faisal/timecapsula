'use client'

import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400&display=swap');`;

const styles = `
  ${FONTS}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --midnight: #080c14;
    --cosmos: #0d1525;
    --nebula: #111d35;
    --amber: #e8a84c;
    --amber-dim: #b07830;
    --gold: #f5c842;
    --parchment: #f2e8d5;
    --parchment-dim: #c8b898;
    --star: #ffffff;
    --ink: #1a1005;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Lora', Georgia, serif;
    background: var(--midnight);
    color: var(--parchment);
    overflow-x: hidden;
  }

  /* STARS */
  .stars-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .star-dot {
    position: absolute;
    border-radius: 50%;
    background: white;
    animation: twinkle var(--d, 3s) ease-in-out infinite;
    animation-delay: var(--delay, 0s);
  }
  @keyframes twinkle {
    0%, 100% { opacity: var(--min-op, 0.2); transform: scale(1); }
    50% { opacity: var(--max-op, 0.9); transform: scale(1.3); }
  }

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
`;

// Stars component
function Stars() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: (Math.random() * 3 + 2).toFixed(1),
    delay: (Math.random() * 5).toFixed(1),
    minOp: (Math.random() * 0.2 + 0.05).toFixed(2),
    maxOp: (Math.random() * 0.6 + 0.3).toFixed(2),
  }));

  return (
    <div className="stars-bg">
      {stars.map(s => (
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
  );
}

// Envelope SVG
function EnvelopeSVG({ size = 220 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 220 154" fill="none">
      <rect x="2" y="2" width="216" height="150" rx="4" fill="rgba(232,168,76,0.08)" stroke="rgba(232,168,76,0.4)" strokeWidth="1.5"/>
      <path d="M2 12 L110 80 L218 12" stroke="rgba(232,168,76,0.5)" strokeWidth="1.5" fill="none"/>
      <path d="M2 152 L75 82" stroke="rgba(232,168,76,0.3)" strokeWidth="1"/>
      <path d="M218 152 L145 82" stroke="rgba(232,168,76,0.3)" strokeWidth="1"/>
      <circle cx="110" cy="77" r="6" fill="rgba(232,168,76,0.6)"/>
      <path d="M90 50 Q110 40 130 50" stroke="rgba(232,168,76,0.2)" strokeWidth="1" fill="none"/>
      {[...Array(5)].map((_, i) => (
        <line key={i} x1="70" y1={100 + i*8} x2="150" y2={100 + i*8} stroke="rgba(242,232,213,0.1)" strokeWidth="1"/>
      ))}
    </svg>
  );
}

// Scroll reveal hook
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Delivery date helper
function getDeliveryText(when, customDate) {
  if (!when) return null;
  const now = new Date();
  let target;
  if (when === 'custom' && customDate) {
    target = new Date(customDate);
  } else {
    target = new Date(now);
    const map = { '1y': 1, '5y': 5, '10y': 10, '25y': 25 };
    target.setFullYear(now.getFullYear() + (map[when] || 0));
  }
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  const dateStr = target.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return { dateStr, days: diff };
}

// MAIN APP
export default function TimeCapsula() {
  const [view, setView] = useState('home'); // home | write | success
  const [form, setForm] = useState({
    to: '', toEmail: '', from: '', subject: '', message: '', when: '', customDate: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const writeRef = useRef(null);

  useReveal();

  const delivery = getDeliveryText(form.when, form.customDate);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    if (!form.to || !form.toEmail || !form.message || !form.when) {
      showToast('Please fill in all required fields ✦');
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setView('success');
  };

  const scrollToWrite = () => {
    setView('home');
    setTimeout(() => {
      writeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <>
      <style>{styles}</style>
      <Stars />

      {/* NAV */}
      <nav>
        <div className="logo" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
          Time<span>Capsula</span>
        </div>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#write" onClick={e => { e.preventDefault(); scrollToWrite(); }} className="nav-cta">Write a Capsule</a>
        </div>
      </nav>

      {view === 'success' ? (
        // SUCCESS SCREEN
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div className="success-screen">
            <div className="success-icon">📬</div>
            <h2 className="success-title">Your capsule is sealed.</h2>
            <p className="success-desc">
              Your message to <strong style={{ color: 'var(--amber)' }}>{form.to}</strong> has been locked away in time.
              It will be delivered on <strong style={{ color: 'var(--amber)' }}>{delivery?.dateStr}</strong> — {delivery?.days?.toLocaleString()} days from now.
            </p>
            <p style={{ color: 'rgba(200,184,152,0.5)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '2.5rem' }}>
              A confirmation has been sent to {form.toEmail}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => { setForm({ to: '', toEmail: '', from: '', subject: '', message: '', when: '', customDate: '' }); setView('home'); scrollToWrite(); }}>
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
              Words that wait<br />for the <em>right moment.</em>
            </h1>
            <p className="hero-subtitle">
              Write a letter, record a memory, or leave a gift — and let it arrive exactly when it matters most.
            </p>
            <div className="hero-cta-group">
              <button className="btn-primary" onClick={scrollToWrite}>Write Your First Capsule</button>
              <button className="btn-ghost" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
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
            <h2 className="section-title reveal">Three steps.<br /><em>A lifetime of impact.</em></h2>
            <div className="steps">
              {[
                { num: '01', icon: '✍️', title: 'Write', desc: 'Pour your heart into words. Write to your future self, your children, a friend — or anyone who deserves to receive a piece of you.' },
                { num: '02', icon: '⏳', title: 'Seal', desc: 'Choose when your capsule opens — 1 year, 10 years, or a specific date. Your words are locked away until the moment is right.' },
                { num: '03', icon: '📬', title: 'Deliver', desc: 'On the chosen day, your capsule travels through time and lands in their inbox — exactly as you wrote it, perfectly timed.' },
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
                  { title: 'Parents to children', text: '"Open this on your 18th birthday. I wrote it the night you were born."' },
                  { title: 'Couples in love', text: '"For our 10th anniversary. Ten years ago I knew you were the one."' },
                  { title: 'You, to yourself', text: '"Read this before your next big decision. You already know the answer."' },
                  { title: 'Friends across time', text: '"Wherever life has taken us — I hope you still laugh the same way."' },
                  { title: 'Founders & dreamers', text: '"This is what I believed when I started. I wonder if it came true."' },
                  { title: 'Those leaving legacies', text: '"If you\'re reading this, I am gone. But these words are still mine."' },
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
                      <option value="1y">1 year from now</option>
                      <option value="5y">5 years from now</option>
                      <option value="10y">10 years from now</option>
                      <option value="25y">25 years from now</option>
                      <option value="custom">Pick a specific date</option>
                    </select>
                  </div>
                  {form.when === 'custom' && (
                    <div className="form-group reveal">
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
                  <div className="delivery-preview reveal">
                    <p>
                      ✦ This capsule will be sealed for <strong>{delivery.days?.toLocaleString()} days</strong> and delivered on <strong>{delivery.dateStr}</strong>
                    </p>
                  </div>
                )}

                <div style={{ textAlign: 'center', paddingTop: '1rem' }} className="reveal">
                  <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ fontSize: '1.1rem', padding: '1.1rem 3rem', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? '✦ Sealing your capsule...' : '✦ Seal & Send Into Time'}
                  </button>
                  <p style={{ color: 'var(--parchment-dim)', fontSize: '0.8rem', marginTop: '1rem', fontStyle: 'italic' }}>
                    Free · No account required for your first capsule
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="cosmic-divider">· · · ✦ · · ·</div>

          {/* PRICING */}
          <section className="section" id="pricing">
            <p className="section-label reveal">Simple pricing</p>
            <h2 className="section-title reveal">Begin for free.<br /><em>Grow through time.</em></h2>
            <div className="pricing-grid">
              {[
                {
                  tier: 'Free', amount: '$0', desc: 'For your first capsule',
                  features: ['3 text capsules', 'Up to 1 year ahead', 'Email delivery', 'Basic themes'],
                  cta: 'Start Free'
                },
                {
                  tier: 'Personal', amount: '$4', per: '/mo', desc: 'For the storytellers', featured: true,
                  features: ['Unlimited capsules', '50 years into the future', 'Voice note attachments', 'Photo & video support', 'Priority delivery'],
                  cta: 'Go Personal'
                },
                {
                  tier: 'Family', amount: '$12', per: '/mo', desc: 'For legacies',
                  features: ['Everything in Personal', 'Family vault (6 members)', 'Shared memory timeline', 'PDF & print export', 'Custom delivery domain'],
                  cta: 'Build a Legacy'
                },
                {
                  tier: 'Lifetime', amount: '$49', desc: 'One time, forever', special: true,
                  features: ['Everything in Personal', 'Locked in today\'s price', 'Lifetime storage guarantee', 'Beta feature access'],
                  cta: 'Own It Forever'
                }
              ].map(p => (
                <div className={`price-card reveal ${p.featured ? 'featured' : ''}`} key={p.tier}>
                  <p className="price-tier">{p.tier}</p>
                  <div className="price-amount">{p.amount}<span>{p.per || ''}</span></div>
                  <p className="price-desc">{p.desc}</p>
                  <ul className="price-features">
                    {p.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <button
                    className={p.featured ? 'btn-primary' : 'btn-ghost'}
                    style={{ width: '100%' }}
                    onClick={scrollToWrite}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <footer>
            <div className="footer-logo">Time<span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Capsula</span></div>
            <p className="footer-note">Words sealed with care · Delivered across time</p>
            <p className="footer-note" style={{ color: 'rgba(200,184,152,0.3)' }}>
              Built with Claude · © {new Date().getFullYear()}
            </p>
          </footer>
        </>
      )}

      {toast && <div className="toast">✦ {toast}</div>}
    </>
  );
}
