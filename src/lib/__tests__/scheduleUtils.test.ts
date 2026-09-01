import { describe, it, expect } from 'vitest';
import {
  getEnumerationStatus,
  daysUntil,
  decomposeMs,
  sanitiseFormField,
  isPositiveInteger,
} from '../scheduleUtils';

// ─── getEnumerationStatus ─────────────────────────────────────────────────────
describe('getEnumerationStatus', () => {
  const START = '2027-01-10';
  const END   = '2027-02-10';

  // Simulate being exactly mid-window
  it('returns "open" when now is within the window', () => {
    const mid = new Date('2027-01-20').getTime();
    expect(getEnumerationStatus(START, END, mid)).toBe('open');
  });

  it('returns "open" on the first day of the window (boundary)', () => {
    const onStart = new Date(START).getTime();
    expect(getEnumerationStatus(START, END, onStart)).toBe('open');
  });

  it('returns "open" on the last day of the window (boundary)', () => {
    const onEnd = new Date(END).getTime();
    expect(getEnumerationStatus(START, END, onEnd)).toBe('open');
  });

  it('returns "upcoming" when now is before the window', () => {
    const before = new Date('2026-12-01').getTime();
    expect(getEnumerationStatus(START, END, before)).toBe('upcoming');
  });

  it('returns "closed" when now is after the window', () => {
    const after = new Date('2027-03-01').getTime();
    expect(getEnumerationStatus(START, END, after)).toBe('closed');
  });

  it('defaults to Date.now() — result is a valid status string', () => {
    const result = getEnumerationStatus(START, END);
    expect(['open', 'upcoming', 'closed']).toContain(result);
  });
});

// ─── daysUntil ───────────────────────────────────────────────────────────────
describe('daysUntil', () => {
  it('returns a positive number for a future date', () => {
    const future = new Date(Date.now() + 10 * 86_400_000).toISOString().slice(0, 10);
    expect(daysUntil(future)).toBe(10);
  });

  it('returns a negative number for a past date', () => {
    const past = new Date(Date.now() - 5 * 86_400_000).toISOString().slice(0, 10);
    expect(daysUntil(past)).toBeLessThan(0);
  });

  it('returns 1 for a date that is 1 hour away (rounds up)', () => {
    const soon = new Date(Date.now() + 3_600_000).toISOString();
    expect(daysUntil(soon)).toBe(1);
  });
});

// ─── decomposeMs ─────────────────────────────────────────────────────────────
describe('decomposeMs', () => {
  it('correctly decomposes 1 day + 2 hours + 30 minutes + 15 seconds', () => {
    const ms = 86_400_000 + 2 * 3_600_000 + 30 * 60_000 + 15_000;
    expect(decomposeMs(ms)).toEqual({ days: 1, hours: 2, mins: 30, secs: 15 });
  });

  it('clamps negative values to zero', () => {
    expect(decomposeMs(-1000)).toEqual({ days: 0, hours: 0, mins: 0, secs: 0 });
  });

  it('handles exactly zero', () => {
    expect(decomposeMs(0)).toEqual({ days: 0, hours: 0, mins: 0, secs: 0 });
  });

  it('handles exactly 60 seconds as 1 minute 0 seconds', () => {
    expect(decomposeMs(60_000)).toEqual({ days: 0, hours: 0, mins: 1, secs: 0 });
  });
});

// ─── sanitiseFormField ────────────────────────────────────────────────────────
describe('sanitiseFormField', () => {
  it('trims leading and trailing whitespace', () => {
    expect(sanitiseFormField('  hello  ')).toBe('hello');
  });

  it('collapses multiple internal spaces', () => {
    expect(sanitiseFormField('hello   world')).toBe('hello world');
  });

  it('strips control characters', () => {
    expect(sanitiseFormField('hello\x00world\x1F')).toBe('helloworld');
  });

  it('truncates to maxLength', () => {
    const long = 'a'.repeat(300);
    expect(sanitiseFormField(long).length).toBe(200);
  });

  it('respects a custom maxLength', () => {
    expect(sanitiseFormField('hello world', 5)).toBe('hello');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(sanitiseFormField('   ')).toBe('');
  });
});

// ─── isPositiveInteger ────────────────────────────────────────────────────────
describe('isPositiveInteger', () => {
  it('returns true for "1"', () => expect(isPositiveInteger('1')).toBe(true));
  it('returns true for "10"', () => expect(isPositiveInteger('10')).toBe(true));
  it('returns false for "0"', () => expect(isPositiveInteger('0')).toBe(false));
  it('returns false for "-1"', () => expect(isPositiveInteger('-1')).toBe(false));
  it('returns false for "1.5" (float)', () => expect(isPositiveInteger('1.5')).toBe(false));
  it('returns false for empty string', () => expect(isPositiveInteger('')).toBe(false));
  it('returns false for non-numeric string', () => expect(isPositiveInteger('abc')).toBe(false));
});
