import { decideFriction, DEFAULT_FRICTION_THRESHOLDS } from './frictionEngine';

describe('decideFriction', () => {
  it('asks nothing below 5.00 in base currency', () => {
    expect(decideFriction(499)).toEqual({ tier: 'none', questionCount: 0, includeOpportunityCost: false });
  });

  it('asks one question from 5.00 up to 30.00', () => {
    expect(decideFriction(500)).toEqual({ tier: 'light', questionCount: 1, includeOpportunityCost: false });
    expect(decideFriction(2999)).toEqual({ tier: 'light', questionCount: 1, includeOpportunityCost: false });
  });

  it('asks two questions from 30.00 up to 100.00', () => {
    expect(decideFriction(3000)).toEqual({ tier: 'medium', questionCount: 2, includeOpportunityCost: false });
    expect(decideFriction(9999)).toEqual({ tier: 'medium', questionCount: 2, includeOpportunityCost: false });
  });

  it('asks category questions plus an opportunity-cost notice at 100.00 and above', () => {
    expect(decideFriction(10000)).toEqual({ tier: 'heavy', questionCount: 3, includeOpportunityCost: true });
  });

  it('rejects a negative amount', () => {
    expect(() => decideFriction(-1)).toThrow('Amount must be non-negative');
  });

  it('accepts custom thresholds', () => {
    const thresholds = { noQuestionBelowMinor: 1000, oneQuestionBelowMinor: 5000, twoQuestionsBelowMinor: 20000 };
    expect(decideFriction(999, thresholds)).toEqual({ tier: 'none', questionCount: 0, includeOpportunityCost: false });
    expect(decideFriction(1000, thresholds)).toEqual({ tier: 'light', questionCount: 1, includeOpportunityCost: false });
  });

  it('exposes the default thresholds as 5 / 30 / 100 major units', () => {
    expect(DEFAULT_FRICTION_THRESHOLDS).toEqual({
      noQuestionBelowMinor: 500,
      oneQuestionBelowMinor: 3000,
      twoQuestionsBelowMinor: 10000,
    });
  });
});
