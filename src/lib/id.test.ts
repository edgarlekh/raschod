import { generateId } from './id';

describe('generateId', () => {
  it('returns a unique string each call', () => {
    const a = generateId();
    const b = generateId();
    expect(a).not.toBe(b);
    expect(typeof a).toBe('string');
    expect(a.length).toBeGreaterThan(0);
  });
});
