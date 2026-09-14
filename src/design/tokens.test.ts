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
