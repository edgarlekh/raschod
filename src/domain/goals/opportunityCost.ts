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
  spendCurrency: string,
  goal: GoalSnapshot | null,
): OpportunityCostResult | null {
  if (!goal || goal.remainingMinor <= 0) {
    return null;
  }
  if (spendCurrency !== goal.currency) {
    throw new Error(`Currency mismatch: spend is ${spendCurrency}, goal is ${goal.currency}`);
  }
  const percent = Math.min(100, Math.round((amountMinor / goal.remainingMinor) * 100));
  return { goalName: goal.name, percent };
}
