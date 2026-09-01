# Census 2027 — Digital Enumeration

A GenAI-powered web app explaining and guiding users through India's Census 2027, its first fully
digital census.

**Live demo:** _add your Vercel URL here after deploying_

## What it does

| Requirement | Where |
|---|---|
| Explains the two phases and what each collects | `/phases` |
| State-wise self-enumeration & survey dates | `/dates` (searchable, filterable by region) |
| Guides users through self-enumeration | `/wizard` — step tracker + Gemini-powered chat guide |
| Addresses privacy & misinformation | `/privacy` — confidentiality explainer + myth-vs-fact accordion |
| Visualises census data meaningfully | `/data` — 5 charts (Recharts): population growth, literacy by state, urban/rural split, sex ratio trend, age distribution |
| Multiple Indian languages | Language switcher in the navbar — English, Hindi, Marathi, Tamil, Bengali |

## Tech stack

- **React 19 + TypeScript + Vite** — build tooling
- **Tailwind CSS v4** — styling
- **React Router** — client-side routing
- **Recharts** — data visualization
- **Google Gemini API** (`gemini-2.0-flash`) — powers the self-enumeration chat guide in `src/lib/gemini.ts`
- **Vitest** — unit tests (`src/lib/__tests__`, `src/data/__tests__`)
- **GitHub Actions** — CI running lint, tests, and build on every push (`.github/workflows/ci.yml`)

## Data & disclaimers

All state dates and census statistics are **illustrative sample data** for demo purposes — not
official Census of India figures. This is clearly stated in the app footer and on the Data Explorer
page.

## Google services used

- **Gemini API** — self-enumeration guide chatbot, called from `api/gemini.ts` (a Vercel
  serverless function) and never from the browser directly
- App is deployable on **Vercel** with zero configuration

The chat guide gracefully falls back to a rule-based offline mode when the AI service is
unavailable (e.g. no `GEMINI_API_KEY` configured), so the app remains fully functional and
testable without a live key.

## Local setup

```bash
npm install
cp .env.example .env.local   # then add your Gemini API key as GEMINI_API_KEY (server-side, not VITE_)
npm run dev
```

**Note:** the `/api/gemini` serverless function only runs under Vercel's runtime, not the plain
Vite dev server. For full local testing including the AI guide, use `npx vercel dev` instead of
`npm run dev` (requires the Vercel CLI: `npm i -g vercel`, then `vercel dev`). `npm run dev` still
works for everything else — the chat guide just falls back to offline demo answers.

## Scripts

```bash
npm run dev          # local dev server
npm run build        # type-check + production build
npm run test          # run unit tests once
npm run test:watch     # run unit tests in watch mode
npm run lint            # lint
```

## Deployment

### Vercel
1. Push this repo to GitHub.
2. Import the repo in Vercel — it auto-detects Vite, no config needed.
3. Add environment variable `GEMINI_API_KEY` (no `VITE_` prefix) in Vercel project settings.
4. Deploy.

### Getting a Gemini API key
Get a free key at https://aistudio.google.com/app/apikey

## Accessibility

- Semantic HTML (`<nav>`, `<table>`, `<caption>`, `<th scope>`)
- Skip-to-content link
- ARIA labels on interactive controls (menu toggle, accordions, step tracker)
- Keyboard-navigable throughout, visible focus rings
- Chat log uses `aria-live="polite"` for screen reader updates

## Security notes

- **Gemini API key never reaches the client.** It's read server-side in `api/gemini.ts` via
  `process.env.GEMINI_API_KEY` (deliberately no `VITE_` prefix, which would bundle it into public
  client JS). The client only calls the same-origin `/api/gemini` proxy.
- Basic per-IP rate limiting and input-length validation on the proxy endpoint to limit abuse of
  the AI quota.
- `.env.local` is git-ignored, `.env.example` documents required vars without real values.
- Errors from the upstream AI service are caught and never expose internals (stack traces, raw
  API errors) to the client.
- No PII is actually collected or stored — the enumeration wizard is a demo flow only.
# Promptxwar
