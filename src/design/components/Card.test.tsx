import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { Card } from './Card';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider scheme="dark">{ui}</ThemeProvider>);
}

describe('Card', () => {
  it('renders its children', async () => {
    const { getByText } = await renderWithTheme(
      <Card>
        <Text>Наушники</Text>
      </Card>,
    );
    expect(getByText('Наушники')).toBeTruthy();
  });

  it('defaults to the surface variant background color', async () => {
    const { getByTestId } = await renderWithTheme(
      <Card>
        <Text>Наушники</Text>
      </Card>,
    );
    expect(getByTestId('card')).toHaveProp('style', expect.objectContaining({ backgroundColor: '#14181A' }));
  });

  it('uses the elevated variant background color when specified', async () => {
    const { getByTestId } = await renderWithTheme(
      <Card variant="elevated">
        <Text>Наушники</Text>
      </Card>,
    );
    expect(getByTestId('card')).toHaveProp('style', expect.objectContaining({ backgroundColor: '#1D2422' }));
  });
});
