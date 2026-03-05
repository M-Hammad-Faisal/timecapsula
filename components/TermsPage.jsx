'use client'

import Stars from './Stars'

const styles = `
  .nav { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 2.5rem; background: rgba(8,12,20,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(232,168,76,0.08); }
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

export default function TermsPage() {
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
          Terms of <em>Service.</em>
        </h1>
        <p className="updated">Last updated: March 2026</p>

        <div className="divider" />

        <p>
          By using TimeCapsula you agree to these terms. Please read them — they're short and
          written in plain English.
        </p>

        <h2>The Service</h2>
        <p>
          TimeCapsula lets you write a message today and have it delivered to a recipient at a
          future date you choose. The service is provided "as is" by an independent developer. While
          we work hard to ensure reliable delivery, we cannot guarantee delivery in all
          circumstances (see Limitations below).
        </p>

        <h2>Your Account</h2>
        <ul>
          <li>You must provide a valid email address to use the service.</li>
          <li>You are responsible for keeping your account secure.</li>
          <li>You may not use the service on behalf of others without their knowledge.</li>
          <li>One account per person. Automated account creation is prohibited.</li>
        </ul>

        <h2>Your Content</h2>
        <p>
          You own the content you write. By using TimeCapsula, you grant us a limited license to
          store and deliver your message to the recipient you designate. We will never read, share,
          or use your message content for any other purpose.
        </p>
        <p>
          You agree <strong>not</strong> to use TimeCapsula to send:
        </p>
        <ul>
          <li>Spam, harassment, or threatening messages.</li>
          <li>Content that is illegal in your jurisdiction.</li>
          <li>Phishing attempts or fraudulent content.</li>
          <li>Content that infringes on another person's intellectual property.</li>
        </ul>
        <p>We reserve the right to delete capsules that violate these rules without notice.</p>

        <h2>Free and Premium Plans</h2>
        <ul>
          <li>
            <strong>Free plan:</strong> Up to 10 capsules, 3 free templates, full delivery features.
          </li>
          <li>
            <strong>Premium templates:</strong> One-time payment of $5 gives you lifetime access to
            all premium templates.
          </li>
          <li>
            Payments are processed by Stripe. All sales are final — no refunds unless the service
            fails to deliver your capsule.
          </li>
        </ul>

        <h2>Delivery Limitations</h2>
        <p>
          We make every reasonable effort to deliver capsules on the scheduled date. However,
          delivery may be delayed or fail due to:
        </p>
        <ul>
          <li>The recipient's email address being invalid or inactive at delivery time.</li>
          <li>Recipient's email provider marking the message as spam.</li>
          <li>Unforeseen service outages.</li>
        </ul>
        <p>
          If we are unable to deliver your capsule, we will notify you by email and retry for up to
          7 days.
        </p>

        <h2>Service Continuity</h2>
        <p>
          TimeCapsula is an independent project. If the service is discontinued, we will give users
          at least
          <strong> 90 days notice</strong> and provide a full export of all pending capsules before
          shutdown. No capsule will be silently lost.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          TimeCapsula is provided without warranty. To the maximum extent permitted by law, we are
          not liable for indirect, incidental, or consequential damages arising from use of the
          service. Our total liability to you shall not exceed the amount you paid in the last 12
          months.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. We will notify you by email at least 14 days
          before any material change takes effect. Continued use of the service after that date
          constitutes acceptance.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of Pakistan. Disputes shall be resolved in the courts
          of Lahore.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href="mailto:hello@timecapsula.website">hello@timecapsula.website</a>
        </p>

        <div className="divider" />

        <footer className="footer">
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/login">Sign In</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} TimeCapsula</p>
        </footer>
      </div>
    </>
  )
}
