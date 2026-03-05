'use client'

// ── Shared StepBar component ───────────────────────────────────────
// Used by WriteCapsule (steps: Template → Write → Confirm)
// and Dashboard EditFlow (steps: Template → Edit → Review)

const stepBarStyles = `
  .stepbar {
    display: flex;
    align-items: center;
    max-width: 420px;
    margin: 0 auto 2.5rem;
  }
  .stepbar-item {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .stepbar-item:last-child {
    flex: none;
  }
  .stepbar-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  .stepbar-dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    font-weight: 700;
    transition: all 0.3s;
    flex-shrink: 0;
  }
  .stepbar-dot.active {
    background: var(--sb-amber, #e8a84c);
    color: var(--sb-ink, #1a1005);
    box-shadow: 0 0 14px rgba(232,168,76,0.35);
  }
  .stepbar-dot.done {
    background: rgba(232,168,76,0.14);
    color: var(--sb-amber, #e8a84c);
    border: 1px solid rgba(232,168,76,0.32);
  }
  .stepbar-dot.todo {
    background: rgba(255,255,255,0.04);
    color: rgba(200,184,152,0.25);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .stepbar-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.54rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .stepbar-label.active { color: var(--sb-amber, #e8a84c); }
  .stepbar-label.done   { color: rgba(232,168,76,0.45); }
  .stepbar-label.todo   { color: rgba(200,184,152,0.22); }
  .stepbar-line {
    flex: 1;
    height: 1px;
    background: rgba(232,168,76,0.12);
    margin: 0 8px;
    margin-bottom: 18px;
    transition: background 0.3s;
  }
  .stepbar-line.done { background: rgba(232,168,76,0.32); }
`

export default function StepBar({ step, labels }) {
  const stepLabels = labels || ['Template', 'Write', 'Confirm']
  return (
    <>
      <style>{stepBarStyles}</style>
      <div className="stepbar">
        {stepLabels.map((label, i) => {
          const n = i + 1
          const state = n < step ? 'done' : n === step ? 'active' : 'todo'
          return (
            <div
              key={label}
              className="stepbar-item"
              style={{ flex: i < stepLabels.length - 1 ? 1 : undefined }}
            >
              <div className="stepbar-step">
                <div className={`stepbar-dot ${state}`}>{state === 'done' ? '✓' : n}</div>
                <span className={`stepbar-label ${state}`}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`stepbar-line ${step > n ? 'done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
