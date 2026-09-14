import { updateStreak, type StreakState } from './streaks';

const base: StreakState = { currentStreakDays: 0, longestStreakDays: 0, lastActivityDate: null };

describe('updateStreak', () => {
  it('starts a streak of 1 on the first recorded activity', () => {
    expect(updateStreak(base, '2026-09-14')).toEqual({
      currentStreakDays: 1,
      longestStreakDays: 1,
      lastActivityDate: '2026-09-14',
    });
  });

  it('does not change the streak twice on the same day', () => {
    const state: StreakState = { currentStreakDays: 3, longestStreakDays: 5, lastActivityDate: '2026-09-14' };
    expect(updateStreak(state, '2026-09-14')).toEqual(state);
  });

  it('extends the streak on the next consecutive day', () => {
    const state: StreakState = { currentStreakDays: 3, longestStreakDays: 5, lastActivityDate: '2026-09-14' };
    expect(updateStreak(state, '2026-09-15')).toEqual({
      currentStreakDays: 4,
      longestStreakDays: 5,
      lastActivityDate: '2026-09-15',
    });
  });

  it('raises the longest streak once the current streak passes it', () => {
    const state: StreakState = { currentStreakDays: 5, longestStreakDays: 5, lastActivityDate: '2026-09-14' };
    expect(updateStreak(state, '2026-09-15')).toEqual({
      currentStreakDays: 6,
      longestStreakDays: 6,
      lastActivityDate: '2026-09-15',
    });
  });

  it('resets the streak to 1 after a gap of more than one day', () => {
    const state: StreakState = { currentStreakDays: 6, longestStreakDays: 6, lastActivityDate: '2026-09-10' };
    expect(updateStreak(state, '2026-09-14')).toEqual({
      currentStreakDays: 1,
      longestStreakDays: 6,
      lastActivityDate: '2026-09-14',
    });
  });

  it('leaves the state unchanged when the activity date is before lastActivityDate', () => {
    const state: StreakState = { currentStreakDays: 3, longestStreakDays: 5, lastActivityDate: '2026-09-14' };
    expect(updateStreak(state, '2026-09-10')).toEqual(state);
  });
});
