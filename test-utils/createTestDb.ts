import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/db/schema';
import type { AppDatabase } from '../src/db/types';

export function createTestDb(): AppDatabase {
  const sqlite = new Database(':memory:');
  sqlite.exec(`
    PRAGMA foreign_keys = OFF;
    CREATE TABLE categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      is_custom INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE goals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_amount_minor INTEGER NOT NULL,
      current_amount_minor INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL,
      deadline TEXT,
      is_primary INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount_minor INTEGER NOT NULL,
      currency TEXT NOT NULL,
      category_id TEXT NOT NULL REFERENCES categories(id),
      note TEXT,
      created_at TEXT NOT NULL,
      friction_level INTEGER NOT NULL DEFAULT 0,
      was_skipped INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE gamification_state (
      id TEXT PRIMARY KEY,
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      current_streak_days INTEGER NOT NULL DEFAULT 0,
      longest_streak_days INTEGER NOT NULL DEFAULT 0,
      last_activity_date TEXT,
      total_saved_minor INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE badges (
      id TEXT PRIMARY KEY,
      badge_key TEXT NOT NULL,
      earned_at TEXT NOT NULL
    );
  `);
  return drizzle(sqlite, { schema });
}
