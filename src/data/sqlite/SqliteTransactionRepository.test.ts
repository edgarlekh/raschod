// src/data/sqlite/SqliteTransactionRepository.test.ts
import { createTestDb } from '../../../test-utils/createTestDb';
import { SqliteTransactionRepository } from './SqliteTransactionRepository';

describe('SqliteTransactionRepository', () => {
  function setup() {
    const db = createTestDb();
    return new SqliteTransactionRepository(db);
  }

  it('creates a transaction and reads it back by id', async () => {
    const repo = setup();
    const created = await repo.create({
      type: 'expense',
      amountMinor: 2500,
      currency: 'PLN',
      categoryId: 'cat-food',
      note: 'Обед',
      frictionLevel: 1,
      wasSkipped: false,
    });

    expect(created.id).toBeTruthy();
    const found = await repo.getById(created.id);
    expect(found).toEqual(created);
  });

  it('returns null for a missing id', async () => {
    const repo = setup();
    expect(await repo.getById('missing')).toBeNull();
  });

  it('lists all transactions when no filter is given', async () => {
    const repo = setup();
    await repo.create({ type: 'expense', amountMinor: 100, currency: 'PLN', categoryId: 'cat-food', frictionLevel: 0, wasSkipped: false });
    await repo.create({ type: 'income', amountMinor: 5000, currency: 'PLN', categoryId: 'cat-salary', frictionLevel: 0, wasSkipped: false });

    const all = await repo.list();
    expect(all).toHaveLength(2);
  });

  it('filters by type', async () => {
    const repo = setup();
    await repo.create({ type: 'expense', amountMinor: 100, currency: 'PLN', categoryId: 'cat-food', frictionLevel: 0, wasSkipped: false });
    await repo.create({ type: 'income', amountMinor: 5000, currency: 'PLN', categoryId: 'cat-salary', frictionLevel: 0, wasSkipped: false });

    const expenses = await repo.list({ type: 'expense' });
    expect(expenses).toHaveLength(1);
    expect(expenses[0].type).toBe('expense');
  });

  it('filters by categoryId', async () => {
    const repo = setup();
    await repo.create({ type: 'expense', amountMinor: 100, currency: 'PLN', categoryId: 'cat-food', frictionLevel: 0, wasSkipped: false });
    await repo.create({ type: 'expense', amountMinor: 200, currency: 'PLN', categoryId: 'cat-transport', frictionLevel: 0, wasSkipped: false });

    const foodOnly = await repo.list({ categoryId: 'cat-food' });
    expect(foodOnly).toHaveLength(1);
    expect(foodOnly[0].categoryId).toBe('cat-food');
  });

  it('deletes a transaction', async () => {
    const repo = setup();
    const created = await repo.create({ type: 'expense', amountMinor: 100, currency: 'PLN', categoryId: 'cat-food', frictionLevel: 0, wasSkipped: false });
    await repo.delete(created.id);
    expect(await repo.getById(created.id)).toBeNull();
  });
});
