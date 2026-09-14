import { calculateOpportunityCost } from './opportunityCost';

describe('calculateOpportunityCost', () => {
  it('returns the percent of the remaining goal amount this spend represents', () => {
    expect(
      calculateOpportunityCost(3000, { name: 'Наушники', remainingMinor: 10000, currency: 'PLN' }),
    ).toEqual({ goalName: 'Наушники', percent: 30 });
  });

  it('caps the percent at 100', () => {
    expect(
      calculateOpportunityCost(15000, { name: 'Наушники', remainingMinor: 10000, currency: 'PLN' }),
    ).toEqual({ goalName: 'Наушники', percent: 100 });
  });

  it('returns null when there is no active goal', () => {
    expect(calculateOpportunityCost(3000, null)).toBeNull();
  });

  it('returns null when the goal has nothing remaining', () => {
    expect(
      calculateOpportunityCost(3000, { name: 'Наушники', remainingMinor: 0, currency: 'PLN' }),
    ).toBeNull();
  });
});
