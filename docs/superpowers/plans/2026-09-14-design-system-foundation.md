# Design System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up NativeWind styling and ship the first layer of the design system as code — tokens, theme resolution, and three primitive components (`Button`, `Card`, `AmountText`) — so future screen plans style against a settled system instead of inventing colors/spacing per screen.

**Architecture:** `src/design/tokens.ts` holds pure data (no React, no I/O) matching the design addendum exactly. `src/design/ThemeProvider.tsx` resolves the system color scheme to the right token set and exposes it via a `useTheme()` hook. `src/design/components/*` are presentational, NativeWind-styled, tested on behavior/content/accessibility — never on computed CSS output (NativeWind's own correctness is out of this project's test scope).

**Tech Stack:** NativeWind v4 + Tailwind CSS v3 (stable, well-documented pairing — not the v5/Tailwind-v4 preview combo), React Native's built-in `useColorScheme`, `@testing-library/react-native` (added this task) on the existing `jest-expo` preset.

**Spec:** `docs/superpowers/specs/2026-09-14-design-system-addendum.md` (tokens, typography, spacing, radius, motion — this plan implements everything in that file except "Screens themselves", which stays out of scope here).

## Global Constraints

- `src/design/tokens.ts` must contain zero React/React Native imports — pure data, unit-testable without a renderer.
- Component tests assert on rendered text, props, accessibility roles, and press behavior — never on computed style/CSS values (NativeWind's compiled-style correctness is the library's own concern, not this project's).
- Hex colors in tokens exactly match the values in the design addendum — no substitutions.
- Every new file with logic gets a co-located test file; tests are written before implementation (TDD).
- Commit after each task with a Conventional Commit message, ending with:
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01CJK6Deau3G4vnNiRoDjNcr`.
- Keep `npm run lint`, `npm run typecheck`, and `npm test` green after every task (currently: lint 0/0, typecheck 0 errors, 65 tests passing).

---

### Task 1: Install and configure NativeWind

**Files:**
- Modify: `package.json` (dependencies)
- Create: `babel.config.js`
- Create: `metro.config.js`
- Create: `tailwind.config.js`
- Create: `global.css`
- Create: `nativewind-env.d.ts`
- Modify: `tsconfig.json` (add `include`)
- Modify: `App.tsx` (side-effect import of `global.css`)

**Interfaces:**
- Produces: a working NativeWind build pipeline — `className` props resolve to styles at runtime. No new exported TS interfaces.

- [ ] **Step 1: Install dependencies**

Run:
```bash
npx expo install nativewind react-native-reanimated react-native-safe-area-context
npm install -D tailwindcss@^3.4.0
npm install -D @testing-library/react-native
```

- [ ] **Step 2: Create `babel.config.js`**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

- [ ] **Step 3: Create `metro.config.js`**

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

- [ ] **Step 4: Create `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 5: Create `global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 6: Create `nativewind-env.d.ts`**

```typescript
/// <reference types="nativewind/types" />
```

- [ ] **Step 7: Update `tsconfig.json` to include the new declaration file**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "types": ["jest", "node"]
  },
  "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts"]
}
```

- [ ] **Step 8: Add the CSS side-effect import to `App.tsx`**

Add as the first import line in `App.tsx` (above the existing imports):
```typescript
import './global.css';
```

- [ ] **Step 9: Verify**

Run: `npm run typecheck && npm run lint && npm test`
Expected: all three stay clean (0 typecheck errors, 0 lint errors/warnings, 65 tests still passing — this task adds no new tests, it's pure config).

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json babel.config.js metro.config.js tailwind.config.js global.css nativewind-env.d.ts tsconfig.json App.tsx
git commit -m "chore: install and configure NativeWind"
```

---

### Task 2: Design tokens

**Files:**
- Create: `src/design/tokens.ts`
- Test: `src/design/tokens.test.ts`

**Interfaces:**
- Produces: `ColorScheme` (`'light' | 'dark'`), `Tokens` (shape: `colors`, `typography`, `spacing`, `radius`), `tokensByScheme: Record<ColorScheme, Tokens>` — consumed by `ThemeProvider` (Task 3) and every component (Tasks 4-6).

- [ ] **Step 1: Write the failing tests**

```typescript
// src/design/tokens.test.ts
import { tokensByScheme } from './tokens';

const HEX_OR_RGBA = /^#[0-9A-Fa-f]{6}$|^rgba\(\d+,\d+,\d+,[\d.]+\)$/;

describe('tokensByScheme', () => {
  it('has both a light and a dark theme', () => {
    expect(Object.keys(tokensByScheme).sort()).toEqual(['dark', 'light']);
  });

  it('every color in both themes is a valid hex or rgba value', () => {
    for (const scheme of ['light', 'dark'] as const) {
      for (const [key, value] of Object.entries(tokensByScheme[scheme].colors)) {
        expect(value).toMatch(HEX_OR_RGBA);
      }
    }
  });

  it('both themes define exactly the same set of color keys', () => {
    const lightKeys = Object.keys(tokensByScheme.light.colors).sort();
    const darkKeys = Object.keys(tokensByScheme.dark.colors).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it('dark theme accent matches the design addendum', () => {
    expect(tokensByScheme.dark.colors.accent).toBe('#B4F461');
    expect(tokensByScheme.dark.colors.onAccent).toBe('#0B0F0D');
  });

  it('light theme accent matches the design addendum', () => {
    expect(tokensByScheme.light.colors.accent).toBe('#4C8A1B');
    expect(tokensByScheme.light.colors.onAccent).toBe('#FFFFFF');
  });

  it('typography defines the display and button scales', () => {
    expect(tokensByScheme.dark.typography.display).toEqual({ fontSize: 34, lineHeight: 40, fontWeight: '800' });
    expect(tokensByScheme.dark.typography.button).toEqual({ fontSize: 16, lineHeight: 20, fontWeight: '600' });
  });

  it('spacing and radius scales are identical across themes (theme-independent)', () => {
    expect(tokensByScheme.light.spacing).toEqual(tokensByScheme.dark.spacing);
    expect(tokensByScheme.light.radius).toEqual(tokensByScheme.dark.radius);
  });

  it('spacing scale matches the design addendum', () => {
    expect(tokensByScheme.dark.spacing).toEqual({ xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 });
  });

  it('radius scale matches the design addendum', () => {
    expect(tokensByScheme.dark.radius).toEqual({ sm: 8, md: 12, lg: 16, xl: 24, pill: 9999 });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tokens.test.ts`
Expected: FAIL — `Cannot find module './tokens'`

- [ ] **Step 3: Implement**

```typescript
// src/design/tokens.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tokens.test.ts`
Expected: PASS (9 tests)

- [ ] **Step 5: Commit**

```bash
git add src/design/tokens.ts src/design/tokens.test.ts
git commit -m "feat: add design system tokens (colors, typography, spacing, radius)"
```

---

### Task 3: ThemeProvider and useTheme hook

**Files:**
- Create: `src/design/ThemeProvider.tsx`
- Test: `src/design/ThemeProvider.test.tsx`

**Interfaces:**
- Consumes: `Tokens`, `ColorScheme`, `tokensByScheme` from `src/design/tokens.ts` (Task 2).
- Produces: `ThemeProvider` (React component, accepts optional `scheme` override prop for testability), `useTheme(): Tokens` — consumed by every component in Tasks 4-6 and every future screen.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/design/ThemeProvider.test.tsx
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from './ThemeProvider';

function Probe() {
  const theme = useTheme();
  return <Text testID="probe">{theme.colors.accent}</Text>;
}

describe('ThemeProvider / useTheme', () => {
  it('provides the dark theme by default when scheme is not overridden and system scheme is unavailable', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    // jsdom/test environment has no system color scheme -> falls back to 'dark'
    expect(getByTestId('probe').props.children).toBe('#B4F461');
  });

  it('provides the light theme when scheme="light" is passed explicitly', () => {
    const { getByTestId } = render(
      <ThemeProvider scheme="light">
        <Probe />
      </ThemeProvider>,
    );
    expect(getByTestId('probe').props.children).toBe('#4C8A1B');
  });

  it('provides the dark theme when scheme="dark" is passed explicitly', () => {
    const { getByTestId } = render(
      <ThemeProvider scheme="dark">
        <Probe />
      </ThemeProvider>,
    );
    expect(getByTestId('probe').props.children).toBe('#B4F461');
  });

  it('throws a clear error when useTheme is called outside a ThemeProvider', () => {
    function Orphan() {
      useTheme();
      return null;
    }
    // Suppress the expected React error-boundary console output for this one assertion
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useTheme must be used within a ThemeProvider');
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- ThemeProvider.test.tsx`
Expected: FAIL — `Cannot find module './ThemeProvider'`

- [ ] **Step 3: Implement**

```tsx
// src/design/ThemeProvider.tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- ThemeProvider.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/design/ThemeProvider.tsx src/design/ThemeProvider.test.tsx
git commit -m "feat: add ThemeProvider and useTheme hook resolving system color scheme"
```

---

### Task 4: Button primitive

**Files:**
- Create: `src/design/components/Button.tsx`
- Test: `src/design/components/Button.test.tsx`

**Interfaces:**
- Consumes: `useTheme` from `src/design/ThemeProvider.tsx` (Task 3) — used only to read `colors.accent`/`colors.surface` for inline style fallback where NativeWind can't express a dynamic token (see implementation note).
- Produces: `Button` component with props `{ label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'tertiary'; disabled?: boolean }` — consumed by every future screen.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/design/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { Button } from './Button';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider scheme="dark">{ui}</ThemeProvider>);
}

describe('Button', () => {
  it('renders its label', () => {
    const { getByText } = renderWithTheme(<Button label="Добавить" onPress={() => {}} />);
    expect(getByText('Добавить')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(<Button label="Добавить" onPress={onPress} />);
    fireEvent.press(getByText('Добавить'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(<Button label="Добавить" onPress={onPress} disabled />);
    fireEvent.press(getByText('Добавить'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes an accessible button role', () => {
    const { getByRole } = renderWithTheme(<Button label="Добавить" onPress={() => {}} />);
    expect(getByRole('button')).toBeTruthy();
  });

  it('defaults to the primary variant', () => {
    const { getByRole } = renderWithTheme(<Button label="Добавить" onPress={() => {}} />);
    expect(getByRole('button').props.accessibilityState?.disabled).toBeFalsy();
  });

  it('marks disabled buttons as accessibilityState disabled', () => {
    const { getByRole } = renderWithTheme(<Button label="Добавить" onPress={() => {}} disabled />);
    expect(getByRole('button').props.accessibilityState?.disabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- Button.test.tsx`
Expected: FAIL — `Cannot find module './Button'`

- [ ] **Step 3: Implement**

NativeWind's `className` cannot express our exact token hex values without duplicating them into `tailwind.config.js`'s theme (out of scope for this task — that mapping is a later polish pass). For now, `Button` reads colors directly from `useTheme()` and applies them via the `style` prop, while still using NativeWind `className` for layout/shape (padding, radius, flex alignment) that doesn't depend on the token values. This keeps the component consumable today without blocking on a tailwind-theme-mapping task.

```tsx
// src/design/components/Button.tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Button.test.tsx`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/design/components/Button.tsx src/design/components/Button.test.tsx
git commit -m "feat: add Button primitive with primary/secondary/tertiary variants"
```

---

### Task 5: Card primitive

**Files:**
- Create: `src/design/components/Card.tsx`
- Test: `src/design/components/Card.test.tsx`

**Interfaces:**
- Consumes: `useTheme` from `src/design/ThemeProvider.tsx` (Task 3).
- Produces: `Card` component with props `{ children: React.ReactNode; variant?: 'surface' | 'elevated' }` — consumed by every future screen (transaction rows, goal cards, friction sheet).

- [ ] **Step 1: Write the failing tests**

```tsx
// src/design/components/Card.test.tsx
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { Card } from './Card';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider scheme="dark">{ui}</ThemeProvider>);
}

describe('Card', () => {
  it('renders its children', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Text>Наушники</Text>
      </Card>,
    );
    expect(getByText('Наушники')).toBeTruthy();
  });

  it('defaults to the surface variant background color', () => {
    const { getByTestId } = renderWithTheme(
      <Card>
        <Text>Наушники</Text>
      </Card>,
    );
    expect(getByTestId('card')).toHaveProp('style', expect.objectContaining({ backgroundColor: '#14181A' }));
  });

  it('uses the elevated variant background color when specified', () => {
    const { getByTestId } = renderWithTheme(
      <Card variant="elevated">
        <Text>Наушники</Text>
      </Card>,
    );
    expect(getByTestId('card')).toHaveProp('style', expect.objectContaining({ backgroundColor: '#1D2422' }));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- Card.test.tsx`
Expected: FAIL — `Cannot find module './Card'`

- [ ] **Step 3: Implement**

```tsx
// src/design/components/Card.tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Card.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/design/components/Card.tsx src/design/components/Card.test.tsx
git commit -m "feat: add Card primitive with surface/elevated variants"
```

---

### Task 6: formatMoney helper and AmountText primitive

**Files:**
- Modify: `src/lib/money.ts`
- Modify: `src/lib/money.test.ts`
- Create: `src/design/components/AmountText.tsx`
- Test: `src/design/components/AmountText.test.tsx`

**Interfaces:**
- Consumes: `Money`, `toMajor` from `src/lib/money.ts`; `useTheme` from `src/design/ThemeProvider.tsx` (Task 3).
- Produces: `formatMoney(money: Money): string` (added to `src/lib/money.ts`), `AmountText` component with props `{ money: Money; kind?: 'income' | 'expense' | 'neutral'; style?: 'display' | 'body' | 'bodyStrong' }` — consumed by every future screen showing a money value.

- [ ] **Step 1: Write the failing test for formatMoney**

Add to the end of `src/lib/money.test.ts` (do not remove existing tests):
```typescript
describe('formatMoney', () => {
  it('formats a positive amount with two decimal places and the currency code', () => {
    expect(formatMoney(money(12550, 'PLN'))).toBe('125.50 PLN');
  });

  it('formats a whole-number amount with trailing zeros', () => {
    expect(formatMoney(money(500000, 'USD'))).toBe('5000.00 USD');
  });

  it('formats a negative amount with a leading minus sign', () => {
    expect(formatMoney(money(-2500, 'RUB'))).toBe('-25.00 RUB');
  });
});
```
And update the import line at the top of the file to include `formatMoney`:
```typescript
import { money, fromMajor, toMajor, addMoney, subtractMoney, convertMoney, formatMoney } from './money';
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- money.test.ts`
Expected: FAIL — `formatMoney is not a function` (or `TypeError`)

- [ ] **Step 3: Implement formatMoney**

Add to the end of `src/lib/money.ts`:
```typescript
export function formatMoney(value: Money): string {
  return `${toMajor(value).toFixed(2)} ${value.currency}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- money.test.ts`
Expected: PASS (12 tests — 9 existing + 3 new)

- [ ] **Step 5: Write the failing test for AmountText**

```tsx
// src/design/components/AmountText.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { AmountText } from './AmountText';
import { money } from '../../lib/money';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider scheme="dark">{ui}</ThemeProvider>);
}

describe('AmountText', () => {
  it('renders the formatted amount', () => {
    const { getByText } = renderWithTheme(<AmountText money={money(12550, 'PLN')} />);
    expect(getByText('125.50 PLN')).toBeTruthy();
  });

  it('colors an income amount with the success token', () => {
    const { getByText } = renderWithTheme(<AmountText money={money(12550, 'PLN')} kind="income" />);
    expect(getByText('125.50 PLN').props.style).toEqual(
      expect.objectContaining({ color: '#34D399' }),
    );
  });

  it('colors an expense amount with the primary text token by default', () => {
    const { getByText } = renderWithTheme(<AmountText money={money(12550, 'PLN')} kind="expense" />);
    expect(getByText('125.50 PLN').props.style).toEqual(
      expect.objectContaining({ color: '#F5F7F3' }),
    );
  });

  it('applies the display typography scale when style="display"', () => {
    const { getByText } = renderWithTheme(<AmountText money={money(12550, 'PLN')} style="display" />);
    expect(getByText('125.50 PLN').props.style).toEqual(
      expect.objectContaining({ fontSize: 34, fontWeight: '800' }),
    );
  });

  it('applies the body typography scale by default', () => {
    const { getByText } = renderWithTheme(<AmountText money={money(12550, 'PLN')} />);
    expect(getByText('125.50 PLN').props.style).toEqual(
      expect.objectContaining({ fontSize: 16, fontWeight: '400' }),
    );
  });
});
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `npm test -- AmountText.test.tsx`
Expected: FAIL — `Cannot find module './AmountText'`

- [ ] **Step 7: Implement**

```tsx
// src/design/components/AmountText.tsx
import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { formatMoney, type Money } from '../../lib/money';

export interface AmountTextProps {
  money: Money;
  kind?: 'income' | 'expense' | 'neutral';
  style?: 'display' | 'body' | 'bodyStrong';
}

export function AmountText({ money: value, kind = 'neutral', style = 'body' }: AmountTextProps) {
  const theme = useTheme();

  // Only income gets the special success-green treatment; expense and neutral
  // both stay neutral text — `danger` is reserved for over-budget/error states
  // a future screen-level component applies explicitly, not the default
  // per-row expense color.
  const color = kind === 'income' ? theme.colors.success : theme.colors.textPrimary;
  const typographyStyle = theme.typography[style];

  return (
    <Text style={{ color, fontSize: typographyStyle.fontSize, fontWeight: typographyStyle.fontWeight }}>
      {formatMoney(value)}
    </Text>
  );
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm test -- AmountText.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 9: Full suite check**

Run: `npm run typecheck && npm run lint && npm test`
Expected: 0 typecheck errors, 0 lint errors/warnings, all tests passing (65 + 3 formatMoney + 4 ThemeProvider + 6 Button + 3 Card + 5 AmountText + 9 tokens = 95 total — recount from actual output, don't assume this number is exact).

- [ ] **Step 10: Commit**

```bash
git add src/lib/money.ts src/lib/money.test.ts src/design/components/AmountText.tsx src/design/components/AmountText.test.tsx
git commit -m "feat: add formatMoney helper and AmountText primitive"
```

---

## Definition of Done for this plan

- `npm run lint`, `npm run typecheck`, and `npm test` all pass with zero failures.
- NativeWind is installed and configured; `App.tsx` imports `global.css`.
- `src/design/tokens.ts` has zero React/React Native imports and matches the design addendum's hex values exactly.
- `ThemeProvider`/`useTheme` resolve the correct token set and are consumed by all three primitives.
- `Button`, `Card`, `AmountText` are each tested on behavior/content/accessibility, never on computed CSS.
- No screen, navigation, or app-entry wiring of `ThemeProvider` into `App.tsx` exists yet — that's the next (screens) plan, which will also decide the navigation library.
