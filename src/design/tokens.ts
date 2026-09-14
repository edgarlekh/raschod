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
      background: '#0B0F0D',
      surface: '#14181A',
      surfaceElevated: '#1D2422',
      accent: '#B4F461',
      onAccent: '#0B0F0D',
      textPrimary: '#F5F7F3',
      textSecondary: '#9CA69C',
      textMuted: '#6B756B',
      border: 'rgba(255,255,255,0.08)',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
    },
    typography,
    spacing,
    radius,
  },
  light: {
    colors: {
      background: '#F7F9F5',
      surface: '#FFFFFF',
      surfaceElevated: '#EFF3EC',
      accent: '#4C8A1B',
      onAccent: '#FFFFFF',
      textPrimary: '#12140F',
      textSecondary: '#5B645B',
      textMuted: '#8B948B',
      border: 'rgba(0,0,0,0.08)',
      success: '#1E9E6B',
      warning: '#B86A00',
      danger: '#D8433D',
    },
    typography,
    spacing,
    radius,
  },
};
