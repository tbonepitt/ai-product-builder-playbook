import React, { useState } from 'react'
import QuizCard from './QuizCard'
import WorkflowMapper from './WorkflowMapper'
import AiSpecBuilder from './AiSpecBuilder'
import { GLOSSARY, processBody } from '../data/glossary'

function ConceptCard({ card, color, colorLight, stripe }) {
  const [activeTerm, setActiveTerm] = useState(null)

  const handleClick = (e) => {
    const termEl = e.target.closest('.gterm')
    if (termEl) {
      const term = termEl.dataset.term
      setActiveTerm(activeTerm === term ? null : term)
    } else {
      setActiveTerm(null)
    }
  }

  const def = activeTerm ? GLOSSARY[activeTerm] : null

  return (
    <div className="card">
      {stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      <div
        className="c-body"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: processBody(card.body) }}
      />
      {def && (
        <div className="gterm-def" onClick={e => e.stopPropagation()}>
          <div className="gterm-def-header">
            <span className="gterm-def-term">{activeTerm}</span>
            <button className="gterm-def-close" onClick={() => setActiveTerm(null)}>×</button>
          </div>
          <div className="gterm-def-text">{def}</div>
        </div>
      )}
    </div>
  )
}

export default function CardView({ card, color, colorLight, onQuizAnswered }) {
  const stripe = <div className="card-stripe" style={{ background: `linear-gradient(90deg, ${color}, ${colorLight})` }} />

  if (card.type === "quiz") return (
    <div className="card">{stripe}<QuizCard card={card} onAnswered={onQuizAnswered} /></div>
  )
  if (card.type === "hook") return (
    <div className="card">{stripe}
      <div className="hook-wrap">
        <div className="c-icon">{card.icon}</div>
        <div className="hook-big" style={{ color }}>{card.big}</div>
        <div className="hook-rest">{card.rest}</div>
        <div className="hook-note">{card.note}</div>
      </div>
    </div>
  )
  if (card.type === "concept") return (
    <ConceptCard card={card} color={color} colorLight={colorLight} stripe={stripe} />
  )
  if (card.type === "comparison") return (
    <div className="card">{stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      <div className="comp-grid">
        <div className="comp-col">
          <div className="comp-head">{card.left.title}</div>
          {card.left.rows.map((r, i) => <div key={i} className="comp-row">{r}</div>)}
        </div>
        <div className="comp-col hl">
          <div className="comp-head new-h">{card.right.title}</div>
          {card.right.rows.map((r, i) => <div key={i} className="comp-row new-r">{r}</div>)}
        </div>
      </div>
    </div>
  )
  if (card.type === "list") return (
    <div className="card">{stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      <div className="list-rows">
        {card.items.map((item, i) => (
          <div key={i} className="list-row">
            <div className="list-num" style={{ background: color }}>{item.n || i + 1}</div>
            <div className="list-text"><b>{item.title}</b>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
  if (card.type === "steps") return (
    <div className="card">{stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      {card.body && <div className="c-body" style={{ marginBottom: 6 }}>{card.body}</div>}
      <div className="steps">
        {card.steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="step-row" style={{ borderColor: i === 0 ? color + "44" : "#ececf3" }}>
              <div className="step-ico">{s.ico}</div>
              <div><div className="step-title">{s.title}</div><div className="step-desc">{s.desc}</div></div>
            </div>
            {i < card.steps.length - 1 && <div className="step-arrow">↓</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
  if (card.type === "quote") return (
    <div className="card">{stripe}
      <div className="quote-wrap">
        <div className="c-icon">{card.icon}</div>
        <div className="qmark">"</div>
        <div className="qtext">{card.quote}</div>
        {card.source && <div className="qsource">— {card.source}</div>}
      </div>
    </div>
  )
  if (card.type === "interview") return (
    <div className="card">{stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      <div className="c-body">{card.body}</div>
      <div className="interview-box">
        <div className="interview-label">Interview line</div>
        <div className="interview-line">{card.iline}</div>
      </div>
    </div>
  )
  if (card.type === "build" && card.interactive === "ai-spec-builder") return (
    <div className="card">{stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      <div className="c-body">{card.body}</div>
      <AiSpecBuilder color={color} colorLight={colorLight} />
    </div>
  )
  if (card.type === "build" && card.interactive === "workflow-mapper") return (
    <div className="card">{stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      <div className="c-body">{card.body}</div>
      <WorkflowMapper color={color} colorLight={colorLight} />
    </div>
  )
  if (card.type === "build") return (
    <div className="card">{stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      <div className="c-body">{card.body}</div>
      <div className="build-box">
        <div className="build-label">Your action steps</div>
        {card.steps.map((s, i) => <div key={i} className="build-step" data-n={`${i + 1}.`}>{s}</div>)}
      </div>
    </div>
  )
  return <div className="card">{stripe}</div>
}
