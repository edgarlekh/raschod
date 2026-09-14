export interface StreakState {
  currentStreakDays: number;
  longestStreakDays: number;
  lastActivityDate: string | null;
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

export function updateStreak(state: StreakState, activityDate: string): StreakState {
  if (!state.lastActivityDate) {
    return {
      currentStreakDays: 1,
      longestStreakDays: Math.max(1, state.longestStreakDays),
      lastActivityDate: activityDate,
    };
  }

  const diff = daysBetween(state.lastActivityDate, activityDate);

  if (diff === 0) {
    return state;
  }

  if (diff === 1) {
    const currentStreakDays = state.currentStreakDays + 1;
    return {
      currentStreakDays,
      longestStreakDays: Math.max(state.longestStreakDays, currentStreakDays),
      lastActivityDate: activityDate,
    };
  }

  return {
    currentStreakDays: 1,
    longestStreakDays: state.longestStreakDays,
    lastActivityDate: activityDate,
  };
}
