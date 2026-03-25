export default function Loading() {
  return (
    <>
      <style>{`
        .ld-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;}
        .ld-text{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--amber);letter-spacing:0.2em;text-transform:uppercase;animation:ldpulse 1.5s ease-in-out infinite;}
        .ld-dots{display:flex;gap:0.5rem;}
        .ld-dot{width:6px;height:6px;border-radius:50%;background:var(--amber);opacity:0.3;animation:ldbounce 1.2s ease-in-out infinite;}
        .ld-dot:nth-child(2){animation-delay:0.2s;}
        .ld-dot:nth-child(3){animation-delay:0.4s;}
        @keyframes ldpulse{0%,100%{opacity:0.35}50%{opacity:1}}
        @keyframes ldbounce{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}
      `}</style>
      <div className="ld-wrap" role="status" aria-label="Loading">
        <div className="ld-dots" aria-hidden="true">
          <div className="ld-dot" />
          <div className="ld-dot" />
          <div className="ld-dot" />
        </div>
        <p className="ld-text">Loading…</p>
      </div>
    </>
  )
}
