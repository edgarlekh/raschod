import { toCustomTabBarProps, TAB_LABELS } from './tabBarAdapter';

describe('TAB_LABELS', () => {
  it('has a Russian label for every shell route', () => {
    expect(TAB_LABELS).toEqual({
      index: 'Главная',
      history: 'История',
      goals: 'Цели',
      settings: 'Настройки',
    });
  });
});

describe('toCustomTabBarProps', () => {
  it('maps route names to labeled tabs in order', () => {
    const onTabPress = jest.fn();
    const onCapturePress = jest.fn();
    const props = toCustomTabBarProps(['index', 'history', 'goals', 'settings'], 'history', onTabPress, onCapturePress);

    expect(props.tabs).toEqual([
      { key: 'index', label: 'Главная' },
      { key: 'history', label: 'История' },
      { key: 'goals', label: 'Цели' },
      { key: 'settings', label: 'Настройки' },
    ]);
    expect(props.activeKey).toBe('history');
  });

  it('falls back to the raw route name when no label is defined', () => {
    const props = toCustomTabBarProps(['mystery-route'], 'mystery-route', jest.fn(), jest.fn());
    expect(props.tabs).toEqual([{ key: 'mystery-route', label: 'mystery-route' }]);
  });

  it('passes onTabPress and onCapturePress through unchanged', () => {
    const onTabPress = jest.fn();
    const onCapturePress = jest.fn();
    const props = toCustomTabBarProps(['index'], 'index', onTabPress, onCapturePress);

    props.onTabPress('index');
    props.onCapturePress();

    expect(onTabPress).toHaveBeenCalledWith('index');
    expect(onCapturePress).toHaveBeenCalledTimes(1);
  });
});
