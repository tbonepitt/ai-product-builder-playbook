import { useState } from 'react'
import AnalyzingIndicator from './AnalyzingIndicator'

const WF_STEPS = [
  { icon: '📋', text: 'Reading workflow steps…' },
  { icon: '🔍', text: 'Mapping Input, Reasoning, Output, Action…' },
  { icon: '⚡', text: 'Identifying AI-possible steps…' },
  { icon: '🔁', text: 'Following the output downstream…' },
  { icon: '🎯', text: 'Finding the leverage point…' },
]

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

// Pre-computed — no API call needed for the guided example
const CANNED_RESULT = {
  steps: [
    { text: "Customer submits a support ticket via email", anatomy: "Input", aiPossible: false, aiReason: "This is a human-initiated trigger — the customer's action, not something AI intercepts or replaces." },
    { text: "Support rep reads the email and categorizes the issue type", anatomy: "Reasoning", aiPossible: true, aiReason: "Classifying unstructured text into issue categories is a core AI use case." },
    { text: "Rep searches the knowledge base for a matching solution", anatomy: "Input", aiPossible: true, aiReason: "Semantic search and retrieval from a knowledge base is faster and more thorough than manual search." },
    { text: "Rep drafts a reply from scratch based on what they found", anatomy: "Reasoning", aiPossible: true, aiReason: "Drafting a contextual reply from retrieved information is exactly what LLMs do well." },
    { text: "Rep sends reply and updates the ticket status in Zendesk", anatomy: "Action", aiPossible: true, aiReason: "Once a reply is drafted and approved, sending and status updates can be fully automated." },
    { text: "Weekly report of ticket volume and resolution time sent to the VP", anatomy: "Output", aiPossible: false, aiReason: "Generating the report could be automated — but if the VP never acts on it, automating its creation changes nothing." }
  ],
  outputAnalysis: "The reply goes directly to the customer and resolves their issue — high-value output. The weekly report goes to the VP, but there's no indication it drives decisions. If the VP rarely acts on it, automating report generation solves nothing. The real downstream value is resolution speed and customer experience.",
  leverageSentence: "The real leverage is the knowledge base search (step 3) because if the rep finds the right answer fast, the reply is accurate and the ticket closes — if they can't, every downstream step degrades and the customer waits."
}


export default function WorkflowMapper({ color, colorLight }) {
  const [phase, setPhase] = useState('guided')
  const [userMarks, setUserMarks] = useState({})
  const [ownOpen, setOwnOpen] = useState(false)
  const [ownSteps, setOwnSteps] = useState([
    { text: '', aiPossible: false },
    { text: '', aiPossible: false },
    { text: '', aiPossible: false },
  ])
  const [ownUserMarks, setOwnUserMarks] = useState({})
  const [ownResult, setOwnResult] = useState(null)
  const [ownLoading, setOwnLoading] = useState(false)
  const [ownError, setOwnError] = useState(null)

  const allMarked = EXAMPLE_STEPS.every((_, i) => userMarks[i] !== undefined)
  const mark = (i, val) => setUserMarks(m => ({ ...m, [i]: val }))

  const filledSteps = ownSteps.filter(s => s.text.trim())
  const addStep = () => setOwnSteps(s => [...s, { text: '', aiPossible: false }])
  const updateStep = (i, field, val) => setOwnSteps(s => s.map((step, idx) => idx === i ? { ...step, [field]: val } : step))
  const removeStep = (i) => setOwnSteps(s => s.filter((_, idx) => idx !== i))

  const submitOwn = async () => {
    if (filledSteps.length < 2) return
    setOwnLoading(true)
    setOwnError(null)
    // Save user's AI-possible marks before API call
    const marks = {}
    filledSteps.forEach((s, i) => { marks[i] = s.aiPossible })
    setOwnUserMarks(marks)
    try {
      const res = await fetch('/api/workflow-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow: filledSteps.map(s => s.text).join('\n') })
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setOwnResult(data)
      try {
        localStorage.setItem('aipb-m1-workflow', JSON.stringify({
          leverageSentence: data.leverageSentence,
          aiSteps: data.steps.filter(s => s.aiPossible).map(s => s.text),
          allSteps: data.steps.map(s => s.text)
        }))
      } catch (_) {}
    } catch (e) {
      setOwnError('Something went wrong. Try again.')
    } finally {
      setOwnLoading(false)
    }
  }

  const getScore = (steps, marks) => {
    let correct = 0
    steps.forEach((step, i) => {
      if (marks[i] === step.aiPossible) correct++
    })
    return { correct, total: steps.length }
  }

  const ResultSteps = ({ steps, marks }) => (
    <div className="wm-steps-list">
      {steps.map((step, i) => {
        const userWasRight = marks[i] === step.aiPossible
        return (
          <div key={i} className={`wm-step${step.aiPossible ? ' wm-ai' : ''}`}>
            <div className="wm-step-meta">
              <span className="wm-anatomy" style={{ background: ANATOMY_COLORS[step.anatomy] || color }}>{step.anatomy}</span>
              {step.aiPossible && <span className="wm-ai-badge">⚡ AI-possible</span>}
              <span className={`wm-check ${userWasRight ? 'right' : 'wrong'}`}>
                {userWasRight ? '✓ Correct' : `✗ You said: ${marks[i] ? 'AI' : 'Not AI'}`}
              </span>
            </div>
            <div className="wm-step-text">{step.text}</div>
            <div className="wm-step-reason">{step.aiReason}</div>
          </div>
        )
      })}
    </div>
  )

  // ── PHASE: GUIDED ─────────────────────────────────────────────
  if (phase === 'guided') return (
    <div className="wm-guided">
      <div className="wm-try-label">Support ticket workflow — which steps could AI handle?</div>
      <div className="wm-guided-sub">Mark each step, then see the analysis.</div>
      <div className="wm-guided-steps">
        {EXAMPLE_STEPS.map((step, i) => (
          <div key={i} className="wm-guided-step">
            <div className="wm-guided-step-text">{step}</div>
            <div className="wm-guided-btns">
              <button className={`wm-mark-btn wm-ai-btn${userMarks[i] === true ? ' selected' : ''}`} onClick={() => mark(i, true)}>⚡ AI-possible</button>
              <button className={`wm-mark-btn wm-no-btn${userMarks[i] === false ? ' selected' : ''}`} onClick={() => mark(i, false)}>Not AI</button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="wm-submit-btn"
        onClick={() => setPhase('results')}
        disabled={!allMarked}
        style={{ background: allMarked ? `linear-gradient(135deg, ${color}, ${colorLight})` : '#9ca3af' }}
      >
        {!allMarked ? `Mark all steps (${Object.keys(userMarks).length}/${EXAMPLE_STEPS.length})` : 'See the analysis →'}
      </button>
    </div>
  )

  // ── PHASE: RESULTS ─────────────────────────────────────────────
  if (phase === 'results') {
    const score = getScore(CANNED_RESULT.steps, userMarks)
    return (
      <div className="wm-result">
        <div className="wm-score" style={{ borderColor: color }}>
          <span className="wm-score-num" style={{ color }}>{score.correct}/{score.total}</span>
          <span className="wm-score-label">steps correctly identified</span>
        </div>
        <ResultSteps steps={CANNED_RESULT.steps} marks={userMarks} />
        <div className="wm-output-block">
          <div className="wm-section-label">Following the output</div>
          <div className="wm-output-text">{CANNED_RESULT.outputAnalysis}</div>
        </div>
        <div className="wm-leverage-block" style={{ borderColor: color }}>
          <div className="wm-section-label" style={{ color }}>The leverage point</div>
          <div className="wm-leverage-text">{CANNED_RESULT.leverageSentence}</div>
        </div>

        <div className="wm-divider" />

        {!ownOpen ? (
          <button className="wm-own-cta" onClick={() => setOwnOpen(true)} style={{ borderColor: color, color }}>
            + Map your own workflow
          </button>
        ) : !ownResult ? (
          <>
            <div className="wm-try-label">Your workflow</div>
            <div className="wm-guided-sub">Write each step and mark whether it's AI-possible.</div>
            <div className="wm-own-steps">
              {ownSteps.map((step, i) => (
                <div key={i} className="wm-own-row">
                  <input
                    className="wm-own-input"
                    placeholder={`Step ${i + 1}…`}
                    value={step.text}
                    onChange={e => updateStep(i, 'text', e.target.value)}
                  />
                  <label className="wm-own-check">
                    <input
                      type="checkbox"
                      checked={step.aiPossible}
                      onChange={e => updateStep(i, 'aiPossible', e.target.checked)}
                    />
                    <span>⚡ AI-possible</span>
                  </label>
                  {ownSteps.length > 2 && (
                    <button className="wm-own-remove" onClick={() => removeStep(i)}>×</button>
                  )}
                </div>
              ))}
            </div>
            {ownSteps.length < 8 && (
              <button className="wm-add-step" onClick={addStep}>+ Add step</button>
            )}
            {ownError && <div className="wm-error">{ownError}</div>}
            {ownLoading
              ? <AnalyzingIndicator color={color} steps={WF_STEPS} />
              : <button
                  className="wm-submit-btn"
                  onClick={submitOwn}
                  disabled={filledSteps.length < 2}
                  style={{ background: filledSteps.length >= 2 ? `linear-gradient(135deg, ${color}, ${colorLight})` : '#9ca3af', marginTop: 10 }}
                >
                  {filledSteps.length < 2 ? 'Add at least 2 steps' : 'Map this workflow →'}
                </button>
            }
          </>
        ) : (
          <>
            <div className="wm-score" style={{ borderColor: color }}>
              <span className="wm-score-num" style={{ color }}>{getScore(ownResult.steps, ownUserMarks).correct}/{ownResult.steps.length}</span>
              <span className="wm-score-label">steps correctly identified</span>
            </div>
            <ResultSteps steps={ownResult.steps} marks={ownUserMarks} />
            <div className="wm-output-block">
              <div className="wm-section-label">Following the output</div>
              <div className="wm-output-text">{ownResult.outputAnalysis}</div>
            </div>
            <div className="wm-leverage-block" style={{ borderColor: color }}>
              <div className="wm-section-label" style={{ color }}>Your leverage point</div>
              <div className="wm-leverage-text">{ownResult.leverageSentence}</div>
            </div>
            <button className="wm-reset-btn" onClick={() => { setOwnResult(null); setOwnSteps([{ text: '', aiPossible: false }, { text: '', aiPossible: false }, { text: '', aiPossible: false }]) }}>
              ← Try a different workflow
            </button>
          </>
        )}
      </div>
    )
  }

  return null
}
