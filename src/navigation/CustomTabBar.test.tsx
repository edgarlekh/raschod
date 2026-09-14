import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../design/ThemeProvider';
import { CustomTabBar, type TabBarItem } from './CustomTabBar';

const tabs: TabBarItem[] = [
  { key: 'index', label: 'Главная' },
  { key: 'history', label: 'История' },
  { key: 'goals', label: 'Цели' },
  { key: 'settings', label: 'Настройки' },
];

async function renderTabBar(overrides: Partial<React.ComponentProps<typeof CustomTabBar>> = {}) {
  const onTabPress = jest.fn();
  const onCapturePress = jest.fn();
  const utils = await render(
    <ThemeProvider scheme="dark">
      <CustomTabBar tabs={tabs} activeKey="index" onTabPress={onTabPress} onCapturePress={onCapturePress} {...overrides} />
    </ThemeProvider>,
  );
  return { ...utils, onTabPress, onCapturePress };
}

describe('CustomTabBar', () => {
  it('renders every tab label', async () => {
    const { getByText } = await renderTabBar();
    for (const tab of tabs) {
      expect(getByText(tab.label)).toBeTruthy();
    }
  });

  it('calls onTabPress with the pressed tab key', async () => {
    const { getByText, onTabPress } = await renderTabBar();
    await fireEvent.press(getByText('История'));
    expect(onTabPress).toHaveBeenCalledWith('history');
  });

  it('marks the active tab as selected for accessibility', async () => {
    const { getByRole } = await renderTabBar({ activeKey: 'goals' });
    expect(getByRole('tab', { name: 'Цели' }).props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it('calls onCapturePress when the floating capture button is pressed', async () => {
    const { getByLabelText, onCapturePress } = await renderTabBar();
    await fireEvent.press(getByLabelText('Быстрый ввод'));
    expect(onCapturePress).toHaveBeenCalledTimes(1);
  });
});
