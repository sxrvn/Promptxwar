# Promptxwar: Digital Enumeration (Census 2027 Demo)

A GenAI-powered web application that explains and guides users through India's Census 2027, highlighting the nation's first fully digital census process. The platform features an authoritative, government-grade UI design that stands apart from standard SaaS templates.

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
- **Testing**: Vitest

## Distinctive Design System

The application was recently overhauled to feature a rigid, authoritative visual identity suitable for a national census:
- **Asymmetric Grid Layouts**: Sharp corners and thick structural borders (no soft shadows).
- **Typography as Structure**: Strong use of `Eczar` to convey official documentation weight.
- **Intentional Palette**: Deep Teal (`#115E59`) and Amber (`#F59E0B`) accents on Document White (`#F8F9FA`) and Navy Black (`#0D1B2A`).

## Local Setup

```bash
npm install
cp .env.example .env.local   # Add your Gemini API key as GEMINI_API_KEY
npm run dev
```

> **Note:** The `/api/gemini` proxy requires Vercel's runtime. For full AI capabilities locally, run `npx vercel dev` instead of `npm run dev`.

## Data Disclaimer

All state dates, schedules, and census statistics provided in this repository are **illustrative sample data** created for demonstration purposes. They do not represent official Census of India figures.

## Security & Architecture

- **Secure API**: The Gemini API key never reaches the client browser. It is processed securely via a Vercel serverless proxy endpoint (`api/gemini.ts`).
- **Offline Fallback**: If the API key is missing or the AI service is unreachable, the chat guide gracefully falls back to a rule-based offline mode.
- **Privacy First**: No PII is collected or stored. The enumeration wizard is entirely a demo flow.
