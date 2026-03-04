'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;500&family=JetBrains+Mono:wght@300;400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --midnight: #080c14; --cosmos: #0d1525; --nebula: #111d35;
    --amber: #e8a84c; --gold: #f5c842; --parchment: #f2e8d5;
    --parchment-dim: #c8b898; --ink: #1a1005;
  }
  body { font-family: 'Lora', serif; background: var(--midnight); color: var(--parchment); min-height: 100vh; }

  nav {
    padding: 1.2rem 3rem; display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(232,168,76,0.1); background: rgba(8,12,20,0.9);
    position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px);
  }
  .logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--amber); cursor: pointer; }
  .logo em { font-style: italic; color: var(--gold); }
  .nav-right { display: flex; align-items: center; gap: 1.5rem; }
  .user-email { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--parchment-dim); }
  .btn-sm {
    font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.5rem 1.2rem; border-radius: 2px; cursor: pointer;
    transition: all 0.2s; border: none;
  }
  .btn-primary { background: var(--amber); color: var(--ink); }
  .btn-primary:hover { background: var(--gold); }
  .btn-ghost { background: transparent; color: var(--parchment-dim); border: 1px solid rgba(232,168,76,0.2); }
  .btn-ghost:hover { border-color: var(--amber); color: var(--amber); }
  .btn-danger { background: transparent; color: #e87c7c; border: 1px solid rgba(232,124,124,0.25); }
  .btn-danger:hover { background: rgba(232,124,124,0.1); border-color: #e87c7c; }
  .btn-icon { background: transparent; border: 1px solid rgba(232,168,76,0.2); color: var(--parchment-dim); padding: 0.4rem 0.7rem; font-size: 0.75rem; }
  .btn-icon:hover { border-color: var(--amber); color: var(--amber); }

  .dashboard { max-width: 1000px; margin: 0 auto; padding: 3rem 2rem; }
  .page-header { margin-bottom: 3rem; }
  .page-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--amber); margin-bottom: 0.75rem; }
  .page-title { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: var(--parchment); line-height: 1.2; }
  .page-title em { font-style: italic; color: var(--amber); }

  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 3rem; }
  .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(232,168,76,0.1); border-radius: 4px; padding: 1.5rem; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: var(--amber); line-height: 1; margin-bottom: 0.3rem; }
  .stat-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--parchment-dim); }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .section-title-sm { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--parchment); }

  .capsule-list { display: flex; flex-direction: column; gap: 1rem; }
  .capsule-card {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(232,168,76,0.1);
    border-radius: 4px; padding: 1.5rem 2rem; transition: all 0.2s;
  }
  .capsule-card:hover { border-color: rgba(232,168,76,0.2); }
  .capsule-card-row { display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center; }
  .capsule-to { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--parchment); margin-bottom: 0.3rem; }
  .capsule-subject { font-size: 0.85rem; color: var(--parchment-dim); font-style: italic; margin-bottom: 0.5rem; }
  .capsule-meta { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
  .capsule-date { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--parchment-dim); }
  .badge { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 10px; border-radius: 2px; }
  .badge-pending { background: rgba(232,168,76,0.1); color: var(--amber); border: 1px solid rgba(232,168,76,0.3); }
  .badge-delivered { background: rgba(100,200,100,0.1); color: #7dc97d; border: 1px solid rgba(100,200,100,0.3); }
  .days-left { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: rgba(232,168,76,0.4); text-align: right; line-height: 1; }
  .days-label { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--parchment-dim); text-align: right; letter-spacing: 0.1em; text-transform: uppercase; }

  .card-actions { display: flex; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); flex-wrap: wrap; align-items: center; }
  .share-link { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--parchment-dim); background: rgba(255,255,255,0.03); border: 1px solid rgba(232,168,76,0.1); padding: 0.35rem 0.75rem; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.05em; }
  .share-link:hover { border-color: rgba(232,168,76,0.3); color: var(--amber); }
  .copy-flash { color: #7dc97d !important; border-color: rgba(100,200,100,0.3) !important; }
  .actions-spacer { flex: 1; }

  /* Edit modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 2rem; backdrop-filter: blur(4px); animation: fadeIn 0.2s; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background: var(--cosmos); border: 1px solid rgba(232,168,76,0.2); border-radius: 4px; padding: 2.5rem; max-width: 520px; width: 100%; animation: slideUp 0.2s; }
  @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--parchment); margin-bottom: 1.5rem; }
  .form-group { margin-bottom: 1.25rem; }
  .form-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--amber); margin-bottom: 0.5rem; }
  .form-input, .form-textarea {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(232,168,76,0.15);
    border-radius: 2px; padding: 0.75rem 1rem; color: var(--parchment);
    font-family: 'Lora', serif; font-size: 0.95rem; outline: none; transition: border-color 0.2s;
  }
  .form-input:focus, .form-textarea:focus { border-color: var(--amber); }
  .form-textarea { resize: vertical; min-height: 140px; line-height: 1.6; }
  .char-count { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--parchment-dim); text-align: right; margin-top: 0.25rem; }
  .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }

  /* Delete confirm */
  .confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 2rem; backdrop-filter: blur(4px); }
  .confirm-box { background: var(--cosmos); border: 1px solid rgba(232,124,124,0.3); border-radius: 4px; padding: 2rem; max-width: 400px; width: 100%; text-align: center; }
  .confirm-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--parchment); margin-bottom: 0.75rem; }
  .confirm-desc { color: var(--parchment-dim); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6; font-style: italic; }
  .confirm-actions { display: flex; gap: 0.75rem; justify-content: center; }

  /* Login */
  .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .login-card { background: var(--cosmos); border: 1px solid rgba(232,168,76,0.15); border-radius: 4px; padding: 3rem; max-width: 440px; width: 100%; text-align: center; }
  .login-icon { font-size: 2.5rem; margin-bottom: 1.5rem; }
  .login-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--parchment); margin-bottom: 0.75rem; }
  .login-desc { color: var(--parchment-dim); font-size: 0.95rem; line-height: 1.7; margin-bottom: 2rem; font-style: italic; }
  .btn-full { width: 100%; padding: 0.9rem; font-size: 0.9rem; margin-top: 0.5rem; }
  .login-note { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: rgba(200,184,152,0.4); margin-top: 1rem; letter-spacing: 0.05em; }
  .magic-sent { text-align: center; }
  .magic-icon { font-size: 3rem; margin-bottom: 1rem; animation: float 4s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .magic-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--amber); margin-bottom: 0.75rem; }
  .magic-desc { color: var(--parchment-dim); font-size: 0.9rem; line-height: 1.7; }

  /* Toast */
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--cosmos); border: 1px solid rgba(232,168,76,0.3); border-radius: 4px; padding: 1rem 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--parchment); z-index: 999; animation: toastIn 0.3s ease; }
  .toast-error { border-color: rgba(232,124,124,0.4); color: #e87c7c; }
  @keyframes toastIn { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }

  /* Empty */
  .empty-state { text-align: center; padding: 5rem 2rem; }
  .empty-icon { font-size: 3rem; margin-bottom: 1.5rem; opacity: 0.5; }
  .empty-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--parchment-dim); margin-bottom: 0.75rem; }
  .empty-desc { color: rgba(200,184,152,0.5); font-size: 0.9rem; margin-bottom: 2rem; font-style: italic; }

  /* Loading */
  .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .loading-text { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--amber); letter-spacing: 0.2em; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  @media (max-width: 720px) {
    nav { padding: 0.85rem 1.1rem; }
    .user-email { display: none; }
    .stats { grid-template-columns: 1fr 1fr; gap: 0.65rem; }
    .stat-card { padding: 1rem; }
    .stat-num { font-size: 1.8rem; }
    .page { padding: 1.5rem 1rem; }
    .dashboard-title { font-size: 1.5rem; }
    .capsule-card-row { grid-template-columns: 1fr; gap: 0.5rem; }
    .days-left { text-align: left; }
    .capsule-actions { flex-wrap: wrap; gap: 0.4rem; }
    .btn-sm { font-size: 0.58rem; padding: 0.35rem 0.65rem; }
    .modal { padding: 1.5rem; margin: 1rem; }
    .section-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
  }
  @media (max-width: 420px) {
    .stats { grid-template-columns: 1fr; }
    nav { gap: 0.5rem; }
    .user-email { display: none; }
  }
`

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCapsule, setEditingCapsule] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [editForm, setEditForm] = useState({ subject: '', message: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) await fetchCapsules()
      setLoading(false)
    }
    init()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) await fetchCapsules()
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchCapsules = async () => {
    const res = await fetch('/api/capsules')
    const data = await res.json()
    if (data.capsules) setCapsules(data.capsules)
  }

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3000)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const openEdit = c => {
    setEditingCapsule(c)
    setEditForm({ subject: c.subject || '', message: '', loadingMessage: true })
    // Fetch full message (auth'd owner gets full content)
    fetch(`/api/capsules/${c.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.capsule?.message) {
          setEditForm({
            subject: d.capsule.subject || '',
            message: d.capsule.message,
            loadingMessage: false,
          })
        } else {
          setEditForm(f => ({ ...f, loadingMessage: false }))
        }
      })
      .catch(() => setEditForm(f => ({ ...f, loadingMessage: false })))
  }

  const saveEdit = async () => {
    setSaving(true)
    const updates = {}
    if (editForm.subject !== editingCapsule.subject) updates.subject = editForm.subject
    if (editForm.message) updates.message = editForm.message

    const res = await fetch(`/api/capsules/${editingCapsule.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    setSaving(false)
    if (res.ok) {
      showToast('✦ Capsule updated')
      setEditingCapsule(null)
      await fetchCapsules()
    } else {
      showToast('Failed to update', true)
    }
  }

  const deleteCapsule = async id => {
    const res = await fetch(`/api/capsules/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    if (res.ok) {
      showToast('Capsule deleted')
      setCapsules(cs => cs.filter(c => c.id !== id))
    } else {
      showToast('Failed to delete', true)
    }
  }

  const toggleShare = async c => {
    const newVal = !c.share_enabled
    await fetch(`/api/capsules/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareEnabled: newVal }),
    })
    setCapsules(cs => cs.map(x => (x.id === c.id ? { ...x, share_enabled: newVal } : x)))
    showToast(newVal ? 'Share link enabled' : 'Share link disabled')
  }

  const copyShareLink = id => {
    navigator.clipboard.writeText(`${window.location.origin}/capsule/${id}`)
    showToast('✦ Link copied!')
  }

  const daysUntil = date =>
    Math.max(0, Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)))
  const formatDate = date =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  // ── Loading ──
  if (loading)
    return (
      <>
        <style>{styles}</style>
        <div className="loading">
          <p className="loading-text">✦ &nbsp; opening vault &nbsp; ✦</p>
        </div>
      </>
    )

  // ── Not logged in → redirect to /login ──
  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    return (
      <>
        <style>{styles}</style>
        <div className="loading">
          <p className="loading-text">✦ &nbsp; redirecting &nbsp; ✦</p>
        </div>
      </>
    )
  }

  const pending = capsules.filter(c => !c.delivered).length
  const delivered = capsules.filter(c => c.delivered).length

  return (
    <>
      <style>{styles}</style>

      {/* Toast */}
      {toast && <div className={`toast ${toast.isError ? 'toast-error' : ''}`}>{toast.msg}</div>}

      {/* Edit Modal */}
      {editingCapsule && (
        <div
          className="modal-overlay"
          onClick={e => e.target === e.currentTarget && setEditingCapsule(null)}
        >
          <div className="modal">
            <h2 className="modal-title">Edit Capsule</h2>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                className="form-input"
                value={editForm.subject}
                onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="What's this about?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              {editForm.loadingMessage ? (
                <div
                  style={{
                    padding: '1rem',
                    color: 'var(--parchment-dim)',
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    border: '1px solid rgba(232,168,76,0.15)',
                    borderRadius: 2,
                  }}
                >
                  ✦ Loading your message...
                </div>
              ) : (
                <>
                  <textarea
                    className="form-textarea"
                    value={editForm.message}
                    onChange={e => setEditForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Write your message..."
                    maxLength={5000}
                  />
                  <div className="char-count">{editForm.message.length} / 5000</div>
                </>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-sm btn-ghost" onClick={() => setEditingCapsule(null)}>
                Cancel
              </button>
              <button className="btn-sm btn-primary" onClick={saveEdit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletingId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3 className="confirm-title">Delete this capsule?</h3>
            <p className="confirm-desc">
              This cannot be undone. The message will be gone forever — it will never reach its
              recipient.
            </p>
            <div className="confirm-actions">
              <button className="btn-sm btn-ghost" onClick={() => setDeletingId(null)}>
                Keep it
              </button>
              <button className="btn-sm btn-danger" onClick={() => deleteCapsule(deletingId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <nav>
        <div className="logo" onClick={() => (window.location.href = '/')}>
          Time<em>Capsula</em>
        </div>
        <div className="nav-right">
          <span className="user-email">{user.email}</span>
          <button className="btn-sm btn-primary" onClick={() => (window.location.href = '/write')}>
            + New Capsule
          </button>
          <button className="btn-sm btn-ghost" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard">
        <div className="page-header">
          <p className="page-eyebrow">✦ Your vault</p>
          <h1 className="page-title">
            Your sealed <em>capsules.</em>
          </h1>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{capsules.length}</div>
            <div className="stat-label">Total Capsules</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Sealed & Waiting</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{delivered}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>

        <div className="section-header">
          <h2 className="section-title-sm">All Capsules</h2>
        </div>

        {capsules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✉️</div>
            <h3 className="empty-title">No capsules yet</h3>
            <p className="empty-desc">
              Your vault is empty. Seal your first message to someone you love.
            </p>
            <button
              className="btn-sm btn-primary"
              onClick={() => (window.location.href = '/write')}
            >
              Write Your First Capsule
            </button>
          </div>
        ) : (
          <div className="capsule-list">
            {capsules.map(c => (
              <div className="capsule-card" key={c.id}>
                <div className="capsule-card-row">
                  <div>
                    <div className="capsule-to">To: {c.to_name}</div>
                    {c.subject && <div className="capsule-subject">"{c.subject}"</div>}
                    <div className="capsule-meta">
                      <span className="capsule-date">
                        {c.delivered
                          ? `Delivered ${formatDate(c.deliver_at)}`
                          : `Opens ${formatDate(c.deliver_at)}`}
                      </span>
                      <span
                        className={`badge ${c.delivered ? 'badge-delivered' : 'badge-pending'}`}
                      >
                        {c.delivered ? '✓ Delivered' : '⏳ Sealed'}
                      </span>
                    </div>
                  </div>
                  {!c.delivered && (
                    <div>
                      <div className="days-left">{daysUntil(c.deliver_at).toLocaleString()}</div>
                      <div className="days-label">days left</div>
                    </div>
                  )}
                </div>

                {/* Actions row */}
                {!c.delivered && (
                  <div className="card-actions">
                    <button className="btn-sm btn-icon" onClick={() => openEdit(c)}>
                      ✎ Edit
                    </button>
                    {c.share_enabled ? (
                      <>
                        <button className="share-link" onClick={() => copyShareLink(c.id)}>
                          🔗 Copy share link
                        </button>
                        <button
                          className="btn-sm btn-icon"
                          onClick={() => toggleShare(c)}
                          title="Disable sharing"
                        >
                          ✕ Disable link
                        </button>
                      </>
                    ) : (
                      <button className="btn-sm btn-icon" onClick={() => toggleShare(c)}>
                        🔗 Enable share link
                      </button>
                    )}
                    <div className="actions-spacer" />
                    <button className="btn-sm btn-danger" onClick={() => setDeletingId(c.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
