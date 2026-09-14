export interface BalanceTransaction {
  type: 'income' | 'expense';
  amountMinor: number;
  wasSkipped: boolean;
}

export function calculateBalance(transactions: BalanceTransaction[]): number {
  return transactions.reduce((total, t) => {
    if (t.type === 'income') {
      return total + t.amountMinor;
    }
    if (t.wasSkipped) {
      return total;
    }
    return total - t.amountMinor;
  }, 0);
}
