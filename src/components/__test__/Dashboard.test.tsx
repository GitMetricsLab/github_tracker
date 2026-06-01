import { describe, it, expect } from 'vitest';
import { getTotalActiveDays } from '../Dashboard';

describe('getTotalActiveDays', () => {
  it('counts unique YYYY-MM-DD values across issues and pull requests', () => {
    const issues = [
      { created_at: '2026-05-01T12:00:00Z' },
      { created_at: '2026-05-01T18:30:00Z' },
      { created_at: '2026-05-02T09:15:00Z' },
    ];

    const prs = [
      { created_at: '2026-05-02T20:45:00Z' },
      { created_at: '2026-05-03T08:00:00Z' },
    ];

    expect(getTotalActiveDays(issues as never[], prs as never[])).toBe(3);
  });

  it('returns 0 for empty datasets', () => {
    expect(getTotalActiveDays([], [])).toBe(0);
  });
});