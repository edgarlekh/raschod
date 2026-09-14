import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { tokensByScheme, type ColorScheme, type Tokens } from './tokens';

const ThemeContext = createContext<Tokens | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Override the resolved scheme — primarily for tests; screens should omit this and follow the system setting. */
  scheme?: ColorScheme;
}

export function ThemeProvider({ children, scheme }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const resolvedScheme: ColorScheme = scheme ?? (systemScheme === 'light' ? 'light' : 'dark');
  const value = useMemo(() => tokensByScheme[resolvedScheme], [resolvedScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Tokens {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return value;
}
