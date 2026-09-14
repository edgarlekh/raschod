import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../design/ThemeProvider';

export interface TabBarItem {
  key: string;
  label: string;
}

export interface CustomTabBarProps {
  tabs: TabBarItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
  onCapturePress: () => void;
}

export function CustomTabBar({ tabs, activeKey, onTabPress, onCapturePress }: CustomTabBarProps) {
  const theme = useTheme();
  const mid = Math.ceil(tabs.length / 2);
  const left = tabs.slice(0, mid);
  const right = tabs.slice(mid);

  const renderTab = (tab: TabBarItem) => {
    const isActive = tab.key === activeKey;
    return (
      <Pressable
        key={tab.key}
        onPress={() => onTabPress(tab.key)}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        style={{ flex: 1, alignItems: 'center', paddingVertical: theme.spacing.sm }}
      >
        <Text style={{ color: isActive ? theme.colors.accent : theme.colors.textSecondary, fontSize: theme.typography.caption.fontSize }}>
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
        paddingHorizontal: theme.spacing.sm,
        paddingBottom: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
      }}
    >
      {left.map(renderTab)}
      <Pressable
        onPress={onCapturePress}
        accessibilityRole="button"
        accessibilityLabel="Быстрый ввод"
        style={{
          width: 56,
          height: 56,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -theme.spacing.xl,
        }}
      >
        <Text style={{ color: theme.colors.onAccent, fontSize: 28, lineHeight: 28 }}>+</Text>
      </Pressable>
      {right.map(renderTab)}
    </View>
  );
}
