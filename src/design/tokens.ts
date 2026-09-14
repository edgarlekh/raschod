export type ColorScheme = 'light' | 'dark';

export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '600' | '700' | '800';
}

export interface Tokens {
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    accent: string;
    onAccent: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  typography: {
    display: TypographyStyle;
    h1: TypographyStyle;
    h2: TypographyStyle;
    h3: TypographyStyle;
    body: TypographyStyle;
    bodyStrong: TypographyStyle;
    caption: TypographyStyle;
    button: TypographyStyle;
  };
  spacing: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
}

const typography: Tokens['typography'] = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800' },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  button: { fontSize: 16, lineHeight: 20, fontWeight: '600' },
};

const spacing: Tokens['spacing'] = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 };
const radius: Tokens['radius'] = { sm: 8, md: 12, lg: 16, xl: 24, pill: 9999 };

export const tokensByScheme: Record<ColorScheme, Tokens> = {
  dark: {
    colors: {
      background: '#05070C',
      surface: '#0D1420',
      surfaceElevated: '#131C2C',
      accent: '#7EC8F2',
      onAccent: '#06121C',
      textPrimary: '#F2F6FA',
      textSecondary: '#93A3B8',
      textMuted: '#5C6B80',
      border: 'rgba(255,255,255,0.08)',
      success: '#5EEAD4',
      warning: '#F5C563',
      danger: '#EF6F6F',
    },
    typography,
    spacing,
    radius,
  },
  light: {
    colors: {
      background: '#F4F7FB',
      surface: '#FFFFFF',
      surfaceElevated: '#E8EEF5',
      accent: '#1E7FB8',
      onAccent: '#FFFFFF',
      textPrimary: '#0B1420',
      textSecondary: '#4B5A6B',
      textMuted: '#7C8A99',
      border: 'rgba(0,0,0,0.08)',
      success: '#1F9E8A',
      warning: '#B8791E',
      danger: '#C24B5C',
    },
    typography,
    spacing,
    radius,
  },
};
