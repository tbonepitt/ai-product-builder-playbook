const OLLAMA_URL = 'https://ollama.com/api/chat'

const SYSTEM = `You are a workflow analysis assistant for an AI product management course.

Analyze the workflow steps provided and return a valid JSON object.

The JSON must have this exact structure:
{
  "steps": [
    {
      "text": "the original step text",
      "anatomy": "Input" or "Reasoning" or "Output" or "Action",
      "aiPossible": true or false,
      "aiReason": "one sentence explaining why this step is or isn't AI-possible"
    }
  ],
  "outputAnalysis": "2-3 sentences: where does the workflow's main output go? who receives it? what do they do with it? if unclear from the steps, note what to investigate.",
  "leverageSentence": "The real leverage is [describe step] because [what happens downstream if it's right or wrong]."
}

Anatomy definitions:
- Input: gathering information, collecting data, reading something, receiving a trigger
- Reasoning: making a judgment call, deciding, analyzing, interpreting, comparing
- Output: producing a deliverable, writing something, generating a result, creating a record
- Action: triggering a downstream process, sending something, updating a system, notifying someone

A step is AI-possible if it involves: looking something up, matching a pattern, drafting text, classifying input, extracting structured data, or summarizing information.`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { workflow } = req.body || {}
  if (!workflow || typeof workflow !== 'string' || workflow.trim().length < 10) {
    return res.status(400).json({ error: 'Invalid workflow input' })
  }

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
          { role: 'user', content: `Analyze this workflow:\n\n${workflow.trim()}` }
        ]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Ollama Cloud error:', err)
      throw new Error(`Ollama API returned ${response.status}`)
    }

    const ollamaData = await response.json()
    const data = JSON.parse(ollamaData.message.content)
    return res.status(200).json(data)
  } catch (e) {
    console.error('Workflow analysis error:', e)
    return res.status(500).json({ error: 'Analysis failed. Please try again.' })
  }
}
