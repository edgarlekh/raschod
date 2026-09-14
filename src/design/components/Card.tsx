import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../ThemeProvider';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'surface' | 'elevated';
}

export function Card({ children, variant = 'surface' }: CardProps) {
  const theme = useTheme();
  const backgroundColor = variant === 'elevated' ? theme.colors.surfaceElevated : theme.colors.surface;

  return (
    <View testID="card" className="p-4 rounded-2xl" style={{ backgroundColor }}>
      {children}
    </View>
  );
}
