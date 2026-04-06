import { useState } from 'react'
import CardView from './CardView'

export default function Lesson({ mod, onBack, onFinish }) {
  const [idx, setIdx] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [complete, setComplete] = useState(false)
  const card = mod.cards[idx]
  const isLast = idx === mod.cards.length - 1
  const isQuiz = card.type === "quiz"
  const canGo = !isQuiz || quizDone

  const next = () => {
    if (isLast) { setComplete(true); return }
    setIdx(i => i + 1); setQuizDone(false)
  }

  const back = () => {
    if (idx === 0) { onBack(); return }
    setIdx(i => i - 1); setQuizDone(false)
  }

  if (complete) return (
    <div className="done-screen">
      <div className="done-icon">{mod.icon}</div>
      <div className="done-title">Module complete!</div>
      <div className="done-sub">{mod.name} — {mod.cards.length} cards done.</div>
      <div className="done-btns">
        <button className="btn-ghost" onClick={onBack}>← All modules</button>
        <button className="btn-primary" onClick={onFinish} style={{ background: `linear-gradient(135deg, ${mod.color}, ${mod.colorLight})` }}>
          Back to course →
        </button>
      </div>
    </div>
  )

  const pct = ((idx + 1) / mod.cards.length) * 100
  return (
    <div className="lesson">
      <div className="topbar">
        <div className="topbar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${mod.color}, ${mod.colorLight})` }} />
      </div>
      <div className="lesson-nav">
        <button className="back-btn" onClick={onBack}>← Home</button>
        <div className="nav-dots">
          {mod.cards.map((_, i) => (
            <div key={i} className={`ndot ${i < idx ? "past" : ""} ${i === idx ? "active" : ""}`}
              style={i === idx ? { background: mod.color } : {}} />
          ))}
        </div>
        <div className="nav-count">{idx + 1} / {mod.cards.length}</div>
      </div>
      <div className="card-wrap" key={`${mod.id}-${idx}`}>
        <div className="card-and-cta">
          <CardView card={card} color={mod.color} colorLight={mod.colorLight} onQuizAnswered={() => setQuizDone(true)} />
          <div className="cta-wrap">
            {idx > 0 && (
              <button className="cta-back-btn" onClick={back}>← Back</button>
            )}
            <button className="cta-btn" onClick={next} disabled={!canGo}
              style={{ background: canGo ? `linear-gradient(135deg, ${mod.color}, ${mod.colorLight})` : "#9ca3af" }}>
              {!canGo ? "Select an answer" : isLast ? "🎉 Complete module" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
