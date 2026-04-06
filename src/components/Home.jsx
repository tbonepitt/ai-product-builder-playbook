import { MODULES } from '../data/modules'

export default function Home({ completed, onSelect }) {
  const total = MODULES.length
  const done = completed.size
  const pct = Math.round((done / total) * 100)
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="hero-title">The <span>AI Product</span><br />Builder Playbook</h1>
        <p className="hero-sub">Seven skills. Eight modules. Learn to build, not just describe.</p>
        <div className="hero-pills">
          <span className="pill">📚 8 modules</span>
          <span className="pill">⏱ ~40 min total</span>
          <span className="pill">🎯 Self-paced</span>
          <span className="pill">🔨 Hands-on exercises</span>
        </div>
      </div>
      {done > 0 && (
        <div className="overall-progress">
          <div className="op-label"><span>Your progress</span><span>{done} of {total} · {pct}%</span></div>
          <div className="op-bar"><div className="op-fill" style={{ width: `${pct}%` }} /></div>
        </div>
      )}
      <div className="section-label">Modules</div>
      <div className="mod-grid">
        {MODULES.map((mod, i) => {
          const isDone = completed.has(mod.id)
          return (
            <div key={mod.id} className="mod-card" onClick={() => onSelect(mod.id)}>
              <div className="mod-stripe" style={{ background: mod.color }} />
              <div className="mod-icon">{mod.icon}</div>
              <div className="mod-num">Module {i + 1}</div>
              <div className="mod-name">{mod.name}</div>
              <div className="mod-tagline">{mod.tagline}</div>
              <div className="mod-foot">
                <span className="mod-time">⏱ {mod.duration}</span>
                <span className={`badge ${isDone ? "badge-done" : "badge-new"}`}>{isDone ? "✓ Done" : "Start →"}</span>
              </div>
            </div>
          )
        })}
      </div>
      {done === total && (
        <div className="finish-banner">
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>All done. Now build something.</div>
          <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
            You have the knowledge. You have the tools. The only thing left is to start the loop.<br />Pick the workflow. Build the prototype. This week.
          </div>
        </div>
      )}
    </div>
  )
}
