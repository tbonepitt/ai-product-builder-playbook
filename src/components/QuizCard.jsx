import { useState } from 'react'

export default function QuizCard({ card, onAnswered }) {
  const [chosen, setChosen] = useState(null)
  const answered = chosen !== null
  const pick = (id) => { if (answered) return; setChosen(id); onAnswered() }
  return (
    <div>
      {card.tag && <div className="c-tag">{card.tag}</div>}
      <div className="quiz-q">{card.q}</div>
      <div className="quiz-opts">
        {card.opts.map(opt => {
          let cls = "quiz-opt"
          if (answered) {
            if (opt.id === card.correct) cls += " right"
            else if (opt.id === chosen) cls += " wrong"
          }
          return (
            <button key={opt.id} className={cls} disabled={answered} onClick={() => pick(opt.id)}>
              <span style={{ fontWeight: 700, color: "#9ca3af", marginRight: 7 }}>{opt.id.toUpperCase()}.</span>{opt.t}
            </button>
          )
        })}
      </div>
      {answered && <div className="quiz-explain" dangerouslySetInnerHTML={{ __html: card.explain }} />}
    </div>
  )
}
