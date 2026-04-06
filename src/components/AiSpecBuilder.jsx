import { useState } from 'react'
import AnalyzingIndicator from './AnalyzingIndicator'

const SPEC_STEPS = [
  { icon: '📋', text: 'Reading your spec…' },
  { icon: '🔍', text: 'Checking context and instruction…' },
  { icon: '⚡', text: 'Evaluating output contract…' },
  { icon: '🛡️', text: 'Reviewing guardrails…' },
  { icon: '🎯', text: 'Assessing fallback logic…' },
]

const FIELDS = [
  { key: 'context',        label: 'Context',         rows: 3, placeholder: 'What 3–5 specific inputs does the AI receive? Name them exactly — not "user data" but "the customer\'s support ticket text, their account tier, and the last 3 actions they took."' },
  { key: 'instruction',   label: 'Instruction',      rows: 3, placeholder: 'What exactly should the AI produce? Be specific about scope and constraints — not "summarize the ticket" but "write a 2-sentence triage summary categorizing the issue type and urgency."' },
  { key: 'outputContract',label: 'Output contract',  rows: 2, placeholder: 'Format, length, tone. E.g. "Two sentences. Plain English. Never use jargon. Always end with a recommended next action."' },
  { key: 'guardrail1',    label: 'Guardrail 1',      rows: 2, placeholder: 'What must the AI never say or do — even if asked? E.g. "Never promise a resolution timeline. Never reference specific pricing."' },
  { key: 'guardrail2',    label: 'Guardrail 2',      rows: 2, placeholder: 'A second hard constraint. E.g. "Never escalate to human review without first attempting to classify the issue."' },
  { key: 'fallback',      label: 'Fallback',         rows: 2, placeholder: 'If AI returns garbage or low confidence, what does the user see? E.g. "Show a generic \'We\'re reviewing your request\' message and route to the manual queue."' },
]

const RATING_STYLES = {
  'Strong':     { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Needs work': { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  'Missing':    { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
}

function loadM1() {
  try { return JSON.parse(localStorage.getItem('aipb-m1-workflow') || 'null') } catch { return null }
}

export default function AiSpecBuilder({ color, colorLight }) {
  const m1 = loadM1()

  const [fields, setFields] = useState({
    context:        m1 ? m1.aiSteps.join('\n') : '',
    instruction:    m1 ? m1.leverageSentence   : '',
    outputContract: '',
    guardrail1:     '',
    guardrail2:     '',
    fallback:       '',
  })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (key, val) => setFields(f => ({ ...f, [key]: val }))
  const allFilled = FIELDS.every(f => fields[f.key].trim().length > 3)

  const submit = async () => {
    if (!allFilled) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/spec-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec: fields })
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── RESULTS ───────────────────────────────────────────────────
  if (result) return (
    <div className="spec-result">
      <div className="spec-overall" style={{ borderColor: color }}>
        <div className="spec-section-label" style={{ color }}>Overall</div>
        <div className="spec-overall-text">{result.overall}</div>
      </div>
      {FIELDS.map(f => {
        const r = result[f.key]
        if (!r) return null
        const style = RATING_STYLES[r.rating] || RATING_STYLES['Needs work']
        return (
          <div key={f.key} className="spec-field-result" style={{ borderColor: style.border, background: style.bg }}>
            <div className="spec-field-header">
              <span className="spec-field-name">{f.label}</span>
              <span className="spec-rating" style={{ color: style.color }}>{r.rating}</span>
            </div>
            <div className="spec-field-value">{fields[f.key]}</div>
            <div className="spec-field-feedback" style={{ color: style.color }}>{r.feedback}</div>
          </div>
        )
      })}
      <button className="wm-reset-btn" style={{ marginTop: 12 }} onClick={() => setResult(null)}>← Edit spec</button>
    </div>
  )

  // ── FORM ──────────────────────────────────────────────────────
  return (
    <div className="spec-builder">
      {m1 && (
        <div className="spec-m1-banner" style={{ borderColor: colorLight, color }}>
          🔄 Context and instruction pre-filled from your Module 1 workflow — edit as needed
        </div>
      )}
      <div className="spec-fields">
        {FIELDS.map(f => (
          <div key={f.key} className="spec-field">
            <label className="spec-label">{f.label}</label>
            <textarea
              className="spec-textarea"
              placeholder={f.placeholder}
              value={fields[f.key]}
              rows={f.rows}
              onChange={e => set(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>
      {error && <div className="wm-error">{error}</div>}
      {loading
        ? <AnalyzingIndicator color={color} steps={SPEC_STEPS} />
        : <button
            className="wm-submit-btn"
            onClick={submit}
            disabled={!allFilled}
            style={{ background: allFilled ? `linear-gradient(135deg, ${color}, ${colorLight})` : '#9ca3af', marginTop: 10 }}
          >
            {allFilled ? 'Review my spec →' : 'Fill in all fields first'}
          </button>
      }
    </div>
  )
}
