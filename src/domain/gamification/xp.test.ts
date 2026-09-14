import { calculateXpGain, calculateLevel } from './xp';

describe('calculateXpGain', () => {
  it('awards no XP when the transaction was not skipped', () => {
    expect(calculateXpGain('heavy', false)).toBe(0);
  });

  it('awards no XP for a "none" tier even if marked skipped', () => {
    expect(calculateXpGain('none', true)).toBe(0);
  });

  it('awards increasing XP for higher friction tiers', () => {
    expect(calculateXpGain('light', true)).toBe(5);
    expect(calculateXpGain('medium', true)).toBe(15);
    expect(calculateXpGain('heavy', true)).toBe(30);
  });
});

describe('calculateLevel', () => {
  it('starts at level 1 with 0 total XP', () => {
    expect(calculateLevel(0)).toEqual({ level: 1, xpIntoLevel: 0, xpForNextLevel: 100 });
  });

  it('advances a level every 100 XP', () => {
    expect(calculateLevel(150)).toEqual({ level: 2, xpIntoLevel: 50, xpForNextLevel: 100 });
    expect(calculateLevel(300)).toEqual({ level: 4, xpIntoLevel: 0, xpForNextLevel: 100 });
  });

  it('rejects negative XP', () => {
    expect(() => calculateLevel(-1)).toThrow('XP cannot be negative');
  });
});
