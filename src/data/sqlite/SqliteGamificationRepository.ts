import { desc, eq } from 'drizzle-orm';
import { badges, gamificationState } from '../../db/schema';
import type { AppDatabase } from '../../db/types';
import { generateId } from '../../lib/id';
import type {
  BadgeRecord,
  GamificationRepository,
  GamificationStateRecord,
} from '../repositories/GamificationRepository';

const SINGLETON_ID = 'singleton';

const DEFAULT_STATE: GamificationStateRecord = {
  xp: 0,
  level: 1,
  currentStreakDays: 0,
  longestStreakDays: 0,
  lastActivityDate: null,
  totalSavedMinor: 0,
};

export class SqliteGamificationRepository implements GamificationRepository {
  constructor(private readonly db: AppDatabase) {}

  async getState(): Promise<GamificationStateRecord> {
    const rows = await this.db.select().from(gamificationState).where(eq(gamificationState.id, SINGLETON_ID));
    if (!rows[0]) {
      return { ...DEFAULT_STATE };
    }
    return toStateRecord(rows[0]);
  }

  async updateState(state: GamificationStateRecord): Promise<void> {
    const existing = await this.db
      .select()
      .from(gamificationState)
      .where(eq(gamificationState.id, SINGLETON_ID));

    if (existing[0]) {
      await this.db
        .update(gamificationState)
        .set(state)
        .where(eq(gamificationState.id, SINGLETON_ID));
    } else {
      await this.db.insert(gamificationState).values({ id: SINGLETON_ID, ...state });
    }
  }

  async listBadges(): Promise<BadgeRecord[]> {
    const rows = await this.db.select().from(badges).orderBy(desc(badges.earnedAt));
    return rows.map(toRecord);
  }

  async awardBadge(badgeKey: string): Promise<BadgeRecord> {
    const record: BadgeRecord = { id: generateId(), badgeKey, earnedAt: new Date().toISOString() };
    await this.db.insert(badges).values(record);
    return record;
  }
}

function toStateRecord(row: typeof gamificationState.$inferSelect): GamificationStateRecord {
  return {
    xp: row.xp,
    level: row.level,
    currentStreakDays: row.currentStreakDays,
    longestStreakDays: row.longestStreakDays,
    lastActivityDate: row.lastActivityDate,
    totalSavedMinor: row.totalSavedMinor,
  };
}

function toRecord(row: typeof badges.$inferSelect): BadgeRecord {
  return { id: row.id, badgeKey: row.badgeKey, earnedAt: row.earnedAt };
}
