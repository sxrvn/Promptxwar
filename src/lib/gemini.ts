// Client-side helper for the self-enumeration chat guide.
//
// In both local dev and production the client simply POSTs to /api/gemini.
// - Production: served by the Vercel serverless function in /api/gemini.ts (uses GEMINI_API_KEY).
// - Local dev: served by the Vite dev-server middleware using VITE_GEMINI_API_KEY as fallback.
// The API key is never in client-side JS in either case (the direct path only runs in local dev
// where the key is already exposed to the developer machine, not the browser bundle).

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const PROXY_ENDPOINT = '/api/gemini';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_DIRECT_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

import { CENSUS_SYSTEM_INSTRUCTION as SYSTEM_INSTRUCTION } from './systemInstruction';

export async function askCensusGuide(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  // --- Try the serverless proxy first (works in production / Vercel dev) ---
  try {
    const res = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message: userMessage }),
    });

    if (res.status === 429) {
      return "You're sending messages quickly — please wait a moment before trying again.";
    }

    if (res.ok) {
      const data = await res.json();
      return data.text || "Sorry, I couldn't generate a response. Please try again.";
    }

    // 503 = proxy up but no key configured; 404/other = proxy not running (local dev).
    // Fall through to the direct API path below.
  } catch {
    // Proxy unreachable (e.g. local Vite dev server without Vercel CLI) — fall through.
  }

  // --- Direct Gemini API call (local dev fallback using VITE_GEMINI_API_KEY) ---
  const devKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (devKey) {
    try {
      const contents = [
        ...history
          .filter((m) => m.role === 'user' || m.role === 'model')
          .slice(-20)
          .map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userMessage }] },
      ];

      const geminiRes = await fetch(`${GEMINI_DIRECT_ENDPOINT}?key=${devKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
        }),
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        if (text) return text;
      }

      console.warn('Direct Gemini API call failed:', geminiRes.status, await geminiRes.text().catch(() => ''));
    } catch (err) {
      console.error('Direct Gemini API call threw:', err);
    }
  }

  // --- Last resort: static keyword-matched stub ---
  console.error('Census guide request failed: falling back to stub');
  return stubResponse(userMessage);
}

// Fallback used only when both the proxy and direct API paths are unavailable.
function stubResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('phase 1') || lower.includes('house')) {
    return 'Phase 1 (House Listing) collects details about your building, dwelling, and household amenities — things like the type of structure, drinking water source, and household assets. It typically happens before Phase 2.';
  }
  if (lower.includes('phase 2') || lower.includes('population') || lower.includes('resident')) {
    return 'Phase 2 (Population Enumeration) records details of every usual resident — name, age, gender, relationship to head of household, education, occupation, and more.';
  }
  if (lower.includes('privacy') || lower.includes('safe') || lower.includes('secure') || lower.includes('confidential')) {
    return 'Your census data is confidential under the Census Act, 1948. It cannot be used as evidence in court or shared with any agency for action against you individually.';
  }
  if (lower.includes('date') || lower.includes('when') || lower.includes('schedule')) {
    return 'The exact schedule varies by state. Phase 1 (House Listing) typically runs a few months before Phase 2 (Population Enumeration). Check the official census portal for state-specific dates.';
  }
  return "I'm having trouble connecting to the AI service right now. Please try again in a moment, or ask me about Phase 1, Phase 2, dates, or privacy.";
}
