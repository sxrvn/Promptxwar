import { describe, it, expect } from 'vitest';
import { stateSchedules } from '../stateDates';
import { mythsFacts } from '../mythsFacts';
import { stateSummaries, literacyRateByState } from '../censusData';

// ─── stateSchedules data integrity ───────────────────────────────────────────
describe('stateSchedules data integrity', () => {
  it('every state has valid, ordered date ranges', () => {
    for (const s of stateSchedules) {
      expect(new Date(s.selfEnumerationStart).getTime()).toBeLessThan(new Date(s.selfEnumerationEnd).getTime());
      expect(new Date(s.surveyStart).getTime()).toBeLessThan(new Date(s.surveyEnd).getTime());
      expect(new Date(s.selfEnumerationEnd).getTime()).toBeLessThanOrEqual(new Date(s.surveyStart).getTime());
    }
  });

  it('contains no duplicate states', () => {
    const names = stateSchedules.map((s) => s.state);
    expect(new Set(names).size).toBe(names.length);
  });

  it('has at least 30 states and UTs', () => {
    expect(stateSchedules.length).toBeGreaterThanOrEqual(30);
  });

  it('every state has a valid region', () => {
    const VALID_REGIONS = new Set(['North', 'South', 'East', 'West', 'Northeast', 'Central', 'UT']);
    for (const s of stateSchedules) {
      expect(VALID_REGIONS.has(s.region)).toBe(true);
    }
  });

  it('every state has a positive population figure', () => {
    for (const s of stateSchedules) {
      expect(s.population2011).toBeGreaterThan(0);
    }
  });
});

// ─── mythsFacts data integrity ────────────────────────────────────────────────
describe('mythsFacts data integrity', () => {
  it('every myth has a corresponding non-empty fact', () => {
    for (const mf of mythsFacts) {
      expect(mf.myth.length).toBeGreaterThan(0);
      expect(mf.fact.length).toBeGreaterThan(0);
    }
  });

  it('no myth and fact pair is identical', () => {
    for (const mf of mythsFacts) {
      expect(mf.myth).not.toBe(mf.fact);
    }
  });
});

// ─── censusData integrity ─────────────────────────────────────────────────────
describe('censusData integrity', () => {
  it('literacy rates are in valid range 0-100', () => {
    for (const s of literacyRateByState) {
      expect(s.literacy).toBeGreaterThan(0);
      expect(s.literacy).toBeLessThanOrEqual(100);
    }
  });

  it('stateSummaries sex ratios are in plausible range (800–1200)', () => {
    for (const s of stateSummaries) {
      expect(s.sexRatio).toBeGreaterThan(800);
      expect(s.sexRatio).toBeLessThan(1200);
    }
  });

  it('stateSummaries urban percentages are 0–100', () => {
    for (const s of stateSummaries) {
      expect(s.urbanPct).toBeGreaterThanOrEqual(0);
      expect(s.urbanPct).toBeLessThanOrEqual(100);
    }
  });

  it('stateSummaries has no duplicate state names', () => {
    const names = stateSummaries.map(s => s.state);
    expect(new Set(names).size).toBe(names.length);
  });
});
