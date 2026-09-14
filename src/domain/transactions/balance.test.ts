import { calculateBalance } from './balance';

describe('calculateBalance', () => {
  it('returns 0 for an empty list', () => {
    expect(calculateBalance([])).toBe(0);
  });

  it('adds income amounts', () => {
    const total = calculateBalance([
      { type: 'income', amountMinor: 500000, wasSkipped: false },
      { type: 'income', amountMinor: 20000, wasSkipped: false },
    ]);
    expect(total).toBe(520000);
  });

  it('subtracts a completed expense', () => {
    const total = calculateBalance([
      { type: 'income', amountMinor: 500000, wasSkipped: false },
      { type: 'expense', amountMinor: 4200, wasSkipped: false },
    ]);
    expect(total).toBe(495800);
  });

  it('excludes a skipped expense from the total', () => {
    const total = calculateBalance([
      { type: 'income', amountMinor: 500000, wasSkipped: false },
      { type: 'expense', amountMinor: 150000, wasSkipped: true },
    ]);
    expect(total).toBe(500000);
  });

  it('nets a mix of income, spent, and skipped transactions', () => {
    const total = calculateBalance([
      { type: 'income', amountMinor: 421800, wasSkipped: false },
      { type: 'expense', amountMinor: 4200, wasSkipped: false },
      { type: 'expense', amountMinor: 1800, wasSkipped: false },
      { type: 'expense', amountMinor: 150000, wasSkipped: true },
    ]);
    expect(total).toBe(415800);
  });
});
