export const GLOSSARY = {
  'RAG': 'Retrieval-Augmented Generation. Retrieves relevant document chunks from a knowledge base and passes them to the LLM as context. Good for large, unstructured knowledge — fails on exact lookups and frequently-changing content.',
  'RAG pipeline': 'The full system for retrieval-augmented generation: document ingestion, chunking, embedding, vector storage, retrieval, and LLM response generation. Each step is a potential failure point.',
  'MCP': 'Model Context Protocol. An open standard released by Anthropic in 2024 for connecting AI models to external tools and data. By 2026, every major AI provider adopted it — think USB-C for AI integrations.',
  'fine-tuning': 'Training a pre-trained model further on a smaller, task-specific dataset. Best for teaching consistent style or output format. Almost never the right tool for adding knowledge — use RAG for that.',
  'context window': 'The maximum amount of text an LLM can process in one request — its working memory. When it overflows, older content is silently dropped. The model won\'t tell you this happened.',
  'LLM': 'Large Language Model. An AI model trained on massive text datasets, capable of generating, summarizing, classifying, and reasoning about language. GPT-4.5, Claude, Gemini are all LLMs.',
  'agent': 'An AI system that can loop: use tools, check results, and take further actions to complete a goal — rather than just responding once to a prompt. More capable than a single call, and much more fragile.',
  'agentic': 'Describes AI systems that take sequences of actions autonomously, using tools and making decisions across multiple steps. The failure modes compound with each step.',
  'prompt': 'The input sent to an LLM — includes the instruction, context, examples, and constraints that shape the response. Prompt engineering is the practice of crafting effective inputs.',
  'token': 'The basic unit LLMs use to process text — roughly 0.75 words. All pricing, context window limits, and latency benchmarks are measured in tokens.',
  'PRD': 'Product Requirements Document. The traditional PM artifact describing what a product should do. Product Builders often replace the PRD with a working prototype — it answers questions the doc can\'t.',
  'latency': 'The time between sending a request to a model and receiving a complete response. For real-time user-facing features, anything over 2–3 seconds feels broken.',
  'embeddings': 'Numerical representations of text that capture semantic meaning. Similar texts produce similar embeddings, enabling similarity search — the core mechanism behind RAG.',
  'inference': 'Running a trained model to generate a response. This is where your compute costs come from at scale — distinct from training, which is a one-time cost.',
}

export function processBody(text) {
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length)
  let result = text
  terms.forEach(term => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // First occurrence only (no g flag), word boundary match
    result = result.replace(
      new RegExp(`\\b(${escaped})\\b`, 'i'),
      `<span class="gterm" data-term="${term}">$1<span class="gterm-dot"></span></span>`
    )
  })
  return result.replace(/\n/g, '<br/>')
}
