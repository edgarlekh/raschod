import { calculateOpportunityCost } from './opportunityCost';

describe('calculateOpportunityCost', () => {
  it('returns the percent of the remaining goal amount this spend represents', () => {
    expect(
      calculateOpportunityCost(3000, 'PLN', { name: 'Наушники', remainingMinor: 10000, currency: 'PLN' }),
    ).toEqual({ goalName: 'Наушники', percent: 30 });
  });

  it('caps the percent at 100', () => {
    expect(
      calculateOpportunityCost(15000, 'PLN', { name: 'Наушники', remainingMinor: 10000, currency: 'PLN' }),
    ).toEqual({ goalName: 'Наушники', percent: 100 });
  });

  it('returns null when there is no active goal', () => {
    expect(calculateOpportunityCost(3000, 'PLN', null)).toBeNull();
  });

  it('returns null when the goal has nothing remaining', () => {
    expect(
      calculateOpportunityCost(3000, 'PLN', { name: 'Наушники', remainingMinor: 0, currency: 'PLN' }),
    ).toBeNull();
  });

  it('throws when the spend currency does not match the goal currency', () => {
    expect(() =>
      calculateOpportunityCost(3000, 'USD', { name: 'Наушники', remainingMinor: 10000, currency: 'PLN' }),
    ).toThrow('Currency mismatch: spend is USD, goal is PLN');
  });
});
