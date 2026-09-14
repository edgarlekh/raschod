import type { FrictionTier } from '../friction/frictionEngine';

const XP_BY_TIER: Record<FrictionTier, number> = {
  none: 0,
  light: 5,
  medium: 15,
  heavy: 30,
};

export function calculateXpGain(tier: FrictionTier, wasSkipped: boolean): number {
  if (!wasSkipped) {
    return 0;
  }
  return XP_BY_TIER[tier];
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
}

const XP_PER_LEVEL = 100;

export function calculateLevel(totalXp: number): LevelInfo {
  if (totalXp < 0) {
    throw new Error('XP cannot be negative');
  }
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;
  return { level, xpIntoLevel, xpForNextLevel: XP_PER_LEVEL };
}
