import { useState, useEffect } from 'react'

const STEPS = [
  { icon: '📋', text: 'Reading your spec…' },
  { icon: '🔍', text: 'Checking clarity and specificity…' },
  { icon: '⚡', text: 'Evaluating guardrails…' },
  { icon: '🔁', text: 'Reviewing fallback logic…' },
  { icon: '🎯', text: 'Finding the biggest gap…' },
]

export default function AnalyzingIndicator({ color, steps = STEPS }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1800)
    return () => clearInterval(id)
  }, [steps.length])
  return (
    <div className="wm-analyzing">
      <div className="wm-analyzing-icon">{steps[step].icon}</div>
      <div className="wm-analyzing-text">{steps[step].text}</div>
      <div className="wm-analyzing-bar">
        <div className="wm-analyzing-fill" style={{ background: `linear-gradient(90deg, ${color}, #38bdf8)` }} />
      </div>
    </div>
  )
}
