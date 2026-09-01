// Vercel serverless function (Node runtime). Deployed automatically at /api/gemini.
// The Gemini API key lives ONLY here as a server-side env var (GEMINI_API_KEY, no VITE_ prefix),
// so it is never bundled into client JS or visible in the network tab.

export const config = { runtime: 'edge' };

// Import the single source-of-truth system instruction rather than duplicating it.
import { CENSUS_SYSTEM_INSTRUCTION } from '../src/lib/systemInstruction';

const MODEL = 'gemini-2.0-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/** Standard security headers applied to every response from this function. */
const SECURITY_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'",
};

// Basic in-memory rate limit per IP (best-effort; resets on cold start).
// Not a substitute for a real rate limiter (e.g. Upstash) in production, but blocks trivial abuse.
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests, please slow down.' }), { status: 429 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 503 });
  }

  let body: { history?: { role: string; text: string }[]; message?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const { history = [], message } = body;

  // Basic input validation — reject empty or absurdly long messages to limit abuse surface.
  if (!message || typeof message !== 'string' || message.length === 0) {
    return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
  }
  if (message.length > 2000) {
    return new Response(JSON.stringify({ error: 'Message too long' }), { status: 400 });
  }
  if (!Array.isArray(history) || history.length > 30) {
    return new Response(JSON.stringify({ error: 'Invalid history' }), { status: 400 });
  }

  const contents = [
    ...history
      .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
      .slice(-20) // cap context sent upstream
      .map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const geminiRes = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: CENSUS_SYSTEM_INSTRUCTION }] },
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    });

    if (!geminiRes.ok) {
      return new Response(JSON.stringify({ error: 'Upstream AI service error' }), {
        status: 502,
        headers: SECURITY_HEADERS,
      });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: SECURITY_HEADERS,
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to reach AI service' }), {
      status: 502,
      headers: SECURITY_HEADERS,
    });
  }
}
