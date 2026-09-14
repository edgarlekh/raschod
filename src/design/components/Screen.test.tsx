import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../ThemeProvider';
import { Screen } from './Screen';

function renderScreen(ui: React.ReactElement) {
  // SafeAreaProvider is required by react-native-safe-area-context outside a
  // real native host (Jest has no window insets) — without it, SafeAreaView
  // renders with a console warning about missing safe area context.
  return render(
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
      <ThemeProvider scheme="dark">{ui}</ThemeProvider>
    </SafeAreaProvider>,
  );
}

describe('Screen', () => {
  it('renders its children', async () => {
    const { getByText } = await renderScreen(
      <Screen>
        <Text>Главная</Text>
      </Screen>,
    );
    expect(getByText('Главная')).toBeTruthy();
  });
});
