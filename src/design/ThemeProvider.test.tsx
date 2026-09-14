import React from 'react';
import * as ReactNative from 'react-native';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from './ThemeProvider';

function Probe() {
  const theme = useTheme();
  return <Text testID="probe">{theme.colors.accent}</Text>;
}

describe('ThemeProvider / useTheme', () => {
  it('provides the dark theme by default when scheme is not overridden and system scheme is unavailable', async () => {
    // jest-expo's default useColorScheme mock returns 'light', so to actually exercise the
    // "system scheme unavailable" fallback we mock it to return null here, as it would on a
    // device/browser that can't report a color scheme. (The installed react-native type
    // definitions omit null/undefined from ColorSchemeName even though the real API can and
    // does return them, hence the cast.)
    const spy = jest
      .spyOn(ReactNative, 'useColorScheme')
      .mockReturnValue(null as unknown as ReactNative.ColorSchemeName);
    const { getByTestId } = await render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(getByTestId('probe').props.children).toBe('#7EC8F2');
    spy.mockRestore();
  });

  it('provides the light theme when scheme="light" is passed explicitly', async () => {
    const { getByTestId } = await render(
      <ThemeProvider scheme="light">
        <Probe />
      </ThemeProvider>,
    );
    expect(getByTestId('probe').props.children).toBe('#1E7FB8');
  });

  it('provides the dark theme when scheme="dark" is passed explicitly', async () => {
    const { getByTestId } = await render(
      <ThemeProvider scheme="dark">
        <Probe />
      </ThemeProvider>,
    );
    expect(getByTestId('probe').props.children).toBe('#7EC8F2');
  });

  it('throws a clear error when useTheme is called outside a ThemeProvider', async () => {
    function Orphan() {
      useTheme();
      return null;
    }
    // Suppress the expected React error-boundary console output for this one assertion
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // @testing-library/react-native v14's render() is async (backed by React 19's concurrent
    // test renderer), so a render-time throw surfaces as a rejected promise rather than a
    // synchronous throw.
    await expect(render(<Orphan />)).rejects.toThrow('useTheme must be used within a ThemeProvider');
    spy.mockRestore();
  });
});
