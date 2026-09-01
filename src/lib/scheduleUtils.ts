/**
 * Census 2027 — Enumeration Schedule Utilities
 *
 * Pure functions with no side effects, easily unit-tested and reusable
 * across StateDates and the Home countdown.
 */

export type EnumerationStatus = 'open' | 'upcoming' | 'closed';

/**
 * Returns the self-enumeration window status relative to a given timestamp.
 * @param selfStart ISO date string — start of self-enumeration window
 * @param selfEnd   ISO date string — end of self-enumeration window
 * @param now       Epoch milliseconds (defaults to Date.now())
 */
export function getEnumerationStatus(
  selfStart: string,
  selfEnd: string,
  now: number = Date.now(),
): EnumerationStatus {
  const start = new Date(selfStart).getTime();
  const end   = new Date(selfEnd).getTime();
  if (now >= start && now <= end) return 'open';
  if (now < start) return 'upcoming';
  return 'closed';
}

/**
 * Days remaining until the given ISO date string.
 * Returns negative numbers for dates in the past.
 */
export function daysUntil(iso: string, now: number = Date.now()): number {
  return Math.ceil((new Date(iso).getTime() - now) / 86_400_000);
}

/**
 * Decompose a total-milliseconds-remaining value into days/hours/mins/secs.
 */
export function decomposeMs(totalMs: number): {
  days: number; hours: number; mins: number; secs: number;
} {
  const total = Math.max(0, totalMs);
  return {
    days:  Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    mins:  Math.floor((total % 3_600_000)  / 60_000),
    secs:  Math.floor((total % 60_000)     / 1_000),
  };
}

/**
 * Sanitise a free-text form field value:
 * - Trim whitespace
 * - Collapse internal whitespace sequences to a single space
 * - Strip control characters
 * - Cap at maxLength characters (default 200)
 */
export function sanitiseFormField(value: string, maxLength = 200): string {
  return value
    .replace(/[\x00-\x1F\x7F]/g, '') // strip control chars
    .replace(/\s+/g, ' ')             // collapse whitespace
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate that a string is a positive integer (for room counts, member counts etc.)
 */
export function isPositiveInteger(value: string): boolean {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}
