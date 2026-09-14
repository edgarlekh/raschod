import { calculateGoalProgress } from './goalProgress';

describe('calculateGoalProgress', () => {
  it('calculates percent complete and remaining amount', () => {
    expect(calculateGoalProgress({ targetAmountMinor: 10000, currentAmountMinor: 2500 })).toEqual({
      percentComplete: 25,
      remainingMinor: 7500,
      isComplete: false,
    });
  });

  it('clamps negative current amounts to zero', () => {
    expect(calculateGoalProgress({ targetAmountMinor: 10000, currentAmountMinor: -500 })).toEqual({
      percentComplete: 0,
      remainingMinor: 10000,
      isComplete: false,
    });
  });

  it('caps percent complete at 100 and marks the goal complete', () => {
    expect(calculateGoalProgress({ targetAmountMinor: 10000, currentAmountMinor: 15000 })).toEqual({
      percentComplete: 100,
      remainingMinor: 0,
      isComplete: true,
    });
  });

  it('rejects a non-positive target', () => {
    expect(() => calculateGoalProgress({ targetAmountMinor: 0, currentAmountMinor: 0 })).toThrow(
      'Goal target amount must be positive',
    );
  });
});
