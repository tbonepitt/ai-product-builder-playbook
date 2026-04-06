import { useState } from 'react'

const ANATOMY_COLORS = {
  Input: '#0284c7',
  Reasoning: '#7c3aed',
  Output: '#0891b2',
  Action: '#16a34a'
}

export default function WorkflowMapper({ color, colorLight, steps: actionSteps }) {
  const [workflow, setWorkflow] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const lineCount = workflow.split('\n').filter(l => l.trim()).length

  const analyze = async () => {
    if (lineCount < 2) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/workflow-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow })
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError('Something went wrong. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (result) return (
    <div className="wm-result">
      <div className="wm-section-label">Your workflow, mapped</div>
      <div className="wm-steps-list">
        {result.steps.map((step, i) => (
          <div key={i} className={`wm-step${step.aiPossible ? ' wm-ai' : ''}`}>
            <div className="wm-step-meta">
              <span className="wm-anatomy" style={{ background: ANATOMY_COLORS[step.anatomy] || color }}>
                {step.anatomy}
              </span>
              {step.aiPossible && <span className="wm-ai-badge">⚡ AI-possible</span>}
            </div>
            <div className="wm-step-text">{step.text}</div>
            <div className="wm-step-reason">{step.aiReason}</div>
          </div>
        ))}
      </div>
      <div className="wm-output-block">
        <div className="wm-section-label">Following the output</div>
        <div className="wm-output-text">{result.outputAnalysis}</div>
      </div>
      <div className="wm-leverage-block" style={{ borderColor: color }}>
        <div className="wm-section-label" style={{ color }}>Your leverage point</div>
        <div className="wm-leverage-text">{result.leverageSentence}</div>
      </div>
      <button className="wm-reset-btn" onClick={() => { setResult(null); setWorkflow('') }}>
        ← Try a different workflow
      </button>
    </div>
  )

  return (
    <div className="wm-input-area">
      <div className="wm-steps-guide">
        {actionSteps.map((s, i) => (
          <div key={i} className="wm-guide-step" data-n={`${i + 1}.`}>{s}</div>
        ))}
      </div>
      <div className="wm-divider" />
      <div className="wm-try-label">Try it — describe your workflow below</div>
      <textarea
        className="wm-textarea"
        placeholder={"Write each step on a new line:\n\nRep finishes a sales call\nOpens Salesforce, types notes from memory\nManager exports report every Monday\nReport sent to VP — rarely opened"}
        value={workflow}
        onChange={e => setWorkflow(e.target.value)}
        rows={7}
      />
      {error && <div className="wm-error">{error}</div>}
      <button
        className="wm-submit-btn"
        onClick={analyze}
        disabled={loading || lineCount < 2}
        style={{ background: lineCount >= 2 && !loading ? `linear-gradient(135deg, ${color}, ${colorLight})` : '#9ca3af' }}
      >
        {loading ? 'Analyzing…' : lineCount < 2 ? 'Add at least 2 steps' : 'Map this workflow →'}
      </button>
    </div>
  )
}
