import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeProvider';

export interface ScreenProps {
  children: React.ReactNode;
}

export function Screen({ children }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
