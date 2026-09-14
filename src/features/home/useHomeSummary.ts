// src/features/home/useHomeSummary.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TransactionRepository } from '../../data/repositories/TransactionRepository';
import type { GoalRepository } from '../../data/repositories/GoalRepository';
import type { CategoryRepository } from '../../data/repositories/CategoryRepository';
import type { GamificationRepository } from '../../data/repositories/GamificationRepository';
import { calculateBalance } from '../../domain/transactions/balance';
import { calculateGoalProgress, type GoalProgress } from '../../domain/goals/goalProgress';

export interface HomeSummaryDeps {
  transactionRepository: TransactionRepository;
  goalRepository: GoalRepository;
  categoryRepository: CategoryRepository;
  gamificationRepository: GamificationRepository;
}

export interface HomeRecentTransaction {
  id: string;
  amountMinor: number;
  currency: string;
  type: 'income' | 'expense';
  categoryName: string;
  createdAt: string;
}

export interface HomeGoalSummary {
  name: string;
  currency: string;
  targetAmountMinor: number;
  currentAmountMinor: number;
  progress: GoalProgress;
}

export interface HomeSummary {
  currency: string;
  balanceMinor: number;
  savedFromFrictionMinor: number;
  goal: HomeGoalSummary | null;
  recentTransactions: HomeRecentTransaction[];
}

export interface UseHomeSummaryResult {
  data: HomeSummary | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const DEFAULT_CURRENCY = 'PLN';
const RECENT_TRANSACTIONS_LIMIT = 5;

export function useHomeSummary(deps: HomeSummaryDeps): UseHomeSummaryResult {
  const [data, setData] = useState<HomeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const [goal, allTransactions, categories, gamification] = await Promise.all([
        deps.goalRepository.getPrimary(),
        deps.transactionRepository.list(),
        deps.categoryRepository.listAll(),
        deps.gamificationRepository.getState(),
      ]);

      if (requestId !== requestIdRef.current) {
        return; // a newer load() started; discard this stale result
      }

      const realAllTransactions = allTransactions.filter((t) => !t.wasSkipped);
      const currency = goal?.currency ?? realAllTransactions[0]?.currency ?? DEFAULT_CURRENCY;
      const homeCurrencyTransactions = allTransactions.filter((t) => t.currency === currency);
      const realTransactions = homeCurrencyTransactions.filter((t) => !t.wasSkipped);

      const balanceMinor = calculateBalance(homeCurrencyTransactions);

      const categoryById = new Map(categories.map((c) => [c.id, c]));
      const recentTransactions: HomeRecentTransaction[] = realTransactions
        .slice(0, RECENT_TRANSACTIONS_LIMIT)
        .map((t) => ({
          id: t.id,
          amountMinor: t.amountMinor,
          currency: t.currency,
          type: t.type,
          categoryName: categoryById.get(t.categoryId)?.name ?? 'Прочее',
          createdAt: t.createdAt,
        }));

      const goalSummary: HomeGoalSummary | null = goal
        ? {
            name: goal.name,
            currency: goal.currency,
            targetAmountMinor: goal.targetAmountMinor,
            currentAmountMinor: goal.currentAmountMinor,
            progress: calculateGoalProgress({
              targetAmountMinor: goal.targetAmountMinor,
              currentAmountMinor: goal.currentAmountMinor,
            }),
          }
        : null;

      setData({
        currency,
        balanceMinor,
        savedFromFrictionMinor: gamification.totalSavedMinor,
        goal: goalSummary,
        recentTransactions,
      });
    } catch (e) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [deps.goalRepository, deps.transactionRepository, deps.categoryRepository, deps.gamificationRepository]);

  useEffect(() => {
    // Intentional fetch-on-mount: load() calls setState internally, which is
    // exactly the async-load pattern this rule normally warns about, but this
    // effect only runs once per stable `load` identity (see the deps array
    // above), so it's a deliberate, guarded mount-time fetch, not a footgun.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
