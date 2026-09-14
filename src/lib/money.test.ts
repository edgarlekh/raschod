import { money, fromMajor, toMajor, addMoney, subtractMoney, convertMoney, formatMoney } from './money';

describe('money', () => {
  it('rejects non-integer minor amounts', () => {
    expect(() => money(10.5, 'USD')).toThrow('Money amountMinor must be an integer, got 10.5');
  });

  it('creates a Money value from minor units', () => {
    expect(money(1000, 'USD')).toEqual({ amountMinor: 1000, currency: 'USD' });
  });
});

describe('fromMajor / toMajor', () => {
  it('converts a major amount to minor units', () => {
    expect(fromMajor(12.5, 'PLN')).toEqual({ amountMinor: 1250, currency: 'PLN' });
  });

  it('converts minor units back to a major amount', () => {
    expect(toMajor({ amountMinor: 1250, currency: 'PLN' })).toBe(12.5);
  });

  it('rounds fractional minor units from floating point input', () => {
    expect(fromMajor(0.1 + 0.2, 'USD').amountMinor).toBe(30);
  });
});

describe('addMoney / subtractMoney', () => {
  it('adds two amounts in the same currency', () => {
    expect(addMoney(money(500, 'USD'), money(250, 'USD'))).toEqual({ amountMinor: 750, currency: 'USD' });
  });

  it('subtracts two amounts in the same currency', () => {
    expect(subtractMoney(money(500, 'USD'), money(250, 'USD'))).toEqual({ amountMinor: 250, currency: 'USD' });
  });

  it('throws on currency mismatch when adding', () => {
    expect(() => addMoney(money(500, 'USD'), money(250, 'PLN'))).toThrow('Currency mismatch: USD vs PLN');
  });
});

describe('convertMoney', () => {
  it('converts an amount to another currency using a manual rate', () => {
    expect(convertMoney(money(1000, 'USD'), 'PLN', 4)).toEqual({ amountMinor: 4000, currency: 'PLN' });
  });

  it('rejects a non-positive rate', () => {
    expect(() => convertMoney(money(1000, 'USD'), 'PLN', 0)).toThrow('Exchange rate must be positive');
  });
});

describe('formatMoney', () => {
  it('formats a positive amount with two decimal places and the currency code', () => {
    expect(formatMoney(money(12550, 'PLN'))).toBe('125.50 PLN');
  });

  it('formats a whole-number amount with trailing zeros', () => {
    expect(formatMoney(money(500000, 'USD'))).toBe('5000.00 USD');
  });

  it('formats a negative amount with a leading minus sign', () => {
    expect(formatMoney(money(-2500, 'RUB'))).toBe('-25.00 RUB');
  });
});
