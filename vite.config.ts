/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Read the shared system instruction from source rather than duplicating it.
// vite.config runs in Node, so we parse the TS source file directly.
const _siSource = readFileSync(resolve(import.meta.dirname, 'src/lib/systemInstruction.ts'), 'utf8');
const _siMatch = _siSource.match(/CENSUS_SYSTEM_INSTRUCTION = `([\s\S]*?)`;/);
const SYSTEM_INSTRUCTION = _siMatch ? _siMatch[1] : '';

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
    // Default to 'node' for all pure logic tests (gemini, data, scheduleUtils) that
    // mock fetch and assert on data structures — no DOM APIs needed.
    // Component tests that require DOM use the `@vitest-environment happy-dom` docblock
    // at the top of the test file to opt in per-file.
    environment: 'node',
    globals: true,
    environmentOptions: {
      happyDOM: {
        width: 1280,
        height: 768,
      },
    },
  },
})
