export default function NotFound() {
  return (
    <>
      <style>{`
        .nf-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center;position:relative;z-index:1;}
        .nf-eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--amber);margin-bottom:1.5rem;}
        .nf-code{font-family:'Playfair Display',serif;font-size:clamp(5rem,15vw,9rem);font-weight:700;color:rgba(232,168,76,0.12);line-height:1;margin-bottom:0;position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);pointer-events:none;user-select:none;}
        .nf-heading{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;margin-bottom:1rem;line-height:1.15;}
        .nf-heading em{font-style:italic;color:var(--amber);}
        .nf-body{color:var(--dim);font-size:0.95rem;line-height:1.75;max-width:440px;margin-bottom:2.5rem;}
        .nf-btn{display:inline-block;background:var(--amber);color:var(--ink);border:none;padding:0.9rem 2.2rem;font-family:'Lora',serif;font-size:0.95rem;cursor:pointer;border-radius:2px;text-decoration:none;transition:background 0.2s;}
        .nf-btn:hover{background:var(--gold);}
        .nf-ghost{display:inline-block;background:transparent;color:var(--dim);border:1px solid rgba(232,168,76,0.2);padding:0.9rem 2.2rem;font-family:'Lora',serif;font-size:0.95rem;cursor:pointer;border-radius:2px;text-decoration:none;transition:all 0.2s;}
        .nf-ghost:hover{border-color:var(--amber);color:var(--amber);}
        .nf-btns{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;}
      `}</style>
      <div className="nf-page">
        <span className="nf-code" aria-hidden="true">
          404
        </span>
        <p className="nf-eyebrow">✦ &nbsp; Lost in time &nbsp; ✦</p>
        <h1 className="nf-heading">
          This page <em>doesn&apos;t exist.</em>
        </h1>
        <p className="nf-body">
          The capsule you&apos;re looking for may have already been delivered, or the link might be
          wrong. Your other capsules are safe.
        </p>
        <div className="nf-btns">
          <a href="/" className="nf-btn">
            Back to home
          </a>
          <a href="/dashboard" className="nf-ghost">
            My capsules
          </a>
        </div>
      </div>
    </>
  )
}
