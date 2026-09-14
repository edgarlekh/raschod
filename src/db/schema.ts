// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
});

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  targetAmountMinor: integer('target_amount_minor').notNull(),
  currentAmountMinor: integer('current_amount_minor').notNull().default(0),
  currency: text('currency').notNull(),
  deadline: text('deadline'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  amountMinor: integer('amount_minor').notNull(),
  currency: text('currency').notNull(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),
  note: text('note'),
  createdAt: text('created_at').notNull(),
  frictionLevel: integer('friction_level').notNull().default(0),
  wasSkipped: integer('was_skipped', { mode: 'boolean' }).notNull().default(false),
});

export const gamificationState = sqliteTable('gamification_state', {
  id: text('id').primaryKey(),
  xp: integer('xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  currentStreakDays: integer('current_streak_days').notNull().default(0),
  longestStreakDays: integer('longest_streak_days').notNull().default(0),
  lastActivityDate: text('last_activity_date'),
  totalSavedMinor: integer('total_saved_minor').notNull().default(0),
});

export const badges = sqliteTable('badges', {
  id: text('id').primaryKey(),
  badgeKey: text('badge_key').notNull(),
  earnedAt: text('earned_at').notNull(),
});
