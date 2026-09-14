// src/features/home/useHomeSummary.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { useHomeSummary, type HomeSummaryDeps } from './useHomeSummary';
import type { TransactionRecord } from '../../data/repositories/TransactionRepository';
import type { GoalRecord } from '../../data/repositories/GoalRepository';
import type { CategoryRecord } from '../../data/repositories/CategoryRepository';
import type { GamificationStateRecord } from '../../data/repositories/GamificationRepository';

function makeTransaction(overrides: Partial<TransactionRecord> = {}): TransactionRecord {
  return {
    id: 'tx-1',
    type: 'expense',
    amountMinor: 4200,
    currency: 'PLN',
    categoryId: 'cat-food',
    note: null,
    createdAt: '2026-09-14T10:00:00.000Z',
    frictionLevel: 0,
    wasSkipped: false,
    ...overrides,
  };
}

function makeGoal(overrides: Partial<GoalRecord> = {}): GoalRecord {
  return {
    id: 'goal-1',
    name: 'Наушники',
    targetAmountMinor: 40000,
    currentAmountMinor: 24800,
    currency: 'PLN',
    deadline: null,
    isPrimary: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeCategory(overrides: Partial<CategoryRecord> = {}): CategoryRecord {
  return { id: 'cat-food', name: 'Еда', icon: 'utensils', color: '#F97316', isCustom: false, ...overrides };
}

const defaultGamificationState: GamificationStateRecord = {
  xp: 120,
  level: 2,
  currentStreakDays: 3,
  longestStreakDays: 5,
  lastActivityDate: '2026-09-14',
  totalSavedMinor: 134000,
};

function makeDeps(overrides: {
  goal?: GoalRecord | null;
  transactions?: TransactionRecord[];
  categories?: CategoryRecord[];
  gamification?: GamificationStateRecord;
} = {}): HomeSummaryDeps {
  const goal = overrides.goal === undefined ? makeGoal() : overrides.goal;
  const transactions = overrides.transactions ?? [makeTransaction()];
  const categories = overrides.categories ?? [makeCategory()];
  const gamification = overrides.gamification ?? defaultGamificationState;

  return {
    goalRepository: {
      create: jest.fn(),
      listAll: jest.fn(),
      getPrimary: jest.fn().mockResolvedValue(goal),
      addSavings: jest.fn(),
      delete: jest.fn(),
    },
    transactionRepository: {
      create: jest.fn(),
      list: jest.fn().mockResolvedValue(transactions),
      getById: jest.fn(),
      delete: jest.fn(),
    },
    categoryRepository: {
      listAll: jest.fn().mockResolvedValue(categories),
      create: jest.fn(),
      delete: jest.fn(),
      seedDefaultsIfEmpty: jest.fn(),
    },
    gamificationRepository: {
      getState: jest.fn().mockResolvedValue(gamification),
      updateState: jest.fn(),
      listBadges: jest.fn(),
      awardBadge: jest.fn(),
    },
  };
}

describe('useHomeSummary', () => {
  jest.setTimeout(30000); // Increase timeout for all tests in this suite

  it('starts in a loading state with no data', async () => {
    const deps = makeDeps();
    // Leave the primary-goal fetch pending so the hook is still mid-load when we inspect
    // it — resolving immediately (like the other tests' mocks) would let renderHook's
    // async settling flush straight through to the loaded state before this assertion runs.
    (deps.goalRepository.getPrimary as jest.Mock).mockReturnValue(new Promise<GoalRecord | null>(() => {}));
    const { result } = await renderHook(() => useHomeSummary(deps));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('builds a summary from the primary goal, transactions, categories, and gamification state', async () => {
    const deps = makeDeps();
    const { result } = await renderHook(() => useHomeSummary(deps));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({
      currency: 'PLN',
      balanceMinor: -4200,
      savedFromFrictionMinor: 134000,
      goal: {
        name: 'Наушники',
        currency: 'PLN',
        targetAmountMinor: 40000,
        currentAmountMinor: 24800,
        progress: { percentComplete: 62, remainingMinor: 15200, isComplete: false },
      },
      recentTransactions: [
        {
          id: 'tx-1',
          amountMinor: 4200,
          currency: 'PLN',
          type: 'expense',
          categoryName: 'Еда',
          createdAt: '2026-09-14T10:00:00.000Z',
        },
      ],
    });
  });

  it('reports a null goal when there is no primary goal, falling back to the newest transaction currency', async () => {
    const deps = makeDeps({ goal: null, transactions: [makeTransaction({ currency: 'USD' })] });
    const { result } = await renderHook(() => useHomeSummary(deps));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data?.goal).toBeNull();
    expect(result.current.data?.currency).toBe('USD');
  });

  it('falls back to PLN when there is neither a goal nor any transaction', async () => {
    const deps = makeDeps({ goal: null, transactions: [] });
    const { result } = await renderHook(() => useHomeSummary(deps));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data?.currency).toBe('PLN');
    expect(result.current.data?.balanceMinor).toBe(0);
    expect(result.current.data?.recentTransactions).toEqual([]);
  });

  it('excludes skipped expenses from the balance and from recent transactions', async () => {
    const deps = makeDeps({
      transactions: [
        makeTransaction({ id: 'tx-real', amountMinor: 4200, wasSkipped: false }),
        makeTransaction({ id: 'tx-skipped', amountMinor: 150000, wasSkipped: true }),
      ],
    });
    const { result } = await renderHook(() => useHomeSummary(deps));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data?.balanceMinor).toBe(-4200);
    expect(result.current.data?.recentTransactions.map((t) => t.id)).toEqual(['tx-real']);
  });

  it('excludes transactions in a different currency than the resolved home currency', async () => {
    const deps = makeDeps({
      transactions: [
        makeTransaction({ id: 'tx-pln', amountMinor: 4200, currency: 'PLN' }),
        makeTransaction({ id: 'tx-usd', amountMinor: 1000, currency: 'USD' }),
      ],
    });
    const { result } = await renderHook(() => useHomeSummary(deps));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data?.currency).toBe('PLN');
    expect(result.current.data?.balanceMinor).toBe(-4200);
    expect(result.current.data?.recentTransactions.map((t) => t.id)).toEqual(['tx-pln']);
  });

  it('falls back to "Прочее" when a transaction references a deleted or missing category', async () => {
    const deps = makeDeps({ categories: [] });
    const { result } = await renderHook(() => useHomeSummary(deps));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data?.recentTransactions[0].categoryName).toBe('Прочее');
  });

  it('sets an error and stops loading when a repository call rejects', async () => {
    const deps = makeDeps();
    (deps.transactionRepository.list as jest.Mock).mockRejectedValue(new Error('db unavailable'));
    const { result } = await renderHook(() => useHomeSummary(deps));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(new Error('db unavailable'));
  });

  it('refetches when refresh is called', async () => {
    const deps = makeDeps();
    const { result } = await renderHook(() => useHomeSummary(deps));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(deps.transactionRepository.list).toHaveBeenCalledTimes(1);
    await result.current.refresh();
    expect(deps.transactionRepository.list).toHaveBeenCalledTimes(2);
  });
});
