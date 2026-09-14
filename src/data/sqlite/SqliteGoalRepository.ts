// src/data/sqlite/SqliteGoalRepository.ts
import { eq } from 'drizzle-orm';
import { goals } from '../../db/schema';
import type { AppDatabase } from '../../db/types';
import { generateId } from '../../lib/id';
import type { CreateGoalInput, GoalRecord, GoalRepository } from '../repositories/GoalRepository';

export class SqliteGoalRepository implements GoalRepository {
  constructor(private readonly db: AppDatabase) {}

  async create(input: CreateGoalInput): Promise<GoalRecord> {
    const record: GoalRecord = {
      id: generateId(),
      name: input.name,
      targetAmountMinor: input.targetAmountMinor,
      currentAmountMinor: 0,
      currency: input.currency,
      deadline: input.deadline ?? null,
      isPrimary: input.isPrimary ?? false,
      createdAt: new Date().toISOString(),
    };
    await this.db.insert(goals).values(record);
    return record;
  }

  async listAll(): Promise<GoalRecord[]> {
    const rows = await this.db.select().from(goals);
    return rows.map(toRecord);
  }

  async getPrimary(): Promise<GoalRecord | null> {
    const rows = await this.db.select().from(goals).where(eq(goals.isPrimary, true));
    return rows[0] ? toRecord(rows[0]) : null;
  }

  async addSavings(id: string, amountMinor: number): Promise<GoalRecord> {
    const rows = await this.db.select().from(goals).where(eq(goals.id, id));
    if (!rows[0]) {
      throw new Error(`Goal not found: ${id}`);
    }
    const updatedAmount = rows[0].currentAmountMinor + amountMinor;
    await this.db.update(goals).set({ currentAmountMinor: updatedAmount }).where(eq(goals.id, id));
    return toRecord({ ...rows[0], currentAmountMinor: updatedAmount });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(goals).where(eq(goals.id, id));
  }
}

function toRecord(row: typeof goals.$inferSelect): GoalRecord {
  return {
    id: row.id,
    name: row.name,
    targetAmountMinor: row.targetAmountMinor,
    currentAmountMinor: row.currentAmountMinor,
    currency: row.currency,
    deadline: row.deadline,
    isPrimary: row.isPrimary,
    createdAt: row.createdAt,
  };
}
