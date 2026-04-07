import { MODULES } from '../data/modules'

export default function Home({ completed, onSelect, onGlossary, onNowBuild }) {
  const total = MODULES.length
  const done = completed.size
  const pct = Math.round((done / total) * 100)
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="hero-title">The <span>AI Product</span><br />Builder Playbook</h1>
        <p className="hero-sub">Stop waiting to feel ready. Eight modules, then you go build something this week.</p>
        <div className="hero-pills">
          <span className="pill">⚡ ~5 min per module</span>
          <span className="pill">📚 8 modules</span>
          <span className="pill">🔨 Build as you learn</span>
          <span className="pill">🎯 Self-paced</span>
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
      <div className="home-footer">
        <button className="glossary-link" onClick={onGlossary}>📖 Glossary</button>
      </div>
      {done === total && (
        <div className="finish-banner">
          <div className="finish-icon">🚀</div>
          <div className="finish-title">Course complete. Now go build.</div>
          <div className="finish-sub">You have the frameworks. You have the tools. The only thing left is the first move.</div>
          <button className="finish-cta" onClick={onNowBuild}>
            See your build plan →
          </button>
        </div>
      )}
    </div>
  )
}
