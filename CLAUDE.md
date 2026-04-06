# AI Product Builder Playbook — Claude Code Context

## What this project is

A self-paced microlearning course on AI Product Management, built in the style of Imprint (tap-forward cards, quizzes, progress tracking). Currently a single self-contained HTML file. The goal is to convert it into a proper Vite + React project, deploy it publicly, and continue building new features.

**Primary user:** Tyler (the owner). Built first for personal learning, then potentially to sell.

**Core premise:** Most PM courses teach vocabulary. This one teaches judgment — real decisions, messy scenarios, failure modes. The target is a PM trying to transition into an AI-native PM role ("Product Builder").

---

## Current tech stack

- Single HTML file: `ai-product-builder-course.html`
- React 18.2.0 via CDN (unpkg)
- Babel Standalone 7.23.5 via CDN (transpiles JSX in-browser)
- Google Fonts: Inter
- Zero build step, zero dependencies — opens directly in a browser
- State: in-memory React `useState` only (no localStorage)

---

## Current state of the course

**8 modules, ~95 min total:**

| # | Module | Color | Cards |
|---|--------|-------|-------|
| 0 | The Pivot | `#7c3aed` | 6 |
| 1 | Workflow Thinking | `#0284c7` | 7 |
| 2 | AI System Design | `#0891b2` | 9 |
| 3 | Rapid Prototyping | `#d97706` | 6 |
| 4 | Evaluation Systems | `#dc2626` | 7 |
| 5 | Cost + Latency | `#7c3aed` | 6 |
| 6 | Agentic AI | `#0f766e` | 10 |
| 7 | End-to-End Ownership | `#16a34a` | 6 |

**Card types implemented:** `hook`, `concept`, `comparison`, `list`, `steps`, `quote`, `build`, `quiz`

**Design:** Warm cream background (`#FAF7F2`), white elevated cards with box-shadow, Inter font, each module has a distinct accent color.

**What was intentionally removed:**
- Interview Moment cards (removed from all modules — may be re-added as a standalone bonus module)
- "Product Builder Certification" badge / "Interview-ready" branding

---

## Key components (all in one file currently)

- `App` — top-level state: screen (`home` | `lesson`), activeId, completed set
- `Home` — module grid, overall progress bar, finish banner
- `Lesson` — card-by-card view, top progress bar, nav dots, Continue button
- `CardView` — renders correct layout based on `card.type`
- `QuizCard` — handles answer selection, shows explanation, fires `onAnswered` callback

---

## Immediate next steps (in priority order)

1. **Convert to Vite + React project** — break into component files, set up `npm run dev`, keep all content and styling exactly as-is
2. **Add a Bonus module: "How to Talk About This Work"** — collects the interview positioning lines that were removed from the main modules; optional, appears after completing all 8 modules
3. **Deploy to Vercel** — connect GitHub repo, get a public URL
4. **Add progress persistence** — localStorage so progress survives page refresh (this was intentionally excluded from the HTML prototype due to browser env constraints)
5. **Consider: "Bring Your Company Along" module** — content for PMs at non-AI-native companies who need to make the internal case for AI adoption

---

## Content principles (do not change without reason)

- Every hook card opens with a scenario that went wrong — not a motivational statement
- Every quiz tests judgment in a messy scenario — not recall of a definition just taught
- Concept cards lead with the failure/cost/tradeoff, then explain the concept through that lens
- Build cards are executable on a personal device with free tools (Claude.ai, Lovable, n8n, Make)
- No MBA jargon. Tyler's voice is direct, a little blunt, no fluff.

---

## Tyler's context (relevant for content decisions)

- Currently a PM at a company with restricted AI tool access (Microsoft Copilot free only)
- Uses personal devices for AI work (Claude.ai, etc.)
- Goal: transition to an AI-native PM role at a company that actually uses AI
- Course reflects his own learning path — built for himself first, structured to sell later
- Prefers depth over breadth. "This isn't something I read while I'm on the shitter."

---

## Conventions

- Module colors are fixed — don't change them without updating both the `color` and `colorLight` fields
- All card content lives in the `MODULES` array — no content is hardcoded in components
- The `body` field in concept cards uses `\n` for line breaks (renderer converts to `<br/>`) and raw HTML `<b>` tags for bold
- Quiz `correct` field is the `id` string of the correct option (`"a"`, `"b"`, `"c"`, or `"d"`)
- Keep card count per module between 6–11 cards
