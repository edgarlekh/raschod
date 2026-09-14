// src/data/sqlite/SqliteCategoryRepository.ts
import { eq } from 'drizzle-orm';
import { categories } from '../../db/schema';
import type { AppDatabase } from '../../db/types';
import { generateId } from '../../lib/id';
import type {
  CategoryRecord,
  CategoryRepository,
  CreateCategoryInput,
} from '../repositories/CategoryRepository';

export const DEFAULT_CATEGORIES: CreateCategoryInput[] = [
  { name: 'Еда', icon: 'utensils', color: '#F97316' },
  { name: 'Транспорт', icon: 'car', color: '#3B82F6' },
  { name: 'Жильё', icon: 'home', color: '#8B5CF6' },
  { name: 'Развлечения', icon: 'popcorn', color: '#EC4899' },
  { name: 'Здоровье', icon: 'heart-pulse', color: '#10B981' },
  { name: 'Одежда', icon: 'shirt', color: '#F59E0B' },
  { name: 'Подписки', icon: 'refresh-cw', color: '#6366F1' },
  { name: 'Образование', icon: 'graduation-cap', color: '#06B6D4' },
  { name: 'Подарки', icon: 'gift', color: '#EF4444' },
  { name: 'Прочее', icon: 'more-horizontal', color: '#6B7280' },
];

export class SqliteCategoryRepository implements CategoryRepository {
  constructor(private readonly db: AppDatabase) {}

  async listAll(): Promise<CategoryRecord[]> {
    const rows = await this.db.select().from(categories);
    return rows.map(toRecord);
  }

  async create(input: CreateCategoryInput): Promise<CategoryRecord> {
    const record = { id: generateId(), ...input, isCustom: true };
    await this.db.insert(categories).values(record);
    return record;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(categories).where(eq(categories.id, id));
  }

  async seedDefaultsIfEmpty(): Promise<void> {
    const existing = await this.listAll();
    if (existing.length > 0) {
      return;
    }
    const rows = DEFAULT_CATEGORIES.map((c) => ({ id: generateId(), ...c, isCustom: false }));
    await this.db.insert(categories).values(rows);
  }
}

function toRecord(row: typeof categories.$inferSelect): CategoryRecord {
  return { id: row.id, name: row.name, icon: row.icon, color: row.color, isCustom: row.isCustom };
}
