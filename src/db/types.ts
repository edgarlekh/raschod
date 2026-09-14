// src/db/types.ts
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type * as schema from './schema';

export type AppDatabase = BetterSQLite3Database<typeof schema> | ExpoSQLiteDatabase<typeof schema>;
