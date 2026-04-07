import { useState } from 'react'

const TOOLS = [
  { name: 'Claude.ai', icon: '🤖', desc: 'Describe what you want built. Paste your spec. Get a working prototype, script, or tool in one prompt.', url: 'https://claude.ai', cta: 'Open Claude.ai' },
  { name: 'Lovable.dev', icon: '🎨', desc: 'Describe a UI in plain English, get working React code instantly. Front-end in under 15 minutes.', url: 'https://lovable.dev', cta: 'Open Lovable' },
  { name: 'n8n.io', icon: '⚙️', desc: 'Visual workflow builder with native AI nodes. Connect any API, test full automations without writing code.', url: 'https://n8n.io', cta: 'Open n8n' },
  { name: 'Make.com', icon: '🔗', desc: 'Automate multi-step processes between real apps. Test if the full workflow actually works end-to-end.', url: 'https://make.com', cta: 'Open Make' },
]

function loadArtifacts() {
  try {
    const m1 = JSON.parse(localStorage.getItem('aipb-m1-workflow') || 'null')
    return { m1 }
  } catch { return { m1: null } }
}

function FirstPrompt({ leverage }) {
  const [copied, setCopied] = useState(false)
  const prompt = leverage
    ? `I'm a PM building an AI product. I've mapped a workflow and found that: "${leverage}"\n\nHelp me build a simple prototype that automates this step. Start by asking me what tools my team already uses, then suggest the simplest possible implementation.`
    : `I'm a PM learning to build AI products. I've just completed a course on AI product management and I want to build my first prototype. Help me get started by asking me 3 questions about my current role and what workflows I'd like to automate.`

  const copy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="nb-prompt-box">
      <div className="nb-prompt-label">Your first prompt — paste this into Claude.ai</div>
      <div className="nb-prompt-text">{prompt}</div>
      <div className="nb-prompt-actions">
        <button className="nb-copy-btn" onClick={copy}>{copied ? '✓ Copied' : 'Copy prompt'}</button>
        <a className="nb-open-btn" href="https://claude.ai" target="_blank" rel="noopener noreferrer">Open Claude.ai →</a>
      </div>
    </div>
  )
}

export default function NowBuild({ onBack }) {
  const { m1 } = loadArtifacts()

  return (
    <div className="nb-page">
      <div className="nb-header">
        <button className="back-btn" onClick={onBack}>← Home</button>
        <div className="nb-hero">
          <div className="nb-hero-icon">🚀</div>
          <h1 className="nb-hero-title">Now go build something.</h1>
          <p className="nb-hero-sub">The frameworks are in your head. The tools are free. Here's your first move.</p>
        </div>
      </div>

      <div className="nb-content">

        {/* Artifacts */}
        <div className="nb-section">
          <div className="nb-section-title">What you built in this course</div>
          {m1 ? (
            <div className="nb-artifact">
              <div className="nb-artifact-label">📍 Your leverage point — Module 1</div>
              <div className="nb-artifact-text">"{m1.leverageSentence}"</div>
              {m1.aiSteps.length > 0 && (
                <div className="nb-artifact-steps">
                  <div className="nb-artifact-steps-label">AI-possible steps you identified:</div>
                  {m1.aiSteps.map((s, i) => <div key={i} className="nb-artifact-step">⚡ {s}</div>)}
                </div>
              )}
            </div>
          ) : (
            <div className="nb-artifact nb-artifact-empty">
              <div className="nb-artifact-label">📍 Workflow map — Module 1</div>
              <div className="nb-artifact-text nb-empty-text">Go back to Module 1 and complete the workflow mapper to see your leverage point here.</div>
            </div>
          )}
        </div>

        {/* First prompt */}
        <div className="nb-section">
          <div className="nb-section-title">Your first build — start here</div>
          <FirstPrompt leverage={m1?.leverageSentence} />
        </div>

        {/* Toolkit */}
        <div className="nb-section">
          <div className="nb-section-title">Your free toolkit</div>
          <div className="nb-tools">
            {TOOLS.map(tool => (
              <div key={tool.name} className="nb-tool">
                <div className="nb-tool-icon">{tool.icon}</div>
                <div className="nb-tool-body">
                  <div className="nb-tool-name">{tool.name}</div>
                  <div className="nb-tool-desc">{tool.desc}</div>
                </div>
                <a className="nb-tool-link" href={tool.url} target="_blank" rel="noopener noreferrer">{tool.cta} →</a>
              </div>
            ))}
          </div>
        </div>

        {/* The loop */}
        <div className="nb-loop">
          <div className="nb-loop-title">The loop that matters</div>
          <div className="nb-loop-steps">
            <div className="nb-loop-step"><span className="nb-loop-n">1</span><span>Pick the workflow you mapped in Module 1</span></div>
            <div className="nb-loop-arrow">↓</div>
            <div className="nb-loop-step"><span className="nb-loop-n">2</span><span>Paste your spec into Claude.ai and ask for a prototype</span></div>
            <div className="nb-loop-arrow">↓</div>
            <div className="nb-loop-step"><span className="nb-loop-n">3</span><span>Test it on 5 real examples — document what breaks</span></div>
            <div className="nb-loop-arrow">↓</div>
            <div className="nb-loop-step"><span className="nb-loop-n">4</span><span>Screenshot the result. That's portfolio piece #1.</span></div>
          </div>
        </div>

      </div>
    </div>
  )
}
