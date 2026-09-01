/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are the official Census 2027 Self-Enumeration Guide for India.
Your job is to walk residents step by step through the two-phase digital census process:
Phase 1 (House Listing & Housing Census) collects household/building details.
Phase 2 (Population Enumeration) collects individual demographic details for each usual resident.
Be concise, friendly, and accurate. Always remind users that:
- Participation data is confidential under the Census Act, 1948.
- Self-enumeration is free and never requires payment or OTP sharing.
- If unsure of an official date or legal detail, tell the user to check the official census portal rather than guessing.
Answer in the same language the user is writing in when possible.`;

/** Dev-only plugin: serves /api/gemini so the AI guide works with `vite dev` (no Vercel CLI needed). */
function devGeminiMiddleware(): Plugin {
  return {
    name: 'dev-gemini-middleware',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(
        '/api/gemini',
        async (req: IncomingMessage, res: ServerResponse) => {
          // Only handle POST
          if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          const apiKey = process.env.VITE_GEMINI_API_KEY;
          if (!apiKey) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'VITE_GEMINI_API_KEY not set in .env.local' }));
            return;
          }

          // Read request body
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          let body: { history?: { role: string; text: string }[]; message?: string };
          try {
            body = JSON.parse(Buffer.concat(chunks).toString());
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }

          const { history = [], message } = body;
          if (!message || typeof message !== 'string' || message.length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Message is required' }));
            return;
          }

          const contents = [
            ...(Array.isArray(history) ? history : [])
              .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
              .slice(-20)
              .map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
            { role: 'user', parts: [{ text: message }] },
          ];

          try {
            const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
              }),
            });

            if (!geminiRes.ok) {
              const errText = await geminiRes.text();
              console.error(`[dev-gemini] Gemini API error ${geminiRes.status}:`, errText);
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: `Gemini API error: ${geminiRes.status}` }));
              return;
            }

            const data = await geminiRes.json() as {
              candidates?: { content?: { parts?: { text?: string }[] } }[];
            };
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ text }));
          } catch (err) {
            console.error('[dev-gemini] fetch failed:', err);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to reach Gemini API' }));
          }
        }
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devGeminiMiddleware()],
  test: {
    // Use 'node' env: all current tests (gemini.test.ts, data.test.ts) are pure logic
    // tests that mock fetch and assert on data structures — no DOM APIs needed.
    // If component tests are added later, switch to 'happy-dom' (npm i -D happy-dom).
    environment: 'node',
    globals: true,
  },
})
