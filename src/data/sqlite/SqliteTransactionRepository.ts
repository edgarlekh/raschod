// src/data/sqlite/SqliteTransactionRepository.ts
import { and, eq, gte, lte } from 'drizzle-orm';
import { transactions } from '../../db/schema';
import type { AppDatabase } from '../../db/types';
import { generateId } from '../../lib/id';
import type {
  CreateTransactionInput,
  TransactionFilter,
  TransactionRecord,
  TransactionRepository,
} from '../repositories/TransactionRepository';

export class SqliteTransactionRepository implements TransactionRepository {
  constructor(private readonly db: AppDatabase) {}

  async create(input: CreateTransactionInput): Promise<TransactionRecord> {
    const record: TransactionRecord = {
      id: generateId(),
      type: input.type,
      amountMinor: input.amountMinor,
      currency: input.currency,
      categoryId: input.categoryId,
      note: input.note ?? null,
      createdAt: new Date().toISOString(),
      frictionLevel: input.frictionLevel,
      wasSkipped: input.wasSkipped,
    };
    await this.db.insert(transactions).values(record);
    return record;
  }

  async list(filter?: TransactionFilter): Promise<TransactionRecord[]> {
    const conditions = [];
    if (filter?.categoryId) conditions.push(eq(transactions.categoryId, filter.categoryId));
    if (filter?.type) conditions.push(eq(transactions.type, filter.type));
    if (filter?.fromDate) conditions.push(gte(transactions.createdAt, filter.fromDate));
    if (filter?.toDate) conditions.push(lte(transactions.createdAt, filter.toDate));

    const rows =
      conditions.length > 0
        ? await this.db.select().from(transactions).where(and(...conditions))
        : await this.db.select().from(transactions);

    return rows.map(toRecord);
  }

  async getById(id: string): Promise<TransactionRecord | null> {
    const rows = await this.db.select().from(transactions).where(eq(transactions.id, id));
    return rows[0] ? toRecord(rows[0]) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(transactions).where(eq(transactions.id, id));
  }
}

function toRecord(row: typeof transactions.$inferSelect): TransactionRecord {
  return {
    id: row.id,
    type: row.type,
    amountMinor: row.amountMinor,
    currency: row.currency,
    categoryId: row.categoryId,
    note: row.note,
    createdAt: row.createdAt,
    frictionLevel: row.frictionLevel,
    wasSkipped: row.wasSkipped,
  };
}
