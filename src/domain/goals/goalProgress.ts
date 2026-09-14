export interface GoalProgressInput {
  targetAmountMinor: number;
  currentAmountMinor: number;
}

export interface GoalProgress {
  percentComplete: number;
  remainingMinor: number;
  isComplete: boolean;
}

export function calculateGoalProgress(input: GoalProgressInput): GoalProgress {
  if (input.targetAmountMinor <= 0) {
    throw new Error('Goal target amount must be positive');
  }
  const clampedCurrent = Math.max(0, input.currentAmountMinor);
  const percentComplete = Math.min(100, Math.round((clampedCurrent / input.targetAmountMinor) * 100));
  const remainingMinor = Math.max(0, input.targetAmountMinor - clampedCurrent);
  return { percentComplete, remainingMinor, isComplete: clampedCurrent >= input.targetAmountMinor };
}
