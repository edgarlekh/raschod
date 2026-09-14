import { createTestDb } from '../../../test-utils/createTestDb';
import { SqliteGamificationRepository } from './SqliteGamificationRepository';

describe('SqliteGamificationRepository', () => {
  function setup() {
    const db = createTestDb();
    return new SqliteGamificationRepository(db);
  }

  it('returns a default zeroed state on first read', async () => {
    const repo = setup();
    expect(await repo.getState()).toEqual({
      xp: 0,
      level: 1,
      currentStreakDays: 0,
      longestStreakDays: 0,
      lastActivityDate: null,
      totalSavedMinor: 0,
    });
  });

  it('persists an updated state and reads it back', async () => {
    const repo = setup();
    await repo.updateState({
      xp: 50,
      level: 1,
      currentStreakDays: 2,
      longestStreakDays: 2,
      lastActivityDate: '2026-09-14',
      totalSavedMinor: 12000,
    });
    expect(await repo.getState()).toEqual({
      xp: 50,
      level: 1,
      currentStreakDays: 2,
      longestStreakDays: 2,
      lastActivityDate: '2026-09-14',
      totalSavedMinor: 12000,
    });
  });

  it('starts with no badges', async () => {
    const repo = setup();
    expect(await repo.listBadges()).toEqual([]);
  });

  it('awards a badge and lists it', async () => {
    const repo = setup();
    const badge = await repo.awardBadge('first-goal-complete');
    expect(badge.badgeKey).toBe('first-goal-complete');
    expect(await repo.listBadges()).toEqual([badge]);
  });
});
