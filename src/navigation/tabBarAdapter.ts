import type { CustomTabBarProps } from './CustomTabBar';

export const TAB_LABELS: Record<string, string> = {
  index: 'Главная',
  history: 'История',
  goals: 'Цели',
  settings: 'Настройки',
};

export function toCustomTabBarProps(
  routeNames: string[],
  activeRouteName: string,
  onTabPress: (key: string) => void,
  onCapturePress: () => void,
): CustomTabBarProps {
  return {
    tabs: routeNames.map((name) => ({ key: name, label: TAB_LABELS[name] ?? name })),
    activeKey: activeRouteName,
    onTabPress,
    onCapturePress,
  };
}
