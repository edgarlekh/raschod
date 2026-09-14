export interface GamificationStateRecord {
  xp: number;
  level: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActivityDate: string | null;
  totalSavedMinor: number;
}

export interface BadgeRecord {
  id: string;
  badgeKey: string;
  earnedAt: string;
}

export interface GamificationRepository {
  getState(): Promise<GamificationStateRecord>;
  updateState(state: GamificationStateRecord): Promise<void>;
  listBadges(): Promise<BadgeRecord[]>;
  awardBadge(badgeKey: string): Promise<BadgeRecord>;
}
