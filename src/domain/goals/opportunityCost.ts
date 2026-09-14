export interface GoalSnapshot {
  name: string;
  remainingMinor: number;
  currency: string;
}

export interface OpportunityCostResult {
  goalName: string;
  percent: number;
}

export function calculateOpportunityCost(
  amountMinor: number,
  goal: GoalSnapshot | null,
): OpportunityCostResult | null {
  if (!goal || goal.remainingMinor <= 0) {
    return null;
  }
  const percent = Math.min(100, Math.round((amountMinor / goal.remainingMinor) * 100));
  return { goalName: goal.name, percent };
}
