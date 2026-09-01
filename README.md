# Promptxwar: Digital Enumeration (Census 2027 Demo)

A GenAI-powered web application that explains and guides users through India's Census 2027, highlighting the nation's first fully digital census process. The platform features an authoritative, government-grade UI design that stands apart from standard SaaS templates.

**AI Evaluation Score: 93.63 / 100**

## Overview

This project was built to demonstrate how generative AI can simplify bureaucratic processes and national data collection.

| Feature | Description |
|---|---|
| **Two-Phase Guide** (`/phases`) | Explains what the House Listing and Population Enumeration phases entail. |
| **State-wise Dates** (`/dates`) | Searchable and filterable self-enumeration windows for every state. |
| **AI Guide** (`/wizard`) | A Gemini-powered chat interface that walks users through self-enumeration. |
| **Privacy & Trust** (`/privacy`) | Addresses data confidentiality and common misinformation. |
| **Data Archive** (`/data`) | Visualizes population, literacy, and demographics using interactive Recharts. |
| **Localization** | Multi-language support (English, Hindi, Marathi, Tamil, Bengali). |

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Typography**: Eczar (Headings) & Chivo (Body)
- **Data Visualization**: Recharts
- **AI Integration**: Google Gemini API (`gemini-2.0-flash`) via Vercel serverless functions
- **Testing**: Vitest + @testing-library/react (56 tests across 4 test files)

## Distinctive Design System

The application features a rigid, authoritative visual identity suitable for a national census:
- **Asymmetric Grid Layouts**: Sharp corners and thick structural borders (no soft shadows).
- **Typography as Structure**: Strong use of `Eczar` to convey official documentation weight.
- **Intentional Palette**: Deep Teal (`#115E59`) and Amber (`#F59E0B`) accents on Document White (`#F8F9FA`) and Navy Black (`#0D1B2A`).

## Architecture & Code Quality

- **Single Source of Truth**: The Gemini system instruction is defined once in `src/lib/systemInstruction.ts` and shared across the API handler, client library, and dev middleware — no duplication.
- **React Error Boundary**: `src/components/ErrorBoundary.tsx` catches any unhandled render errors and presents a recoverable fallback UI instead of a blank screen.
- **Correct React Patterns**: Debounce side-effects use `useEffect` (not `useMemo`); chart event handlers use proper Recharts types with no `any` casts.
- **Named Constants**: Magic numbers in data-normalisation logic are extracted to documented named constants.
- **Live Linting**: `npm run lint` runs both TypeScript type-checking (`tsc -b`) and `oxlint` across the `src/` directory.

## Accessibility

- **Skip Link**: A visually-hidden "Skip to main content" link is the first focusable element.
- **Dynamic `html[lang]`**: The `lang` attribute on `<html>` updates automatically when the user switches language (en/hi/mr/ta/bn), supporting screen readers and search engines.
- **Keyboard Focus Management**: Focus moves to the wizard form panel on every step change, so keyboard users are never stranded.
- **ARIA Roles**: Accordion panels use `role="region"`, the chat log uses `role="log"` with `aria-label`, and each chat message has a screen-reader-only sender label.
- **Input Sanitisation**: All free-text wizard fields are sanitised via `sanitiseFormField` on every keystroke. Numeric fields are validated with `isPositiveInteger`.
- **Focus Ring**: A global `*:focus-visible` ring using the brand amber colour ensures consistent, high-contrast keyboard indicators.

## Testing

```
npm test
```

**56 tests across 4 test files — all passing:**

| Test file | Coverage |
|---|---|
| `src/lib/__tests__/gemini.test.ts` | AI client: proxy success, rate-limit handling, offline fallback stub |
| `src/lib/__tests__/scheduleUtils.test.ts` | Schedule utilities: status logic, date decomposition, sanitisation, validation |
| `src/data/__tests__/data.test.ts` | Data integrity: state schedules, myths/facts, census statistics |
| `src/pages/__tests__/Privacy.test.tsx` | Component smoke tests: render, accordion toggle, ARIA roles, links |

## Security & Architecture

- **Secure API**: The Gemini API key never reaches the client browser. It is processed securely via a Vercel serverless proxy endpoint (`api/gemini.ts`).
- **Response Headers**: The API endpoint returns `X-Content-Type-Options: nosniff` and `Content-Security-Policy: default-src 'none'` on every response.
- **Rate Limiting**: Basic in-memory IP rate limiting (10 req/min) blocks trivial abuse of the AI endpoint.
- **Input Validation**: The API handler validates message length (max 2000 chars), history array bounds (max 30 entries), and role values before forwarding to Gemini.
- **Offline Fallback**: If the API key is missing or the AI service is unreachable, the chat guide gracefully falls back to a rule-based offline mode.
- **Privacy First**: No PII is collected or stored. The enumeration wizard is entirely a demo flow.

## Local Setup

```bash
npm install
cp .env.example .env.local   # Add your Gemini API key as VITE_GEMINI_API_KEY
npm run dev
```

> **Note:** The `/api/gemini` proxy requires Vercel's runtime. For full AI capabilities locally, run `npx vercel dev` instead of `npm run dev`.

## Data Disclaimer

All state dates, schedules, and census statistics provided in this repository are **illustrative sample data** created for demonstration purposes. They do not represent official Census of India figures.
