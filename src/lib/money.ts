export type CurrencyCode = string;

export interface Money {
  amountMinor: number;
  currency: CurrencyCode;
}

export function money(amountMinor: number, currency: CurrencyCode): Money {
  if (!Number.isInteger(amountMinor)) {
    throw new Error(`Money amountMinor must be an integer, got ${amountMinor}`);
  }
  return { amountMinor, currency };
}

export function fromMajor(amountMajor: number, currency: CurrencyCode): Money {
  return money(Math.round(amountMajor * 100), currency);
}

export function toMajor(value: Money): number {
  return value.amountMinor / 100;
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
}

export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amountMinor + b.amountMinor, a.currency);
}

export function subtractMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amountMinor - b.amountMinor, a.currency);
}

export function convertMoney(value: Money, toCurrency: CurrencyCode, rate: number): Money {
  if (rate <= 0) {
    throw new Error('Exchange rate must be positive');
  }
  return money(Math.round(value.amountMinor * rate), toCurrency);
}

export function formatMoney(value: Money): string {
  return `${toMajor(value).toFixed(2)} ${value.currency}`;
}
