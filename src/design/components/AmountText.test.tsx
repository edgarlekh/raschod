import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { AmountText } from './AmountText';
import { money } from '../../lib/money';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider scheme="dark">{ui}</ThemeProvider>);
}

describe('AmountText', () => {
  it('renders the formatted amount', async () => {
    const { getByText } = await renderWithTheme(<AmountText money={money(12550, 'PLN')} />);
    expect(getByText('125.50 PLN')).toBeTruthy();
  });

  it('colors an income amount with the success token', async () => {
    const { getByText } = await renderWithTheme(<AmountText money={money(12550, 'PLN')} kind="income" />);
    expect(getByText('125.50 PLN').props.style).toEqual(
      expect.objectContaining({ color: '#34D399' }),
    );
  });

  it('colors an expense amount with the primary text token by default', async () => {
    const { getByText } = await renderWithTheme(<AmountText money={money(12550, 'PLN')} kind="expense" />);
    expect(getByText('125.50 PLN').props.style).toEqual(
      expect.objectContaining({ color: '#F5F7F3' }),
    );
  });

  it('applies the display typography scale when style="display"', async () => {
    const { getByText } = await renderWithTheme(<AmountText money={money(12550, 'PLN')} style="display" />);
    expect(getByText('125.50 PLN').props.style).toEqual(
      expect.objectContaining({ fontSize: 34, fontWeight: '800' }),
    );
  });

  it('applies the body typography scale by default', async () => {
    const { getByText } = await renderWithTheme(<AmountText money={money(12550, 'PLN')} />);
    expect(getByText('125.50 PLN').props.style).toEqual(
      expect.objectContaining({ fontSize: 16, fontWeight: '400' }),
    );
  });
});
