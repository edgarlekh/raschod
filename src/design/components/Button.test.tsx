import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { Button } from './Button';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider scheme="dark">{ui}</ThemeProvider>);
}

describe('Button', () => {
  it('renders its label', async () => {
    const { getByText } = await renderWithTheme(<Button label="Добавить" onPress={() => {}} />);
    expect(getByText('Добавить')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithTheme(<Button label="Добавить" onPress={onPress} />);
    await fireEvent.press(getByText('Добавить'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithTheme(<Button label="Добавить" onPress={onPress} disabled />);
    await fireEvent.press(getByText('Добавить'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes an accessible button role', async () => {
    const { getByRole } = await renderWithTheme(<Button label="Добавить" onPress={() => {}} />);
    expect(getByRole('button')).toBeTruthy();
  });

  it('defaults to the primary variant', async () => {
    const { getByRole } = await renderWithTheme(<Button label="Добавить" onPress={() => {}} />);
    expect(getByRole('button').props.accessibilityState?.disabled).toBeFalsy();
  });

  it('marks disabled buttons as accessibilityState disabled', async () => {
    const { getByRole } = await renderWithTheme(<Button label="Добавить" onPress={() => {}} disabled />);
    expect(getByRole('button').props.accessibilityState?.disabled).toBe(true);
  });
});
