// src/data/sqlite/SqliteCategoryRepository.test.ts
import { createTestDb } from '../../../test-utils/createTestDb';
import { SqliteCategoryRepository } from './SqliteCategoryRepository';

describe('SqliteCategoryRepository', () => {
  function setup() {
    const db = createTestDb();
    return new SqliteCategoryRepository(db);
  }

  it('starts empty', async () => {
    const repo = setup();
    expect(await repo.listAll()).toEqual([]);
  });

  it('seeds the 10 default categories when the table is empty', async () => {
    const repo = setup();
    await repo.seedDefaultsIfEmpty();
    const all = await repo.listAll();
    expect(all).toHaveLength(10);
    expect(all.every((c) => c.isCustom === false)).toBe(true);
  });

  it('does not duplicate defaults if seeded twice', async () => {
    const repo = setup();
    await repo.seedDefaultsIfEmpty();
    await repo.seedDefaultsIfEmpty();
    expect(await repo.listAll()).toHaveLength(10);
  });

  it('creates a custom category', async () => {
    const repo = setup();
    const created = await repo.create({ name: 'Хобби', icon: 'palette', color: '#14B8A6' });
    expect(created.isCustom).toBe(true);
    expect(await repo.listAll()).toEqual([created]);
  });

  it('deletes a category', async () => {
    const repo = setup();
    const created = await repo.create({ name: 'Хобби', icon: 'palette', color: '#14B8A6' });
    await repo.delete(created.id);
    expect(await repo.listAll()).toEqual([]);
  });
});
