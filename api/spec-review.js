const OLLAMA_URL = 'https://ollama.com/api/chat'

const SYSTEM = `You are an AI spec reviewer for a PM course on AI product management.

Review the provided AI spec and return ONLY a valid JSON object.

JSON structure:
{
  "context": { "rating": "Strong" or "Needs work" or "Missing", "feedback": "one sentence of specific feedback" },
  "instruction": { "rating": "Strong" or "Needs work" or "Missing", "feedback": "one sentence of specific feedback" },
  "outputContract": { "rating": "Strong" or "Needs work" or "Missing", "feedback": "one sentence of specific feedback" },
  "guardrail1": { "rating": "Strong" or "Needs work" or "Missing", "feedback": "one sentence of specific feedback" },
  "guardrail2": { "rating": "Strong" or "Needs work" or "Missing", "feedback": "one sentence of specific feedback" },
  "fallback": { "rating": "Strong" or "Needs work" or "Missing", "feedback": "one sentence of specific feedback" },
  "overall": "One sentence identifying the single biggest gap or the strongest part of this spec."
}

Rating criteria:
- Strong: clear, specific, actionable — an engineer could build from this
- Needs work: too vague, too broad, or missing a key detail
- Missing: not provided, essentially empty, or just restates the field label

Be direct and specific. This is a learning tool — point out exactly what's weak and what would make it stronger.`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { spec } = req.body || {}
  if (!spec || typeof spec !== 'object') {
    return res.status(400).json({ error: 'Invalid spec input' })
  }

  const specText = `
Context: ${spec.context || '(empty)'}
Instruction: ${spec.instruction || '(empty)'}
Output contract: ${spec.outputContract || '(empty)'}
Guardrail 1: ${spec.guardrail1 || '(empty)'}
Guardrail 2: ${spec.guardrail2 || '(empty)'}
Fallback: ${spec.fallback || '(empty)'}
`.trim()

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen3.5:latest',
        format: 'json',
        stream: false,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: `Review this AI spec:\n\n${specText}` }
        ]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Ollama error:', err)
      throw new Error(`Ollama API returned ${response.status}`)
    }

    const ollamaData = await response.json()
    const data = JSON.parse(ollamaData.message.content)
    return res.status(200).json(data)
  } catch (e) {
    console.error('Spec review error:', e)
    return res.status(500).json({ error: 'Review failed. Please try again.' })
  }
}
