# App Shell & Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bare Expo template entry with Expo Router, wire `ThemeProvider` app-wide, and ship a navigable shell — a 4-tab bottom bar with a floating quick-capture button in the center — with placeholder screens, so the next plans can fill in real screen content instead of also inventing navigation.

**Architecture:** Route files (`app/**`) stay thin — they compose already-tested pieces (`Screen`, `CustomTabBar`, `tabBarAdapter`) and are verified by typecheck, not unit tests (Expo Router's file-based routing depends on Metro's context resolution, which a plain Jest run doesn't replicate faithfully — testing it there would verify a mock, not the real thing). The actual logic — what the tab bar renders, how a React Navigation tab-bar render-prop maps to our own component's props — lives in plain, fully unit-tested modules under `src/`.

**Tech Stack:** `expo-router` (file-based routing, wraps React Navigation), `react-native-safe-area-context` (already installed, Plan 2 Task 1), the existing `ThemeProvider`/tokens/`Button`/`Card` from Plan 2.

**Spec:** `docs/superpowers/specs/2026-09-14-raschod-design.md` (names Expo Router as the routing choice), `docs/superpowers/specs/2026-09-14-quick-capture-ux-addendum.md` (the floating quick-capture button must be part of the shell from this plan, not added later).

## Global Constraints

- Files under `app/` are routes or layouts only — no test files there (Expo Router requirement). Tests for navigation logic live in `src/navigation/` (co-located, like every other module) or `__tests__/` at the project root for anything that must sit outside `app/`.
- `src/navigation/**` files (the adapter, `CustomTabBar`) must not import `expo-router` directly where a plain function/props interface is enough — keeps them unit-testable without router mocking.
- Every route file (`app/**`) is intentionally minimal — a placeholder screen or thin composition — and is NOT unit-tested; it is verified by `npm run typecheck` passing and is expected to be manually confirmed with `npm start` (Expo Go or a dev build) since this repo has no device/simulator available in this environment.
- Commit after each task, Conventional Commits, ending with:
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01CJK6Deau3G4vnNiRoDjNcr`.
- Keep `npm run lint` and `npm run typecheck` green after every task (currently 0/0 and 0 errors). `npm test`'s count grows with each testable task below; a route-only task does not add tests and must say so explicitly in its verification step rather than silently.

---

### Task 1: Install and configure Expo Router

**Files:**
- Modify: `package.json` (dependencies, `main` entry)
- Modify: `app.json` (`plugins`, add `scheme`, `userInterfaceStyle` → `"automatic"`)
- Delete: `App.tsx`, `index.ts` (Expo Router replaces this entry point)
- Create: `app/_layout.tsx` (minimal root layout — full version lands in Task 5)
- Create: `app/index.tsx` (minimal placeholder — replaced by the real tab structure in Task 5)

**Interfaces:**
- Produces: a working Expo Router entry point. No new exported TS interfaces.

- [x] **Step 1: Install dependencies**

Run:
```bash
npx expo install expo-router react-native-screens expo-linking expo-constants
```
(`react-native-safe-area-context` and `react-native-reanimated` are already installed from Plan 2 Task 1.)

- [x] **Step 2: Update `package.json`'s entry point**

Change `"main": "index.ts"` to:
```json
"main": "expo-router/entry",
```

- [x] **Step 3: Update `app.json`**

```json
{
  "expo": {
    "name": "raschod",
    "slug": "raschod",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "raschod",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": ["expo-sqlite", "expo-router"]
  }
}
```

- [x] **Step 4: Remove the old template entry files**

```bash
git rm App.tsx index.ts
```

- [x] **Step 5: Create the minimal root layout**

```tsx
// app/_layout.tsx
import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [x] **Step 6: Create a minimal placeholder index route**

```tsx
// app/index.tsx
import { Text, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Raschod</Text>
    </View>
  );
}
```

- [x] **Step 7: Verify**

Run: `npm run typecheck && npm run lint`
Expected: both clean. `npm test` is not run as a pass/fail gate for this step — this task adds no tests (route/config only) — but confirm it still reports the same test count as before this task, so you know nothing else broke.

- [x] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: install and configure Expo Router as the app entry point"
```

Manual verification note (cannot be automated in this environment): after this task, `npm start` should boot the app to the placeholder "Raschod" text with no red-screen error. If you have a way to run this (Expo Go, a connected device, or `expo start --web`), do it and note the result in your report; if not, say so plainly rather than claiming it was verified.

---

### Task 2: Screen primitive

**Files:**
- Create: `src/design/components/Screen.tsx`
- Test: `src/design/components/Screen.test.tsx`

**Interfaces:**
- Consumes: `useTheme` from `src/design/ThemeProvider.tsx` (Plan 2).
- Produces: `Screen` component with props `{ children: React.ReactNode }` — every route screen wraps its content in this, giving every screen the correct themed background and safe-area insets for free.

- [x] **Step 1: Write the failing test**

```tsx
// src/design/components/Screen.test.tsx
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../ThemeProvider';
import { Screen } from './Screen';

function renderScreen(ui: React.ReactElement) {
  // SafeAreaProvider is required by react-native-safe-area-context outside a
  // real native host (Jest has no window insets) — without it, SafeAreaView
  // renders with a console warning about missing safe area context.
  return render(
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
      <ThemeProvider scheme="dark">{ui}</ThemeProvider>
    </SafeAreaProvider>,
  );
}

describe('Screen', () => {
  it('renders its children', async () => {
    const { getByText } = await renderScreen(
      <Screen>
        <Text>Главная</Text>
      </Screen>,
    );
    expect(getByText('Главная')).toBeTruthy();
  });
});
```

If `render` is not async in the installed `@testing-library/react-native` version, drop the `await` — check what the rest of the `src/design` test suite already does (Tasks 3-6 of the previous plan settled this) and match it.

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- Screen.test.tsx`
Expected: FAIL — `Cannot find module './Screen'`

- [x] **Step 3: Implement**

```tsx
// src/design/components/Screen.tsx
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
```

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- Screen.test.tsx`
Expected: PASS (1 test)

- [x] **Step 5: Commit**

```bash
git add src/design/components/Screen.tsx src/design/components/Screen.test.tsx
git commit -m "feat: add Screen primitive with themed background and safe-area insets"
```

---

### Task 3: CustomTabBar primitive

**Files:**
- Create: `src/navigation/CustomTabBar.tsx`
- Test: `src/navigation/CustomTabBar.test.tsx`

**Interfaces:**
- Consumes: `useTheme` from `src/design/ThemeProvider.tsx` (Plan 2).
- Produces: `TabBarItem` (`{ key: string; label: string }`), `CustomTabBar` component with props `{ tabs: TabBarItem[]; activeKey: string; onTabPress: (key: string) => void; onCapturePress: () => void }` — a plain, framework-agnostic component with no `expo-router` import, so it is fully unit-testable and reusable if the routing library ever changes.

- [x] **Step 1: Write the failing tests**

```tsx
// src/navigation/CustomTabBar.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../design/ThemeProvider';
import { CustomTabBar, type TabBarItem } from './CustomTabBar';

const tabs: TabBarItem[] = [
  { key: 'index', label: 'Главная' },
  { key: 'history', label: 'История' },
  { key: 'goals', label: 'Цели' },
  { key: 'settings', label: 'Настройки' },
];

function renderTabBar(overrides: Partial<React.ComponentProps<typeof CustomTabBar>> = {}) {
  const onTabPress = jest.fn();
  const onCapturePress = jest.fn();
  const utils = render(
    <ThemeProvider scheme="dark">
      <CustomTabBar tabs={tabs} activeKey="index" onTabPress={onTabPress} onCapturePress={onCapturePress} {...overrides} />
    </ThemeProvider>,
  );
  return { ...utils, onTabPress, onCapturePress };
}

describe('CustomTabBar', () => {
  it('renders every tab label', () => {
    const { getByText } = renderTabBar();
    for (const tab of tabs) {
      expect(getByText(tab.label)).toBeTruthy();
    }
  });

  it('calls onTabPress with the pressed tab key', () => {
    const { getByText, onTabPress } = renderTabBar();
    fireEvent.press(getByText('История'));
    expect(onTabPress).toHaveBeenCalledWith('history');
  });

  it('marks the active tab as selected for accessibility', () => {
    const { getByText } = renderTabBar({ activeKey: 'goals' });
    expect(getByText('Цели').props.parent?.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it('calls onCapturePress when the floating capture button is pressed', () => {
    const { getByLabelText, onCapturePress } = renderTabBar();
    fireEvent.press(getByLabelText('Быстрый ввод'));
    expect(onCapturePress).toHaveBeenCalledTimes(1);
  });
});
```

If the "marks the active tab" test's exact prop-traversal (`.props.parent?.props...`) doesn't match how testing-library exposes the pressable ancestor in the installed version, query by role/label instead — e.g. `getByRole('tab', { name: 'Цели' })` and assert on `.props.accessibilityState.selected` directly. Adapt and document; the intent (active tab is marked selected) is what matters.

- [x] **Step 2: Run tests to verify they fail**

Run: `npm test -- CustomTabBar.test.tsx`
Expected: FAIL — `Cannot find module './CustomTabBar'`

- [x] **Step 3: Implement**

```tsx
// src/navigation/CustomTabBar.tsx
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
```

- [x] **Step 4: Run tests to verify they pass**

Run: `npm test -- CustomTabBar.test.tsx`
Expected: PASS (4 tests)

- [x] **Step 5: Commit**

```bash
git add src/navigation/CustomTabBar.tsx src/navigation/CustomTabBar.test.tsx
git commit -m "feat: add CustomTabBar with a floating quick-capture button"
```

---

### Task 4: Tab bar adapter (pure mapping function)

**Files:**
- Create: `src/navigation/tabBarAdapter.ts`
- Test: `src/navigation/tabBarAdapter.test.ts`

**Interfaces:**
- Consumes: `TabBarItem` from `src/navigation/CustomTabBar.tsx` (Task 3).
- Produces: `TAB_LABELS` (route-name → display-label map), `toCustomTabBarProps(routeNames, activeRouteName, onTabPress, onCapturePress)` — a plain function with no `expo-router` or React Navigation import, called from the real tab layout route file (Task 5) to build `CustomTabBar`'s props from whatever shape React Navigation's `tabBar` render-prop actually hands it. Keeping this mapping in a tested, framework-free function means the untested route file (Task 5) is a one-line call, not logic.

- [x] **Step 1: Write the failing tests**

```typescript
// src/navigation/tabBarAdapter.test.ts
import { toCustomTabBarProps, TAB_LABELS } from './tabBarAdapter';

describe('TAB_LABELS', () => {
  it('has a Russian label for every shell route', () => {
    expect(TAB_LABELS).toEqual({
      index: 'Главная',
      history: 'История',
      goals: 'Цели',
      settings: 'Настройки',
    });
  });
});

describe('toCustomTabBarProps', () => {
  it('maps route names to labeled tabs in order', () => {
    const onTabPress = jest.fn();
    const onCapturePress = jest.fn();
    const props = toCustomTabBarProps(['index', 'history', 'goals', 'settings'], 'history', onTabPress, onCapturePress);

    expect(props.tabs).toEqual([
      { key: 'index', label: 'Главная' },
      { key: 'history', label: 'История' },
      { key: 'goals', label: 'Цели' },
      { key: 'settings', label: 'Настройки' },
    ]);
    expect(props.activeKey).toBe('history');
  });

  it('falls back to the raw route name when no label is defined', () => {
    const props = toCustomTabBarProps(['mystery-route'], 'mystery-route', jest.fn(), jest.fn());
    expect(props.tabs).toEqual([{ key: 'mystery-route', label: 'mystery-route' }]);
  });

  it('passes onTabPress and onCapturePress through unchanged', () => {
    const onTabPress = jest.fn();
    const onCapturePress = jest.fn();
    const props = toCustomTabBarProps(['index'], 'index', onTabPress, onCapturePress);

    props.onTabPress('index');
    props.onCapturePress();

    expect(onTabPress).toHaveBeenCalledWith('index');
    expect(onCapturePress).toHaveBeenCalledTimes(1);
  });
});
```

- [x] **Step 2: Run tests to verify they fail**

Run: `npm test -- tabBarAdapter.test.ts`
Expected: FAIL — `Cannot find module './tabBarAdapter'`

- [x] **Step 3: Implement**

```typescript
// src/navigation/tabBarAdapter.ts
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
```

- [x] **Step 4: Run tests to verify they pass**

Run: `npm test -- tabBarAdapter.test.ts`
Expected: PASS (3 tests)

- [x] **Step 5: Commit**

```bash
git add src/navigation/tabBarAdapter.ts src/navigation/tabBarAdapter.test.ts
git commit -m "feat: add tabBarAdapter mapping route state to CustomTabBar props"
```

---

### Task 5: Wire the real navigation tree

**Files:**
- Modify: `app/_layout.tsx` (replace the Task 1 placeholder with the real root layout)
- Modify: `app/index.tsx` → replaced by the tab group below (delete the file)
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/index.tsx`
- Create: `app/(tabs)/history.tsx`
- Create: `app/(tabs)/goals.tsx`
- Create: `app/(tabs)/settings.tsx`
- Create: `app/capture.tsx`

**Interfaces:**
- Consumes: `ThemeProvider` (Plan 2), `Screen` (Task 2), `CustomTabBar` (Task 3), `toCustomTabBarProps` (Task 4).
- Produces: the app's real navigable shell. No new exported TS interfaces — this task is composition, not logic, and per the Global Constraints is verified by typecheck, not a new automated test.

- [x] **Step 1: Replace the root layout**

```tsx
// app/_layout.tsx
import '../global.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/design/ThemeProvider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="capture" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
```

- [x] **Step 2: Remove the Task-1 placeholder index route**

```bash
git rm app/index.tsx
```

- [x] **Step 3: Create the tabs layout**

```tsx
// app/(tabs)/_layout.tsx
import { Tabs, router } from 'expo-router';
import { CustomTabBar } from '../../src/navigation/CustomTabBar';
import { toCustomTabBarProps } from '../../src/navigation/tabBarAdapter';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        const routeNames = props.state.routes.map((route) => route.name);
        const activeRouteName = props.state.routes[props.state.index].name;
        const tabBarProps = toCustomTabBarProps(
          routeNames,
          activeRouteName,
          (key) => props.navigation.navigate(key),
          () => router.push('/capture'),
        );
        return <CustomTabBar {...tabBarProps} />;
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="goals" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
```

If the installed `expo-router`/React Navigation version's `tabBar` render-prop shape differs from `props.state.routes` / `props.state.index` / `props.navigation.navigate` (e.g. a renamed field), inspect the actual type error TypeScript reports and adapt to the real shape — document the exact difference found in your report so the next reader isn't surprised.

- [x] **Step 4: Create the four placeholder tab screens**

```tsx
// app/(tabs)/index.tsx
import { Text } from 'react-native';
import { Screen } from '../../src/design/components/Screen';

export default function HomeScreen() {
  return (
    <Screen>
      <Text>Главная</Text>
    </Screen>
  );
}
```

```tsx
// app/(tabs)/history.tsx
import { Text } from 'react-native';
import { Screen } from '../../src/design/components/Screen';

export default function HistoryScreen() {
  return (
    <Screen>
      <Text>История</Text>
    </Screen>
  );
}
```

```tsx
// app/(tabs)/goals.tsx
import { Text } from 'react-native';
import { Screen } from '../../src/design/components/Screen';

export default function GoalsScreen() {
  return (
    <Screen>
      <Text>Цели</Text>
    </Screen>
  );
}
```

```tsx
// app/(tabs)/settings.tsx
import { Text } from 'react-native';
import { Screen } from '../../src/design/components/Screen';

export default function SettingsScreen() {
  return (
    <Screen>
      <Text>Настройки</Text>
    </Screen>
  );
}
```

- [x] **Step 5: Create the capture modal placeholder**

```tsx
// app/capture.tsx
import { Text } from 'react-native';
import { Screen } from '../src/design/components/Screen';

export default function CaptureScreen() {
  return (
    <Screen>
      <Text>Быстрый ввод — скоро</Text>
    </Screen>
  );
}
```

- [x] **Step 6: Verify**

Run: `npm run typecheck && npm run lint && npm test`
Expected: typecheck and lint clean; test count unchanged from before this task (this task adds no new tests — it wires already-tested pieces together in route files, per the Global Constraints).

- [x] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: wire ThemeProvider, Screen, and CustomTabBar into the real navigation tree"
```

Manual verification note (cannot be automated in this environment): after this task, `npm start` should boot to the Home tab, show all four tab labels plus the floating "+" button, switch screens on tab press, and open the "Быстрый ввод — скоро" screen as a modal when "+" is pressed. If you have a way to run this, do it and note the result in your report; if not, say so plainly.

---

## Definition of Done for this plan

- `npm run lint` and `npm run typecheck` pass with zero errors/warnings.
- `npm test` passes with all prior tests plus the new ones from Tasks 2-4 (Screen: 1, CustomTabBar: 4, tabBarAdapter: 3 — 8 new tests on top of the 95 from Plan 2).
- The app's entry point is Expo Router (`expo-router/entry`); the old `App.tsx`/`index.ts` template files are gone.
- Every screen (tabs + capture) renders through `Screen`, so every screen automatically gets the correct themed background and safe-area insets.
- The floating quick-capture button is part of the shell itself, reachable from every tab, not bolted onto an existing tab bar.
- Route files (`app/**`) contain no business logic — only composition of already-tested components, consistent with the Global Constraints.
- No real screen content, no SQLite-backed data on screen, and no friction-flow UI exist yet — those are the next plans (per the quick-capture UX addendum: Home, then Add-Transaction + friction cards).
