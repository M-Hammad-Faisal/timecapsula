'use client'

import Stars from './Stars'

const styles = `
  .nav { position: fixed; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 2.5rem; width: 100%; background: rgba(8,12,20,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(232,168,76,0.08); }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: var(--amber); text-decoration: none; }
  .nav-logo em { font-style: italic; color: var(--gold); }
  .nav-back { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; letter-spacing: 0.1em; color: var(--dim); text-decoration: none; transition: color 0.2s; }
  .nav-back:hover { color: var(--amber); }

  .page { max-width: 720px; margin: 0 auto; padding: 4rem 2rem 6rem; position: relative; z-index: 1; }
  .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--amber); margin-bottom: 1rem; }
  .title { font-family: 'Playfair Display', serif; font-size: 2.8rem; color: var(--parchment); line-height: 1.1; margin-bottom: 0.5rem; }
  .title em { font-style: italic; color: var(--amber); }
  .updated { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: rgba(200,184,152,0.4); letter-spacing: 0.08em; margin-bottom: 3rem; }

  .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(232,168,76,0.2), transparent); margin: 2.5rem 0; }

  h2 { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--amber); margin-bottom: 0.75rem; margin-top: 2.5rem; }
  p { color: var(--dim); line-height: 1.85; font-size: 0.95rem; margin-bottom: 1rem; }
  ul { color: var(--dim); line-height: 1.85; font-size: 0.95rem; margin-bottom: 1rem; padding-left: 1.5rem; }
  li { margin-bottom: 0.4rem; }
  a { color: var(--amber); text-underline-offset: 3px; }
  a:hover { color: var(--gold); }
  strong { color: var(--parchment); font-weight: 500; }

  .footer { text-align: center; padding-top: 4rem; }
  .footer-links { display: flex; gap: 2rem; justify-content: center; margin-bottom: 0.75rem; }
  .footer-links a { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: rgba(200,184,152,0.35); text-decoration: none; text-transform: uppercase; transition: color 0.2s; }
  .footer-links a:hover { color: var(--amber); }
  .footer-copy { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: rgba(200,184,152,0.2); letter-spacing: 0.06em; }
`

export default function PrivacyPage() {
  return (
    <>
      <style>{styles}</style>
      <Stars />

      <nav className="nav">
        <a href="/" className="nav-logo">
          Time<em>Capsula</em>
        </a>
        <a href="/" className="nav-back">
          ← Back to home
        </a>
      </nav>

      <div className="page">
        <p className="eyebrow">✦ &nbsp; Legal &nbsp; ✦</p>
        <h1 className="title">
          Privacy <em>Policy.</em>
        </h1>
        <p className="updated">Last updated: March 2026</p>

        <div className="divider" />

        <p>
          TimeCapsula is a small, independent service that lets you write messages to be delivered
          in the future. We take your privacy seriously and collect only what's necessary to make
          the service work.
        </p>

        <h2>What We Collect</h2>
        <ul>
          <li>
            <strong>Your email address</strong> — used to send you a sign-in link and to deliver
            your capsules.
          </li>
          <li>
            <strong>Recipient name and email</strong> — used solely to address and deliver your
            capsule at the scheduled time.
          </li>
          <li>
            <strong>Your message content</strong> — stored encrypted at rest in our database until
            the delivery date.
          </li>
          <li>
            <strong>Delivery preferences</strong> — the template, subject, and scheduled date you
            choose.
          </li>
        </ul>
        <p>
          We do not collect passwords, payment card numbers (payments handled by Stripe), or any
          data beyond what you explicitly provide.
        </p>

        <h2>How We Use Your Data</h2>
        <ul>
          <li>To authenticate you via magic link (Supabase Auth).</li>
          <li>To store and deliver your time capsule at the scheduled date.</li>
          <li>
            To send transactional emails — confirmation, delivery, and occasional service notices.
          </li>
        </ul>
        <p>
          We never sell your data, use it for advertising, or share it with third parties except as
          listed below.
        </p>

        <h2>Third-Party Services</h2>
        <ul>
          <li>
            <strong>Supabase</strong> — database and authentication. Data hosted in EU/US region.
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery.
          </li>
          <li>
            <strong>Vercel</strong> — hosting and edge functions.
          </li>
          <li>
            <strong>Stripe</strong> — payment processing for premium templates (we never see your
            card details).
          </li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          Capsule content is stored until it is delivered and for 30 days afterward (so you can see
          delivery confirmation). After 30 days post-delivery, message content is automatically
          purged. Your account and email remain until you request deletion.
        </p>

        <h2>Your Rights</h2>
        <p>
          You can request export or deletion of all your data at any time by emailing us at{' '}
          <a href="mailto:privacy@timecapsula.website">privacy@timecapsula.website</a>. We will
          respond within 7 days.
        </p>

        <h2>Cookies</h2>
        <p>
          We use a single session cookie to keep you signed in. No tracking cookies, no analytics
          pixels. The site does not include any third-party trackers.
        </p>

        <h2>Security</h2>
        <p>
          All data is transmitted over HTTPS. Capsule content is encrypted at rest. We use Supabase
          Row-Level Security so only you and your designated recipient can access your capsules.
        </p>

        <h2>Changes</h2>
        <p>
          If we make material changes to this policy, we will notify you by email at least 14 days
          before the change takes effect.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email{' '}
          <a href="mailto:privacy@timecapsula.website">privacy@timecapsula.website</a>
        </p>

        <div className="divider" />

        <footer className="footer">
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/terms">Terms of Service</a>
            <a href="/login">Sign In</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} TimeCapsula</p>
        </footer>
      </div>
    </>
  )
}
