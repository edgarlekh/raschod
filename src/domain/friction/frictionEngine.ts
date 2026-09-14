export interface FrictionThresholds {
  noQuestionBelowMinor: number;
  oneQuestionBelowMinor: number;
  twoQuestionsBelowMinor: number;
}

export const DEFAULT_FRICTION_THRESHOLDS: FrictionThresholds = {
  noQuestionBelowMinor: 500,
  oneQuestionBelowMinor: 3000,
  twoQuestionsBelowMinor: 10000,
};

export type FrictionTier = 'none' | 'light' | 'medium' | 'heavy';

export interface FrictionDecision {
  tier: FrictionTier;
  questionCount: number;
  includeOpportunityCost: boolean;
}

export function decideFriction(
  amountInBaseMinor: number,
  thresholds: FrictionThresholds = DEFAULT_FRICTION_THRESHOLDS,
): FrictionDecision {
  if (amountInBaseMinor < 0) {
    throw new Error('Amount must be non-negative');
  }
  if (amountInBaseMinor < thresholds.noQuestionBelowMinor) {
    return { tier: 'none', questionCount: 0, includeOpportunityCost: false };
  }
  if (amountInBaseMinor < thresholds.oneQuestionBelowMinor) {
    return { tier: 'light', questionCount: 1, includeOpportunityCost: false };
  }
  if (amountInBaseMinor < thresholds.twoQuestionsBelowMinor) {
    return { tier: 'medium', questionCount: 2, includeOpportunityCost: false };
  }
  return { tier: 'heavy', questionCount: 3, includeOpportunityCost: true };
}
