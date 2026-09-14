// src/data/sqlite/SqliteGoalRepository.test.ts
import { createTestDb } from '../../../test-utils/createTestDb';
import { SqliteGoalRepository } from './SqliteGoalRepository';

describe('SqliteGoalRepository', () => {
  function setup() {
    const db = createTestDb();
    return new SqliteGoalRepository(db);
  }

  it('creates a goal defaulting currentAmountMinor to 0 and isPrimary to false', async () => {
    const repo = setup();
    const created = await repo.create({ name: 'Наушники', targetAmountMinor: 40000, currency: 'PLN' });
    expect(created.currentAmountMinor).toBe(0);
    expect(created.isPrimary).toBe(false);
    expect(created.deadline).toBeNull();
  });

  it('lists all goals', async () => {
    const repo = setup();
    await repo.create({ name: 'Наушники', targetAmountMinor: 40000, currency: 'PLN' });
    await repo.create({ name: 'Отпуск', targetAmountMinor: 500000, currency: 'PLN' });
    expect(await repo.listAll()).toHaveLength(2);
  });

  it('returns the primary goal', async () => {
    const repo = setup();
    await repo.create({ name: 'Наушники', targetAmountMinor: 40000, currency: 'PLN' });
    const primary = await repo.create({ name: 'Отпуск', targetAmountMinor: 500000, currency: 'PLN', isPrimary: true });
    expect(await repo.getPrimary()).toEqual(primary);
  });

  it('returns null when there is no primary goal', async () => {
    const repo = setup();
    await repo.create({ name: 'Наушники', targetAmountMinor: 40000, currency: 'PLN' });
    expect(await repo.getPrimary()).toBeNull();
  });

  it('adds savings to a goal and returns the updated record', async () => {
    const repo = setup();
    const created = await repo.create({ name: 'Наушники', targetAmountMinor: 40000, currency: 'PLN' });
    const updated = await repo.addSavings(created.id, 5000);
    expect(updated.currentAmountMinor).toBe(5000);
  });

  it('throws when adding savings to a missing goal', async () => {
    const repo = setup();
    await expect(repo.addSavings('missing', 100)).rejects.toThrow('Goal not found: missing');
  });

  it('deletes a goal', async () => {
    const repo = setup();
    const created = await repo.create({ name: 'Наушники', targetAmountMinor: 40000, currency: 'PLN' });
    await repo.delete(created.id);
    expect(await repo.listAll()).toEqual([]);
  });
});
