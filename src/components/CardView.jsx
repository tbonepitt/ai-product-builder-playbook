import React from 'react'
import QuizCard from './QuizCard'

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
    <div className="card">{stripe}
      <div className="c-icon">{card.icon}</div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="c-head">{card.head}</div>
      <div className="c-body" dangerouslySetInnerHTML={{ __html: card.body.replace(/\n/g, "<br/>") }} />
    </div>
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
