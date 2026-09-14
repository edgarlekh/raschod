export type PlanTier = 'free' | 'premium';

export type FeatureFlag =
  | 'unlimitedGoals'
  | 'advancedAnalytics'
  | 'customFrictionQuestions'
  | 'csvExport'
  | 'customThemes'
  | 'customChallenges';

const FREE_PLAN_FEATURES: Record<FeatureFlag, boolean> = {
  unlimitedGoals: false,
  advancedAnalytics: false,
  customFrictionQuestions: false,
  csvExport: false,
  customThemes: false,
  customChallenges: false,
};

const PREMIUM_PLAN_FEATURES: Record<FeatureFlag, boolean> = {
  unlimitedGoals: true,
  advancedAnalytics: true,
  customFrictionQuestions: true,
  csvExport: true,
  customThemes: true,
  customChallenges: true,
};

export interface EntitlementsService {
  getPlan(): PlanTier;
  hasFeature(flag: FeatureFlag): boolean;
}

export function createEntitlementsService(plan: PlanTier = 'free'): EntitlementsService {
  const features = plan === 'premium' ? PREMIUM_PLAN_FEATURES : FREE_PLAN_FEATURES;
  return {
    getPlan: () => plan,
    hasFeature: (flag) => features[flag],
  };
}
