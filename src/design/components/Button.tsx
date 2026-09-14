import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const theme = useTheme();

  const backgroundColor =
    variant === 'primary' ? theme.colors.accent : variant === 'secondary' ? theme.colors.surface : 'transparent';
  const textColor =
    variant === 'primary' ? theme.colors.onAccent : variant === 'tertiary' ? theme.colors.accent : theme.colors.textPrimary;
  const borderColor = variant === 'tertiary' ? theme.colors.border : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className="flex-row items-center justify-center px-6 py-3 rounded-full border"
      style={{ backgroundColor, borderColor, opacity: disabled ? 0.5 : 1 }}
    >
      <Text style={{ color: textColor, fontSize: theme.typography.button.fontSize, fontWeight: theme.typography.button.fontWeight }}>
        {label}
      </Text>
    </Pressable>
  );
}
