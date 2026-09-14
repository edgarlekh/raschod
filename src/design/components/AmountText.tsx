import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { formatMoney, type Money } from '../../lib/money';

export interface AmountTextProps {
  money: Money;
  kind?: 'income' | 'expense' | 'neutral';
  style?: 'display' | 'body' | 'bodyStrong';
}

export function AmountText({ money: value, kind = 'neutral', style = 'body' }: AmountTextProps) {
  const theme = useTheme();

  // Only income gets the special success-green treatment; expense and neutral
  // both stay neutral text — `danger` is reserved for over-budget/error states
  // a future screen-level component applies explicitly, not the default
  // per-row expense color.
  const color = kind === 'income' ? theme.colors.success : theme.colors.textPrimary;
  const typographyStyle = theme.typography[style];

  return (
    <Text style={{ color, fontSize: typographyStyle.fontSize, fontWeight: typographyStyle.fontWeight }}>
      {formatMoney(value)}
    </Text>
  );
}
