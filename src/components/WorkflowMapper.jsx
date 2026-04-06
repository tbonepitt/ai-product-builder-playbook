import { useState } from 'react'

const ANATOMY_COLORS = {
  Input: '#0284c7',
  Reasoning: '#7c3aed',
  Output: '#0891b2',
  Action: '#16a34a'
}

const EXAMPLE_STEPS = [
  "Customer submits a support ticket via email",
  "Support rep reads the email and categorizes the issue type",
  "Rep searches the knowledge base for a matching solution",
  "Rep drafts a reply from scratch based on what they found",
  "Rep sends reply and updates the ticket status in Zendesk",
  "Weekly report of ticket volume and resolution time sent to the VP"
]

export default function WorkflowMapper({ color, colorLight }) {
  const [phase, setPhase] = useState('guided') // 'guided' | 'results' | 'own'
  const [userMarks, setUserMarks] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ownWorkflow, setOwnWorkflow] = useState('')
  const [ownResult, setOwnResult] = useState(null)
  const [ownLoading, setOwnLoading] = useState(false)
  const [ownError, setOwnError] = useState(null)
  const [ownOpen, setOwnOpen] = useState(false)

  const allMarked = EXAMPLE_STEPS.every((_, i) => userMarks[i] !== undefined)
  const ownLineCount = ownWorkflow.split('\n').filter(l => l.trim()).length

  const mark = (i, val) => setUserMarks(m => ({ ...m, [i]: val }))

  const submitGuided = async () => {
    if (!allMarked) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/workflow-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow: EXAMPLE_STEPS.join('\n') })
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setPhase('results')
    } catch (e) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitOwn = async () => {
    if (ownLineCount < 2) return
    setOwnLoading(true)
    setOwnError(null)
    try {
      const res = await fetch('/api/workflow-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow: ownWorkflow })
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setOwnResult(data)
    } catch (e) {
      setOwnError('Something went wrong. Try again.')
    } finally {
      setOwnLoading(false)
    }
  }

  // Score: how many did user get right vs Claude
  const getScore = () => {
    if (!result) return null
    let correct = 0
    result.steps.forEach((step, i) => {
      if (userMarks[i] === step.aiPossible) correct++
    })
    return { correct, total: result.steps.length }
  }

  // ── PHASE: GUIDED ──────────────────────────────────────────────
  if (phase === 'guided') return (
    <div className="wm-guided">
      <div className="wm-guided-intro">
        <div className="wm-try-label">Support ticket workflow — which steps could AI handle?</div>
        <div className="wm-guided-sub">Mark each step before we show you the analysis.</div>
      </div>
      <div className="wm-guided-steps">
        {EXAMPLE_STEPS.map((step, i) => (
          <div key={i} className="wm-guided-step">
            <div className="wm-guided-step-text">{step}</div>
            <div className="wm-guided-btns">
              <button
                className={`wm-mark-btn wm-ai-btn${userMarks[i] === true ? ' selected' : ''}`}
                onClick={() => mark(i, true)}
              >⚡ AI-possible</button>
              <button
                className={`wm-mark-btn wm-no-btn${userMarks[i] === false ? ' selected' : ''}`}
                onClick={() => mark(i, false)}
              >Not AI</button>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="wm-error">{error}</div>}
      <button
        className="wm-submit-btn"
        onClick={submitGuided}
        disabled={!allMarked || loading}
        style={{ background: allMarked && !loading ? `linear-gradient(135deg, ${color}, ${colorLight})` : '#9ca3af' }}
      >
        {loading ? 'Analyzing…' : !allMarked ? `Mark all steps first (${Object.keys(userMarks).length}/${EXAMPLE_STEPS.length})` : 'See the analysis →'}
      </button>
    </div>
  )

  // ── PHASE: RESULTS ─────────────────────────────────────────────
  if (phase === 'results' && result) {
    const score = getScore()
    return (
      <div className="wm-result">
        <div className="wm-score" style={{ borderColor: color }}>
          <span className="wm-score-num" style={{ color }}>{score.correct}/{score.total}</span>
          <span className="wm-score-label">steps correctly identified</span>
        </div>
        <div className="wm-steps-list">
          {result.steps.map((step, i) => {
            const userWasRight = userMarks[i] === step.aiPossible
            return (
              <div key={i} className={`wm-step${step.aiPossible ? ' wm-ai' : ''}`}>
                <div className="wm-step-meta">
                  <span className="wm-anatomy" style={{ background: ANATOMY_COLORS[step.anatomy] || color }}>
                    {step.anatomy}
                  </span>
                  {step.aiPossible && <span className="wm-ai-badge">⚡ AI-possible</span>}
                  <span className={`wm-check ${userWasRight ? 'right' : 'wrong'}`}>
                    {userWasRight ? '✓ You got it' : `✗ You marked: ${userMarks[i] ? 'AI-possible' : 'Not AI'}`}
                  </span>
                </div>
                <div className="wm-step-text">{step.text}</div>
                <div className="wm-step-reason">{step.aiReason}</div>
              </div>
            )
          })}
        </div>
        <div className="wm-output-block">
          <div className="wm-section-label">Following the output</div>
          <div className="wm-output-text">{result.outputAnalysis}</div>
        </div>
        <div className="wm-leverage-block" style={{ borderColor: color }}>
          <div className="wm-section-label" style={{ color }}>The leverage point</div>
          <div className="wm-leverage-text">{result.leverageSentence}</div>
        </div>

        <div className="wm-divider" />

        {!ownOpen ? (
          <button className="wm-own-cta" onClick={() => setOwnOpen(true)} style={{ borderColor: color, color }}>
            + Map your own workflow
          </button>
        ) : !ownResult ? (
          <>
            <div className="wm-try-label">Your workflow</div>
            <div className="wm-guided-sub">Use something from your current job or a product you know well.</div>
            <textarea
              className="wm-textarea"
              placeholder={"Write each step on a new line — include the annoying ones too."}
              value={ownWorkflow}
              onChange={e => setOwnWorkflow(e.target.value)}
              rows={6}
              autoFocus
            />
            {ownError && <div className="wm-error">{ownError}</div>}
            <button
              className="wm-submit-btn"
              onClick={submitOwn}
              disabled={ownLoading || ownLineCount < 2}
              style={{ background: ownLineCount >= 2 && !ownLoading ? `linear-gradient(135deg, ${color}, ${colorLight})` : '#9ca3af' }}
            >
              {ownLoading ? 'Analyzing…' : ownLineCount < 2 ? 'Add at least 2 steps' : 'Map this workflow →'}
            </button>
          </>
        ) : (
          <>
            <div className="wm-section-label">Your workflow, mapped</div>
            <div className="wm-steps-list">
              {ownResult.steps.map((step, i) => (
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
              <div className="wm-output-text">{ownResult.outputAnalysis}</div>
            </div>
            <div className="wm-leverage-block" style={{ borderColor: color }}>
              <div className="wm-section-label" style={{ color }}>Your leverage point</div>
              <div className="wm-leverage-text">{ownResult.leverageSentence}</div>
            </div>
            <button className="wm-reset-btn" onClick={() => { setOwnResult(null); setOwnWorkflow('') }}>
              ← Try a different workflow
            </button>
          </>
        )}
      </div>
    )
  }

  return null
}
