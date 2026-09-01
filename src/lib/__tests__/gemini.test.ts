import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { askCensusGuide } from '../gemini';

describe('askCensusGuide', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('when the AI proxy is unavailable (offline stub mode)', () => {
    beforeEach(() => {
      // Simulate the /api/gemini proxy being unreachable (e.g. local dev without `vercel dev`).
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('network error'));
    });

    it('answers Phase 1 questions with relevant content', async () => {
      const reply = await askCensusGuide([], 'What does Phase 1 collect?');
      expect(reply.toLowerCase()).toContain('house');
    });

    it('answers Phase 2 questions with relevant content', async () => {
      const reply = await askCensusGuide([], 'Tell me about Phase 2 population enumeration');
      expect(reply.toLowerCase()).toContain('resident');
    });

    it('answers privacy questions with relevant content', async () => {
      const reply = await askCensusGuide([], 'Is my data safe and private?');
      expect(reply.toLowerCase()).toContain('confidential');
    });

    it('falls back gracefully for unrelated questions', async () => {
      const reply = await askCensusGuide([], 'hello there');
      expect(reply.length).toBeGreaterThan(0);
    });
  });

  describe('when the AI proxy responds successfully', () => {
    it('returns the text from the proxy response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ text: 'This is a real AI response.' }),
      });
      const reply = await askCensusGuide([], 'What is Census 2027?');
      expect(reply).toBe('This is a real AI response.');
    });

    it('sends message and history in the request body', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ text: 'ok' }),
      });
      globalThis.fetch = fetchMock;

      await askCensusGuide([{ role: 'user', text: 'hi' }], 'follow up');

      const call = fetchMock.mock.calls[0];
      expect(call[0]).toBe('/api/gemini');
      const body = JSON.parse(call[1].body);
      expect(body.message).toBe('follow up');
      expect(body.history).toEqual([{ role: 'user', text: 'hi' }]);
    });
  });

  describe('when the proxy is rate-limiting', () => {
    it('returns a friendly rate-limit message', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429 });
      const reply = await askCensusGuide([], 'spam message');
      expect(reply.toLowerCase()).toContain('wait');
    });
  });
});
