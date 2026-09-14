import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../ThemeProvider';

export interface GoalProgressBarProps {
  percent: number;
}

export function GoalProgressBar({ percent }: GoalProgressBarProps) {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View
      testID="goal-progress-track"
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      style={{
        height: 8,
        borderRadius: theme.radius.pill,
        backgroundColor: theme.colors.surfaceElevated,
        overflow: 'hidden',
      }}
    >
      <View
        testID="goal-progress-fill"
        style={{
          height: '100%',
          width: `${clamped}%`,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.accent,
        }}
      />
    </View>
  );
}
