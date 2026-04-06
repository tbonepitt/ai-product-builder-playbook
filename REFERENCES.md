# References & Links

All external links used in building, designing, or referenced within this project.

---

## CDN Dependencies (loaded by the HTML file)

| Library | Version | URL |
|---------|---------|-----|
| React | 18.2.0 | https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js |
| ReactDOM | 18.2.0 | https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js |
| Babel Standalone | 7.23.5 | https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js |
| Inter (Google Fonts) | — | https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap |

---

## Design Inspiration

| Source | URL | Notes |
|--------|-----|-------|
| Imprint | https://www.imprintapp.com | Microlearning card format, tap-forward UX, warm color palette |

---

## Content Research & References

| Source | URL | Notes |
|--------|-----|-------|
| Maven AI PM Course | https://maven.com/product-faculty/ai-product-management-certification | Reviewed for competitive context only — all course content is original |
| Karpathy LLM Wiki (gist) | https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f | Karpathy's approach to structured markdown wikis as an alternative to RAG for mid-sized knowledge bases — referenced in Module 2 (AI System Design) and Module 6 (Agentic AI) |
| Apollo CPO on Product Builders | https://www.linkedin.com/in/leifmendez | Apollo CPO's hiring post on "Product Builders" — referenced in Module 0 framing |
| Anthropic MCP Announcement | https://www.anthropic.com/news/model-context-protocol | Model Context Protocol — referenced in Modules 2 and 6 |

---

## Tools Referenced in Course Content

These are tools students are directed to use in the Build It exercises:

| Tool | URL | Used in |
|------|-----|---------|
| Claude.ai | https://claude.ai | Modules 3, 7 — prototyping and building |
| Lovable | https://lovable.dev | Modules 3, 7 — front-end prototyping |
| n8n | https://n8n.io | Module 3 — workflow automation |
| Make | https://make.com | Module 3 — workflow automation |

---

## Deployment Options (discussed, not yet implemented)

| Platform | URL | Notes |
|----------|-----|-------|
| Netlify Drop | https://app.netlify.com/drop | Drag-and-drop deploy for the single HTML file — no account required |
| Vercel | https://vercel.com | Preferred path once converted to Vite + React — connects to GitHub for auto-deploy |
| GitHub | https://github.com | Version control + source for Vercel deployment |

---

## Next Build Tools (for Vite conversion)

| Tool | URL | Notes |
|------|-----|-------|
| Vite | https://vitejs.dev | Build tool for converting to proper React project |
| Node.js (LTS) | https://nodejs.org | Required to run Vite and Claude Code |
| Claude Code | https://docs.anthropic.com/en/docs/claude-code | CLI for agentic development — next step for this project |

---

## Future References

### Technical — React Project Build-Out

| Resource | URL | When you'll need it |
|----------|-----|---------------------|
| React Docs | https://react.dev | Component patterns, hooks reference during Vite conversion |
| Vite Guide | https://vitejs.dev/guide | Project setup, config, environment variables |
| React Router | https://reactrouter.com | If adding multi-page routing (e.g. `/module/3`) |
| Tailwind CSS | https://tailwindcss.com | If switching from custom CSS to utility classes — speeds up styling iteration |
| shadcn/ui | https://ui.shadcn.com | Pre-built accessible components (cards, buttons, progress bars) built on Tailwind |
| Framer Motion | https://www.framer.com/motion | Smoother card transition animations — drop-in for existing slideIn/fadeUp |

---

### Progress Persistence

| Resource | URL | When you'll need it |
|----------|-----|---------------------|
| MDN: localStorage | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage | Saving module completion state across page refreshes — top of the roadmap |
| Zustand | https://zustand-demo.pmnd.rs | Lightweight state management if state grows beyond localStorage + useState |

---

### Deployment & Analytics

| Resource | URL | When you'll need it |
|----------|-----|---------------------|
| Vercel Docs | https://vercel.com/docs | Full deployment reference — environment vars, custom domains, preview URLs |
| GitHub Docs | https://docs.github.com | Repo setup, branching, connecting to Vercel |
| Plausible Analytics | https://plausible.io | Privacy-friendly analytics — see which modules users complete, where they drop off |
| PostHog | https://posthog.com | Product analytics + session replay — useful once you have real learners using the course |

---

### Selling the Course

| Resource | URL | When you'll need it |
|----------|-----|---------------------|
| Gumroad | https://gumroad.com | Simplest path to selling — one-time payment, instant setup, no storefront needed |
| Lemon Squeezy | https://lemonsqueezy.com | Gumroad alternative with better EU tax handling and a cleaner checkout |
| Stripe | https://stripe.com | If building a custom payment flow directly into the site |
| Testimonial | https://testimonial.to | Collect and embed video/text testimonials — useful once early learners finish the course |

---

### Keeping Course Content Current

The AI PM space moves fast. These are the sources worth watching to keep module content accurate:

| Source | URL | Relevant modules |
|--------|-----|-----------------|
| Anthropic Model Docs | https://docs.anthropic.com/en/docs/about-claude/models | Module 5 (Cost + Latency) — pricing and model names change frequently |
| Anthropic Agent Docs | https://docs.anthropic.com/en/docs/build-with-claude/agents | Module 6 (Agentic AI) |
| MCP Documentation | https://modelcontextprotocol.io | Module 2 (AI System Design), Module 6 (Agentic AI) |
| OpenAI Pricing | https://openai.com/pricing | Module 5 — cost comparison context |
| Latent Space Podcast | https://www.latent.space | General AI depth — good for staying current on agentic patterns |
| Lenny's Newsletter | https://www.lennysnewsletter.com | PM + AI intersection — good for validating course framing against market |
| AI Snake Oil (blog) | https://www.aisnakeoil.com | Balanced skeptic perspective — useful for keeping quiz scenarios grounded in real failures |

---

### Competitive Landscape

| Course/Product | URL | Notes |
|---------------|-----|-------|
| Maven AI PM Course | https://maven.com/product-faculty/ai-product-management-certification | Primary competitor — vocabulary-focused, cohort-based, $1,500+ |
| Reforge AI Track | https://www.reforge.com | Enterprise PM upskilling — expensive, broad, not builder-focused |
| DeepLearning.AI for PMs | https://www.deeplearning.ai | Technical depth but engineering-oriented, not PM workflow-oriented |
| Product School AI | https://productschool.com | Large audience, surface-level AI content — good gap to differentiate against |
